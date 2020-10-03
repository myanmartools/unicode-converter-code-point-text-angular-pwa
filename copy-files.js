#!/usr/bin/env node
/* eslint-env node */

'use strict';

const fs = require('fs');
const path = require('path');

const packageVersion = require('./package.json').version;

const destDir = path.resolve(__dirname, './dist');

// Copy release notes
fs.copyFileSync(
    path.resolve(__dirname, `./release-notes/v${packageVersion}/README.md`),
    path.join(destDir, 'RELEASENOTES.md')
);

// Copy firebase configs
fs.copyFileSync(path.resolve(__dirname, './firebase.json'), path.join(destDir, 'app/firebase.json'));
fs.copyFileSync(path.resolve(__dirname, './.firebaserc'), path.join(destDir, 'app/.firebaserc'));
