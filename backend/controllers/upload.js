const Imagekit = require('imagekit') 
require('dotenv').config(); 


const imagekit = new Imagekit({
    urlEndpoint: process.env.VITE_IMAGEIO_BASE_URL,
    publicKey: process.env.VITE_IMAGEIO_PUBLIC_KEY,
    privateKey: process.env.VITE_IMAGEIO_PRIVATE_KEY 
  });

const upload = (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
}

module.exports = upload;