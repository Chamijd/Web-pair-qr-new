const mega = require("megajs");

// Define user credentials and user agent
const credentials = {
  email: 'vijeni5893@jeanssi.com',
  password: 'Chamindu2008',
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"
};

// Upload function using mega.Storage
const upload = (fileStream, fileName) => {
  return new Promise((resolve, reject) => {
    try {
      const storage = new mega.Storage(credentials, () => {
        const options = {
          name: fileName,
          allowUploadBuffering: true
        };
        fileStream.pipe(storage.upload(options));
        storage.on("add", file => {
          file.link((error, link) => {
            if (error) {
              throw error;
            }
            storage.close();
            resolve(link);
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Export the upload function
module.exports = { upload };
