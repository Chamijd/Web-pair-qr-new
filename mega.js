const mega = require('megajs');

// Define user credentials and user agent
const credentials = {
  email: 'wohabo1681@calorpg.com',
  password: 'Chamindu2008',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

// Upload function using async/await style
const upload = async (fileStream, fileName) => {
  return new Promise((resolve, reject) => {
    const storage = mega({ email: credentials.email, password: credentials.password, userAgent: credentials.userAgent });

    storage.on('ready', () => {
      const upload = storage.upload(fileName);
      fileStream.pipe(upload);

      upload.on('complete', file => {
        file.link()
          .then(link => {
            storage.close();
            resolve(link);
          })
          .catch(err => {
            storage.close();
            reject(err);
          });
      });

      upload.on('error', err => {
        storage.close();
        reject(err);
      });
    });

    storage.on('error', err => {
      reject(err);
    });
  });
};

module.exports = { upload };
