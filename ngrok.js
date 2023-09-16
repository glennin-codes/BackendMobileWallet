const dotenv = require('dotenv');
const ngrok = require('ngrok');

dotenv.config();

async function startNgrok() {
  try {
    const url = await ngrok.connect({
      proto: 'http',
      addr: process.env.PORT,
      authtoken: process.env.NGROK_AUTH_TOKEN // Provide the authentication token
    });

    console.log(`Ngrok URL: ${url}`);
    return url;
  } catch (e) {
    console.error(e.message);
  }
}

module.exports = { startNgrok };