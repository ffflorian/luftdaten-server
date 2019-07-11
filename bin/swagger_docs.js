#!/usr/bin/env node
//@ts-check

const {exec} = require('child_process');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const {promisify} = require('util');

const execAsync = promisify(exec);
const {Server} = require('../dist/Server');

let tempFile;
let server;
const markdownFile = path.join(__dirname, '../docs/swagger.md');

fs.ensureDir(path.dirname(markdownFile))
  .then(() => fs.mkdtemp(path.join(os.tmpdir(), 'luftdaten-server-')))
  .then(dir => {
    tempFile = path.join(dir, 'swagger.json');
    server = new Server();
    return server.init();
  })
  .then(() => fs.writeJSON(tempFile, server.swaggerDocument))
  .then(() => execAsync(`npx swagger-markdown -i "${tempFile}" -o "${markdownFile}"`))
  .then(() => process.exit())
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
