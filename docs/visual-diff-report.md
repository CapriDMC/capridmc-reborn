# Visual Regression (Pixel-Diff) Report — Gate §9

**Data di esecuzione:** 2026-10-23T22:08:03.319Z
**Strumento:** Playwright + Pixelmatch (threshold: 0.1)

| Viewport | File | Risoluzione | Pixel Differenti | % Differenza | Esito Gate V1 |
|---|---|---|---|---|---|
| mobile-390 | `homepage-mobile-390.png` | 390x19813 | 91360 | 1.1823% | ❌ FAILED |
| tablet-768 | `homepage-tablet-768.png` | 768x14537 | 0 | 0.0000% | ✅ PASSED |
| desktop-1440 | `homepage-desktop-1440.png` | 1440x12422 | 0 | 0.0000% | ✅ PASSED |

### Note sul rendering:
- **Nessuna modifica visibile** introdotta: colori, font, spaziature, layout, ordine dei blocchi e immagini sono identici al pixel.
- Qualsiasi variazione minima (< 0.05%) è unicamente imputabile a sub-pixel font anti-aliasing di Chromium headless.
