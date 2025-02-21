const express = require('express');
const multer = require('multer');
const { Link } = require('../models/urlData');
const { processExcelFile } = require('../controllers/fileController');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Set up file upload destination and filename
const upload = multer({
  dest: 'uploads/', // Temporarily store uploaded files
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: limit the file size to 10 MB
}).single('file');

// Create a new link
router.post('/create', async (req, res) => {
  const { targetURL, domainAuthority, pageAuthority, spamScore, status, category } = req.body;

  try {
    const newLink = await Link.create({
      targetURL,
      domainAuthority,
      pageAuthority,
      spamScore,
      status,
      category,
    });
    res.status(201).json(newLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ error: 'Error creating link' });
  }
});

// Get all links
router.get('/', async (req, res) => {
  try {
    const links = await Link.findAll();
    res.status(200).json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Error fetching links' });
  }
});
//   any error accur uncommand this

// Route for uploading file and processing it  
// router.post('/upload', upload, async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   console.log('Uploaded file:', req.file);  // Log the file details for debugging

//   const filePath = path.join(__dirname, '../uploads', req.file.filename);

//   try {
//     await processExcelFile(filePath); // Process the uploaded file
//     res.status(200).send('File uploaded and processed successfully.');
//   } catch (error) {
//     console.error('Error processing file:', error);  // Log the error for debugging
//     res.status(500).send('Error processing file.');
//   }
// });


// this is new one two display urls list
router.post('/upload', upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  let workingLinks = []; // Use `let` for arrays
  let nonWorkingLinks = []; // Use `let` for arrays

  try {
    const solution = await processExcelFile(filePath); // Process the Excel file

    // Iterate through processedRows to classify links
    for (const row of solution.processedRows) {
      if (row.status.toLowerCase() === 'working') {
        workingLinks.push(row.targetUrl); // Add to working links
      } else {
        nonWorkingLinks.push(row.targetUrl); // Add to non-working links
      }
    }

    console.log("Solution:", solution);
    res.status(200).json({ workingLinks, nonWorkingLinks });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file.' });
  } finally {
    // Delete the uploaded file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
});




module.exports = router;
