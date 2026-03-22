
async function test() {
  const url = 'https://ercoukvflthjbchglyle.supabase.co/rest/v1/leaderboard?select=id&limit=1';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY291a3ZmbHRoamJjaGdseWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzIyMDYsImV4cCI6MjA4OTYwODIwNn0.xstDBFBPHAhqKHgyaCMXVTOaUI0wr7GEJqTdHVjV7tU';
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': anonKey,
        'Authorization': 'Bearer ' + anonKey
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', data);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
test();
