const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 443;

// Setup for serving static files
app.use(express.static('public'));

// Video storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/videos/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 800 * 1024 * 1024 }, // 800 MB limit
    fileFilter: (req, file, cb) => {
        const allowedFormats = ['video/mp4', 'video/x-matroska'];
        if (!allowedFormats.includes(file.mimetype)) {
            return cb(new Error('Only MP4 and MKV files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Endpoint to serve video list
app.get('/videos', (req, res) => {
    fs.readdir('public/videos/', (err, files) => {
        if (err) {
            console.error('Error listing videos:', err);
            return res.status(500).json({ error: 'Unable to list videos' });
        }
        const videoFiles = files
            .filter(file => file.endsWith('.mp4') || file.endsWith('.mkv'))
            .map(file => ({
                name: file,
                format: path.extname(file).slice(1) // Get file extension and remove the leading dot
            }));
        res.json(videoFiles);
    });
});

// Endpoint to handle video uploads
app.post('/upload', upload.array('video'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    res.status(200).json({ message: 'Files uploaded successfully' });
});

// Endpoint to handle video deletion
app.delete('/videos/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'videos', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ error: 'Unable to delete video' });
        }
        res.status(200).json({ message: 'Video deleted successfully' });
    });
});

// Serve the upload page
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err.stack);
    res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
