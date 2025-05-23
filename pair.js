const express = require('express');
const fs = require('fs');
const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  Browsers,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const { upload } = require('./mega');

const router = express.Router();

// Random ID generator
function makeid(length = 5) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}

// File remover
function removeFile(FilePath) {
  if (!fs.existsSync(FilePath)) return false;
  fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
  const id = makeid();
  const num = "94773024361"; // Fixed number

  async function GIFTED_MD_PAIR_CODE() {
    const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);

    try {
      const randomItem = "Safari"; // Browser name
      const sock = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
        },
        printQRInTerminal: false,
        generateHighQualityLinkPreview: true,
        logger: pino({ level: "fatal" }),
        syncFullHistory: false,
        browser: Browsers.macOS(randomItem)
      });

      if (!sock.authState.creds.registered) {
        await delay(1500);
        const code = await sock.requestPairingCode(num);
        if (!res.headersSent) {
          return res.send({ code });
        }
      }

      sock.ev.on('creds.update', saveCreds);

      sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        if (connection === "open") {
          await delay(5000);

          const rf = `${__dirname}/temp/${id}/creds.json`;
          const randomSession = "3EB" + [...Array(19)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 36))).join('');

          try {
            const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
            const string_session = mega_url.replace('https://mega.nz/file/', '');
            const md = "CHAMA-MD=" + string_session;

            const codeMsg = await sock.sendMessage(sock.user.id, { text: md });

            const desc = `> ශෙයා කරන්න එපා \n\n> ᴅᴏ ɴᴏᴛ ꜱʜᴇʀᴇ ᴛʜɪꜱ \n\n> இதை யாரிடமும் பகிர வேண்டாம்\n\n> ʀɪᴘᴏ :- github.com\n\n> whats app channel:- https://whatsapp.com/channel/0029Vb9WF4nJJhzeUCFS6M0u\n\n> ᴏᴡɴᴇʀ :- 94783314361\n\n> ᴘᴏᴡᴇʀᴅ ʙʏ chamindu-ᴍᴅ`;

            await sock.sendMessage(sock.user.id, {
              text: desc,
              contextInfo: {
                externalAdReply: {
                  title: "ᴄʜᴀᴍᴀ-ᴍᴅ",
                  thumbnailUrl: "https://i.ibb.co/pjqsbyyW/7755.jpg",
                  sourceUrl: "https://whatsapp.com/channel/0029Vb9WF4nJJhzeUCFS6M0u",
                  mediaType: 1,
                  renderLargerThumbnail: true
                }
              }
            }, { quoted: codeMsg });

          } catch (e) {
            const errorMsg = await sock.sendMessage(sock.user.id, { text: e.toString() });

            const errorDesc = `> ශෙයා කරන්න එපා \n\n> ᴅᴏ ɴᴏᴛ ꜱʜᴇʀᴇ ᴛʜɪꜱ \n\n> இதை யாரிடமும் பகிர வேண்டாம்\n\n> ʀɪᴘᴏ :- github.com\n\n> whats app channel:- https://whatsapp.com/channel/0029Vb9WF4nJJhzeUCFS6M0u\n\n> ᴏᴡɴᴇʀ :- 94783314361\n\n> ᴘᴏᴡᴇʀᴅ ʙʏ chamindu-ᴍᴅ`;

            await sock.sendMessage(sock.user.id, {
              text: errorDesc,
              contextInfo: {
                externalAdReply: {
                  title: "ᴄʜᴀᴍᴀ-ᴍᴅ",
                  thumbnailUrl: "https://i.ibb.co/pjqsbyyW/7755.jpg",
                  sourceUrl: "https://whatsapp.com/channel/0029Vb9WF4nJJhzeUCFS6M0u",
                  mediaType: 2,
                  renderLargerThumbnail: true,
                  showAdAttribution: true
                }
              }
            }, { quoted: errorMsg });
          }

          await delay(10);
          await sock.ws.close();
          removeFile(`./temp/${id}`);
          console.log(`✅ ${sock.user.id} session uploaded & closed.`);
          process.exit();
        } else if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
          await delay(10);
          GIFTED_MD_PAIR_CODE();
        }
      });

    } catch (err) {
      console.log("❗ Service error, cleaning up...");
      removeFile(`./temp/${id}`);
      if (!res.headersSent) {
        res.send({ code: "❗ Service Unavailable" });
      }
    }
  }

  return await GIFTED_MD_PAIR_CODE();
});

module.exports = router;
