async function testUrl() {
  const url = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800";
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log("Status:", res.status);
    console.log("OK:", res.ok);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testUrl();
