const store = global._videoStore || (global._videoStore = new Map());

function handler(req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
const id = req.query.id;
const entry = store.get(id);
if (!entry) return res.status(404).json({ error: ‘Not found or expired’ });
res.setHeader(‘Content-Type’, entry.contentType);
res.setHeader(‘Content-Length’, entry.buffer.length);
res.setHeader(‘Content-Disposition’, ‘attachment; filename=“stretched_2732x2048.mp4”’);
res.setHeader(‘Cache-Control’, ‘no-store’);
return res.status(200).send(entry.buffer);
}

module.exports = handler;
