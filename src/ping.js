const config = require('./config');
const SlotsStore = require('./slots-store');
const PING_URL = config.PING_URL;
const http = require('http');

function startPing() {
    setInterval(() => {
        http.get(PING_URL);

        const hours = new Date().getUTCHours();

        console.log('ping ', hours);

        // in Russia its GMT+3
        if (hours === 21) {
            SlotsStore.resetFreeSLOTS();
        }
    }, 300000);
}

module.exports = startPing;