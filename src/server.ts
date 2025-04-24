import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by serving index.html
 */
app.get('*', (req, res) => {
  res.sendFile(resolve(browserDistFolder, 'index.html'));
});

// Start the server
const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
