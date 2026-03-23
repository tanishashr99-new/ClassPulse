
async function checkDebug() {
  const url = 'http://localhost:3000/api/debug/check';
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Debug fetch error:', err.message);
  }
}

checkDebug();
