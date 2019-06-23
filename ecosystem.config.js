module.exports = {
  apps: [
    {
      env: {
        LOG_ERROR: `${process.env.HOME}/.pm2/logs/luftdaten-server-error.log`,
        LOG_OUTPUT: `${process.env.HOME}/.pm2/logs/luftdaten-server-out.log`,
        NODE_DEBUG: 'luftdaten-server/*',
      },
      name: 'luftdaten-server',
      script: 'dist/index.js',
    },
  ],
};
