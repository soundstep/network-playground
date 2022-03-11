#!/usr/bin/env node

const mkcert = require('mkcert');
const fs = require('fs');
const path = require('path');

const writeFile = (p, c) => {
    const filepath = path.resolve(__dirname, p);
    if (!fs.existsSync(filepath)) {
        console.log(`Writing file: ${path.relative('./', filepath)}`);
        fs.writeFileSync(filepath, c, 'utf-8');
      }
};

(async () => {

    // create a certificate authority
    const ca = await mkcert.createCA({
        organization: 'Hello CA',
        countryCode: 'GB',
        state: 'United Kingdom',
        locality: 'London',
        validityDays: 365
    });

    // then create a tls certificate
    const cert = await mkcert.createCert({
        domains: ['*.itv.com', 'itv.com', '127.0.0.1', 'localhost'],
        validityDays: 365,
        caKey: ca.key,
        caCert: ca.cert
    });

    const certsPath = path.resolve(__dirname, '../app/certs');

    writeFile('../app/certs/ca.key', ca.key);
    writeFile('../app/certs/ca.crt', ca.cert);
    writeFile('../app/certs/cert.key', cert.key);
    writeFile('../app/certs/cert.crt', cert.cert);

})();
