const express = require('express');
const Minio = require('minio');
const NodeCache = require('node-cache');
const app = express();

// Create a cache with a specified TTL (time-to-live) for caching images.
const imageCache = new NodeCache({ stdTTL: 3600, checkperiod: 60 });

const minioClient = new Minio.Client({
      endPoint: 'minio-server-address',
      port: 9000,
      useSSL: false,
      accessKey: 'YourAccessKey',
      secretKey: 'YourSecretKey',
});

// Endpoint to serve images
app.get('/images/:imageName', (req, res) => {
      const imageName = req.params.imageName;

      // Check if the image is already cached
      const cachedImage = imageCache.get(imageName);
      if (cachedImage) {
            // Serve the cached image
            return res.send(cachedImage);
      }

      // Fetch the image from Minio
      const bucketName = 'your-bucket-name'; // Replace with your bucket name
      minioClient.getObject(bucketName, imageName, (err, dataStream) => {
            if (err) {
                  return res.status(404).send('Image not found');
            }

            const chunks = [];
            dataStream.on('data', (chunk) => {
                  chunks.push(chunk);
            });

            dataStream.on('end', () => {
                  const imageBuffer = Buffer.concat(chunks);
                  // Cache the image
                  imageCache.set(imageName, imageBuffer);

                  // Set appropriate response headers and serve the image
                  res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type based on your image format
                  res.send(imageBuffer);
            });

            dataStream.on('error', (err) => {
                  console.error(err);
                  res.status(500).send('Error fetching image');
            });
      });
});

const port = process.env.PORT || 80;
app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
});
