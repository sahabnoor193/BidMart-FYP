// module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload, handleMulterError } = require('../config/multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload images
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.array('images', 5), handleMulterError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Upload to Cloudinary or save locally based on environment
    const uploadPromises = req.files.map(file => {
      if (process.env.NODE_ENV === 'production') {
        return cloudinary.uploader.upload(file.path, {
          folder: 'auction-app',
          resource_type: 'image'
        });
      } else {
        // For local development, return the full URL
        return Promise.resolve({
          secure_url: `http://localhost:5000/uploads/${file.filename}`,
          public_id: file.filename
        });
      }
    });

    const results = await Promise.all(uploadPromises);
    const fileUrls = results.map(result => result.secure_url);

    // Clean up - delete local files after upload
    if (process.env.NODE_ENV === 'production') {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting local file:', err);
        });
      });
    }

    res.status(200).json(fileUrls);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

// @desc    Delete image
// @route   DELETE /api/upload
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const { publicId } = req.body;
    console.log('Public ID received for deletion:', publicId);

    if (!publicId) {
      return res.status(400).json({ message: 'No public ID provided' });
    }

    if (typeof publicId !== 'string') {
      return res.status(400).json({ message: 'Invalid public ID format' });
    }

    if (process.env.NODE_ENV === 'production') {
      console.log('Deleting from Cloudinary with publicId:', publicId);
      await cloudinary.uploader.destroy(publicId);
      return res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      // For local development, delete the file from uploads folder
      const fileName = publicId.split('/').pop(); // Get the last part of the URL
      const filePath = path.join(__dirname, '../uploads', fileName);
      console.log('Deleting file from path:', filePath);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting local file:', err);
          return res.status(500).json({ message: 'Failed to delete local file' });
        }
        console.log('Local file deleted successfully');
        return res.status(200).json({ message: 'Image deleted successfully' });
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Image deletion failed', error: error.message });
  }
});

module.exports = router;