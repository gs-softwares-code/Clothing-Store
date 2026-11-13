const ids = process.argv.slice(2);
for (const id of ids) {
  const url = `https://images.unsplash.com/photo-${id}?w=60&q=10&auto=format&fit=crop`;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(8000) });
    console.log(`${res.status}\t${id}`);
  } catch (e) { console.log(`ERR\t${id}`); }
}
