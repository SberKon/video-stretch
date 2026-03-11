const store = global._videoStore || (global._videoStore = new Map());

function cleanup() {
const now = Date.now();
for (const [id, entry] of store.entries()) {
if (now - entry.created > 2 * 60 * 60 * 1000) store.delete(id);
}
}

async function handler(req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);

if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).json({ error: ‘Method not allowed’ });

try {
cleanup();

```
const chunks = [];
for await (const chunk of req) chunks.push(chunk);
const buffer = Buffer.concat(chunks);

if (buffer.length === 0) return res.status(400).json({ error: 'Empty body' });

const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
const contentType = req.headers['content-type'] || 'video/mp4';

store.set(id, { buffer, contentType, created: Date.now() });

const proto = req.headers['x-forwarded-proto'] || 'https';
const host = req.headers.host;
const url = `${proto}://${host}/api/video/${id}`;

return res.status(200).json({ id, url });
```

} catch (err) {
return res.status(500).json({ error: err.message });
}
}

handler.config = { api: { bodyParser: false } };
module.exports = handler;
