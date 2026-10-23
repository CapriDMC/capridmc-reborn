const host = 'www.capridmc.com';
const key = 'f63b28b7e08240409741a4a0342ebcb3';
const keyLocation = `https://${host}/${key}.txt`;
const urlList = [
  `https://${host}/`
];

async function submitIndexNow() {
  const payload = {
    host,
    key,
    keyLocation,
    urlList
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log(`IndexNow submission response status: ${res.status}`);
  } catch (err) {
    console.error('IndexNow submission error:', err.message);
  }
}

submitIndexNow();
