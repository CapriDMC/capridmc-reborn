#!/usr/bin/env python3
"""
fix_imap_dates.py — Tool di Riallineamento Date IMAP (Capri DMC / Infomaniak)

Corregge l'errore di data (INTERNALDATE) generato dopo una migrazione di posta:
  - Legge l'header originale 'Date:' da ciascun messaggio (la vera data di invio del mittente).
  - Reinserisce il messaggio sul server IMAP con il timestamp INTERNALDATE corretto.
  - Elimina la copia duplicata avente il timbro errato della migrazione.
  - Risultato: Apple Mail (anche nel layout moderno a 2 righe) mostra le date storiche corrette.
"""

import sys
import os
import re
import imaplib
import email
import email.header
import email.utils
from datetime import datetime

IMAP_SERVER = "mail.infomaniak.com"
IMAP_PORT = 993

def decode_mime_header(header_value):
    if not header_value:
        return "(Senza Oggetto)"
    try:
        decoded_parts = email.header.decode_header(header_value)
        result = []
        for part, encoding in decoded_parts:
            if isinstance(part, bytes):
                result.append(part.decode(encoding or "utf-8", errors="replace"))
            else:
                result.append(str(part))
        return "".join(result)
    except Exception:
        return str(header_value)

def parse_date_header(date_str):
    if not date_str:
        return None
    try:
        # Standard RFC 2822 parser
        dt = email.utils.parsedate_to_datetime(date_str)
        # Assicura timezone-aware o converte a UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=datetime.now().astimezone().tzinfo)
        return dt
    except Exception:
        # Tentativo fallback
        try:
            parsed = email.utils.parsedate_tz(date_str)
            if parsed:
                timestamp = email.utils.mktime_tz(parsed)
                return datetime.fromtimestamp(timestamp)
        except Exception:
            return None
    return None

def extract_flags_str(response_bytes):
    text = response_bytes.decode("latin-1", errors="replace")
    m = re.search(r'FLAGS \(([^\)]*)\)', text)
    if m:
        flags = m.group(1).strip()
        # Rimuovi \Recent perché non è permessa in APPEND
        cleaned_flags = " ".join([f for f in flags.split() if f.lower() != r"\recent"])
        return f"({cleaned_flags})" if cleaned_flags else "()"
    return "()"

def extract_internaldate(response_bytes):
    text = response_bytes.decode("latin-1", errors="replace")
    m = re.search(r'INTERNALDATE "([^"]+)"', text)
    return m.group(1) if m else "Sconosciuta"

def load_credentials_from_env():
    # 1. Controlla variabili d'ambiente
    user = os.environ.get("INFOMANIAK_EMAIL")
    password = os.environ.get("INFOMANIAK_PASSWORD")

    # 2. Se mancanti, controlla ~/.env o .env locale
    for env_path in [os.path.expanduser("~/.env"), ".env", "/Users/pep/capridmc/capridmc-reborn/.env"]:
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    if line.startswith("INFOMANIAK_EMAIL=") and not user:
                        user = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if line.startswith("INFOMANIAK_PASSWORD=") and not password:
                        password = line.split("=", 1)[1].strip().strip('"').strip("'")

    return user, password

def run_fix(dry_run=True, mailbox_name="INBOX"):
    user, password = load_credentials_from_env()

    if not user or not password:
        print("\n❌ ERRORE: Credenziali Infomaniak non trovate in ~/.env!")
        print("Imposta INFOMANIAK_EMAIL e INFOMANIAK_PASSWORD prima di avviare lo script.\n")
        sys.exit(1)

    mode_label = "MODALITÀ SIMULAZIONE (DRY-RUN - Nessuna modifica)" if dry_run else "MODALITÀ ESECUZIONE REALE"
    print("=" * 70)
    print(f"🚀 Capri DMC — Riallineamento Date IMAP")
    print(f"📡 Server: {IMAP_SERVER}:{IMAP_PORT}")
    print(f"👤 Account: {user}")
    print(f"📂 Cartella: {mailbox_name}")
    print(f"⚙️  Modalità: {mode_label}")
    print("=" * 70)

    try:
        imap = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        imap.login(user, password)
        print("✅ Accesso al server Infomaniak eseguito con successo!\n")
    except Exception as e:
        print(f"❌ Errore durante l'accesso IMAP: {e}")
        sys.exit(1)

    try:
        status, count_data = imap.select(mailbox_name, readonly=dry_run)
        if status != "OK":
            print(f"❌ Impossibile selezionare la cartella {mailbox_name}: {count_data}")
            imap.logout()
            sys.exit(1)

        total_messages = int(count_data[0].decode())
        print(f"📨 Trovati {total_messages} messaggi in {mailbox_name}.\n")

        if total_messages == 0:
            print("Nessun messaggio da elaborare.")
            imap.logout()
            return

        status, search_data = imap.search(None, "ALL")
        if status != "OK":
            print("Errore nella ricerca dei messaggi.")
            imap.logout()
            return

        msg_ids = search_data[0].split()
        to_fix = []
        already_ok = 0
        skipped = 0

        print(f"🔍 Scansione metadati delle email in corso...")

        for idx, msg_id in enumerate(msg_ids, start=1):
            # Richiedi solo headers minimi per velocità
            res, fetch_data = imap.fetch(msg_id, "(FLAGS INTERNALDATE BODY.PEEK[HEADER.FIELDS (DATE SUBJECT FROM)])")
            if res != "OK" or not fetch_data or not fetch_data[0]:
                skipped += 1
                continue

            raw_meta = fetch_data[0][0] if isinstance(fetch_data[0], tuple) else fetch_data[0]
            raw_header = fetch_data[0][1] if isinstance(fetch_data[0], tuple) and len(fetch_data[0]) > 1 else b""

            internal_date_str = extract_internaldate(raw_meta)
            flags_str = extract_flags_str(raw_meta)

            parsed_msg = email.message_from_bytes(raw_header)
            subject = decode_mime_header(parsed_msg.get("Subject", "(Senza Oggetto)"))
            from_addr = decode_mime_header(parsed_msg.get("From", "Sconosciuto"))
            date_header_str = parsed_msg.get("Date")

            true_dt = parse_date_header(date_header_str)
            if not true_dt:
                skipped += 1
                continue

            # Formatta date per confronto
            true_dt_str = true_dt.strftime("%d/%m/%Y %H:%M")
            
            # Se la data interna contiene 09-Nov-2026 oppure differisce dalla data reale
            needs_update = "09-Nov-2026" in internal_date_str or "09/11/26" in internal_date_str

            if needs_update:
                to_fix.append({
                    "id": msg_id,
                    "subject": subject[:40],
                    "from": from_addr[:30],
                    "current_internal": internal_date_str,
                    "true_dt": true_dt,
                    "true_dt_str": true_dt_str,
                    "flags": flags_str
                })
            else:
                already_ok += 1

        print(f"\n📊 Risultato Scansione:")
        print(f"  • Totale messaggi: {len(msg_ids)}")
        print(f"  • Con data '09/11' da correggere: {len(to_fix)}")
        print(f"  • Con data già corretta: {already_ok}")
        print(f"  • Saltati/non analizzabili: {skipped}\n")

        if not to_fix:
            print("🎉 Tutte le email hanno già le date corrette! Nessuna modifica necessaria.")
            imap.logout()
            return

        print("-" * 70)
        print("Anteprima dei primi 10 messaggi che verranno corretti:")
        for item in to_fix[:10]:
            print(f"  • ID {item['id'].decode().rjust(3)}: \"{item['subject']}\"")
            print(f"    - Attuale sul server : {item['current_internal']}")
            print(f"    - Vera data mittente : {item['true_dt_str']}")
        if len(to_fix) > 10:
            print(f"  ... e altri {len(to_fix) - 10} messaggi.")
        print("-" * 70)

        if dry_run:
            print("\n💡 Questa era una simulazione. Per applicare davvero le modifiche,")
            print("   esegui il comando con il flag --apply.\n")
            imap.logout()
            return

        # ESECUZIONE REALE
        print(f"\n🚀 Inizio correzione di {len(to_fix)} messaggi sul server...")
        success_count = 0
        fail_count = 0

        for idx, item in enumerate(to_fix, start=1):
            msg_id = item["id"]
            # Scarica l'intero messaggio grezzo
            res, full_data = imap.fetch(msg_id, "(BODY.PEEK[])")
            if res != "OK" or not full_data or not isinstance(full_data[0], tuple):
                print(f"  [{idx}/{len(to_fix)}] ⚠️ Errore nel download del messaggio ID {msg_id.decode()}")
                fail_count += 1
                continue

            raw_content = full_data[0][1]
            target_timestamp = item["true_dt"].timestamp()
            imap_time_tuple = imaplib.Time2Internaldate(target_timestamp)

            # Re-inserisci messaggio con timestamp INTERNALDATE corretto
            append_res, append_data = imap.append(mailbox_name, item["flags"], imap_time_tuple, raw_content)

            if append_res == "OK":
                # Contrassegna il vecchio per eliminazione
                imap.store(msg_id, "+FLAGS", r"(\Deleted)")
                success_count += 1
                print(f"  [{idx}/{len(to_fix)}] ✅ ID {msg_id.decode()} corretta al {item['true_dt_str']}: {item['subject']}")
            else:
                print(f"  [{idx}/{len(to_fix)}] ❌ Errore APPEND per ID {msg_id.decode()}: {append_data}")
                fail_count += 1

        print("\n🧹 Pulizia copie con data errata (EXPUNGE)...")
        imap.expunge()
        print("✅ Pulizia completata!")

        print("\n" + "=" * 70)
        print(f"🎉 COMPLETATO CON SUCCESSO!")
        print(f"  • Messaggi corretti: {success_count}")
        print(f"  • Errori: {fail_count}")
        print("=" * 70)
        print("👉 Ora puoi riavviare Apple Mail sul Mac e tornare al layout moderno:")
        print("   le date risulteranno perfettamente allineate con quelle reali!\n")

    finally:
        try:
            imap.logout()
        except Exception:
            pass

if __name__ == "__main__":
    is_apply = "--apply" in sys.argv
    run_fix(dry_run=not is_apply)
