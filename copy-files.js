#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

// tslint:disable-next-line: no-var-requires no-require-imports no-unsafe-any
const packageVersion = require('./package.json').version;

const destDir = path.resolve(__dirname, './dist');

// Copy release notes
fs.copyFileSync(path.resolve(__dirname, `./release-notes/v${packageVersion}/README.md`), path.join(destDir, 'RELEASENOTES.md'));

// Copy firebase configs
fs.copyFileSync(path.resolve(__dirname, './firebase.json'), path.join(destDir, 'firebase.json'));
fs.copyFileSync(path.resolve(__dirname, './.firebaserc'), path.join(destDir, '.firebaserc'));
