import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dlwrrxcjg',
  api_key: '658441217362522',
  api_secret: 'xQHAQAWWEbQPw72C65s_kEL1yH0'
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body; // Expecting base64 string
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'rentals',
      });
      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ error: 'Upload failed', details: error.message });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
