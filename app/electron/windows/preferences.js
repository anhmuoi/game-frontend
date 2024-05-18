/* eslint-disable */

const { remote } = require('electron');
const settings = require('electron-settings');

const app = new Vue({
  el: '#app',
  data: {
    host: settings.get('host'),
  },
  methods: {
    savePreferences() {
      settings.set('host', this.host);
    },
    close() {
      const window = remote.getCurrentWindow();
      window.close();
    },
  },
});
