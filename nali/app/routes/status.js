const os = require('os');
const pkg = require('../../package.json', 'utf-8');

module.exports = (_, res) => {
    res.json({
        status: 'ok',
        version: pkg.version,
        node: {
            version: process.version,
            versions: process.versions,
            env: {
                NODE_ENV: process.env.NODE_ENV,
                NODE_PORT: process.env.NODE_PORT
            }
        },
        os: {
            platform: os.platform(),
            release: os.release(),
            type: os.type(),
            uptime: os.uptime(),
            version: os.version()
        }
    });
};
