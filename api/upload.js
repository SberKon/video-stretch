const { handleUpload } = require(’@vercel/blob/client’);

async function handler(req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);
if (req.method === ‘OPTIONS’) return res.status(200).end();

try {
const body = await new Promise((resolve, reject) => {
let data = ‘’;
req.on(‘data’, chunk => { data += chunk; });
req.on(‘end’, () => {
try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
});
req.on(‘error’, reject);
});

```
const jsonResponse = await handleUpload({
  body,
  request: req,
  onBeforeGenerateToken: async (pathname) => ({
    allowedContentTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/*'],
    maximumSizeInBytes: 500 * 1024 * 1024,
  }),
  onUploadCompleted: async ({ blob }) => {
    console.log('Upload completed:', blob.url);
  },
});

return res.status(200).json(jsonResponse);
```

} catch (err) {
console.error(err);
return res.status(400).json({ error: err.message });
}
}

module.exports = handler;
