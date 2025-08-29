module.exports = {
    apps: [
        {
            name: 'manypixels',
            script: 'serve',
            autorestart: true,
            env_production: {
                PM2_SERVE_PATH: 'dist',
                PM2_SERVE_PORT: 5173,
                PM2_SERVE_SPA: 'true',
                PM2_SERVE_HOMEPAGE: '/index.html',
                PM2_SERVE_HOST: '::',
                PM2_NO_AUTO_UPGRADE: 'true'
            },
            env_maintenance: {
                PM2_SERVE_PATH: 'dist',
                PM2_SERVE_PORT: 5173,
                PM2_SERVE_SPA: 'true',
                PM2_SERVE_HOST: '::',
                PM2_SERVE_HOMEPAGE: '/maintenance/index.html',
                PM2_NO_AUTO_UPGRADE: 'true'
            },
        },
    ],
};
