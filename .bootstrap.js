exports.request = require('supertest');

exports.googurl = 'https://maps.googleapis.com';

exports.log = require('custom-logger').config({ level: 0 });
exports.log.info().config({ color: 'green' });