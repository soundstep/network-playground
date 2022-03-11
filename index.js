const http = require('https');
const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT_HTTP = 80;
const PORT_HTTPS = 443;

const privateKey  = fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem'), 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.get('*', (req, res) => {
    console.log('-- received', req.hostname);
    console.log('-- received', req.headers);
    res.send('Hello World!');
});

httpServer.listen(PORT_HTTP, () => {
    console.log(`HTTP listening on port ${PORT_HTTP}`)
});
httpsServer.listen(PORT_HTTPS, () => {
    console.log(`HTTPS listening on port ${PORT_HTTPS}`)
});
