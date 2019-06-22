module.exports = {
  apps: [
    {
      env: {
        LOG_ERROR: `${process.env.HOME}/.pm2/logs/lufdaten-server-error.log`,
        LOG_OUTPUT: `${process.env.HOME}/.pm2/logs/lufdaten-server-out.log`,
        NODE_DEBUG: 'luftdaten-server/*',
      },
      name: 'luftdaten-server',
      script: 'dist/index.js',
    },
  ],
};
