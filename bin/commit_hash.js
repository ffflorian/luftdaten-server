#!/usr/bin/env node

const {promisify} = require('util');
const path = require('path');
const {exec} = require('child_process');

const fs = require('fs-extra');
const execAsync = promisify(exec);

const distDir = path.join(__dirname, '../dist');
const commitHashFile = path.join(distDir, 'commit');

execAsync('git rev-parse HEAD').then(({stderr, stdout}) => {
  if (stderr) {
    console.error(stderr)
  }
  if (stdout) {
    return fs.writeFile(commitHashFile, stdout.trim(), 'utf-8')
  }
}).catch(console.error);
