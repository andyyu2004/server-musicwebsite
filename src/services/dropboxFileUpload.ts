const request = require('request');
const fs = require('fs');
const Dropbox = require('dropbox').Dropbox;
const fetch = require('isomorphic-fetch');

const dbx = new Dropbox({ fetch, accessToken: 'MNM-t1lyGGAAAAAAAAAAn24nMmIyg0De37JmYk-9GYrWf9YjkoruDBV5DYrjPh-2' })
.filesListFolder({path: ''})
.then(console.log, console.error);

function test() {
  dbx.filesListFolder({ path: "" })
  .then(resp => {
    console.log('resposense', resp);
  })
  .catch(err => {
    console.log(err);
  });
}

export { test };