// const fs = require('fs');
// const path = require('path');
// const xlsx = require('xlsx');
// const axios = require('axios');
// const {  Link } = require('../models/urlData'); // Ensure the Link model is imported correctly

// // Function to check if URL is accessible
// const isUrlWorking = async (url) => {
//   try {
//     const response = await axios.get(url);
//     const notWorkingStatusCodes = [404, 500, 403, 401, 408];
//     return notWorkingStatusCodes.includes(response.status) ? 'Not Working' : 'Working';
//   } catch (error) {
//     return 'Not Working';
//   }
// };

// // Categorize URL based on keyword
// const categorizeUrl = (url) => {
//   const categories = {
//     direct: 'Directory',
//     social: 'Social Bookmarking',
//     blog: 'Blog Comment',
//     guest: 'Guest Post',
//     forum: 'Forum',
//     articl: 'Article',
//     classi: 'Classified',
//     profil: 'Profile',
//     busine: 'Business Listing',
//     activi: 'Activity Submission',
//     press: 'Press Release',
//     questi: 'Questionnaire',
//     infogr: 'Infographic',
//   };

//   for (const [keyword, category] of Object.entries(categories)) {
//     if (url.toLowerCase().includes(keyword)) {
//       return category;
//     }
//   }

//   return 'Uncategorized';
// };

// // Process the Excel file and insert data
// const processExcelFile = async (filePath) => {
//   try {
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const rows = xlsx.utils.sheet_to_json(sheet); // Convert sheet to JSON

//     // Log the rows to see the structure
//     console.log('Rows from Excel:', rows);

//     for (const row of rows) {
//       // Log each row
//       console.log('Processing row:', row);

//       // Check if targetUrl is defined and valid (not null, empty, or whitespace)
//       const targetUrl = row.targetUrl;
//       if (!targetUrl || targetUrl.trim() === '') {
//         console.log('Skipping invalid row with empty targetUrl:', row);
//         continue; // Skip this row if the targetUrl is invalid
//       }

//       console.log('Valid URL:', targetUrl);

//       // Check if the URL is working
//       const status = await isUrlWorking(targetUrl);

//       // Categorize the URL based on the keyword
//       const category = categorizeUrl(targetUrl);

//       // Ensure other fields are not undefined
//       const domainAuthority = row.domainAuthority || 0; // Default to 0 if missing
//       const pageAuthority = row.pageAuthority || 0;     // Default to 0 if missing
//       const spamScore = row.spamScore || 0;             // Default to 0 if missing

//       // Create a new Link record
//       try {
//         await Link.create({
//           targetURL:targetUrl,
//           domainAuthority,
//           pageAuthority,
//           spamScore,
//           status,
//           category,
//           createdAt: new Date(), // Add timestamp
//           updatedAt: new Date(), 
//         });
//         console.log('Successfully added Link for URL:', targetUrl);
//       } catch (err) {
//         console.error('Error inserting link for URL:', targetUrl, err);
//       }
//     }

//     console.log('File processed successfully.');
//   } catch (error) {
//     console.error('Error in processExcelFile:', error);
//     throw error;
//   }
// };

// module.exports = { processExcelFile };



const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const axios = require('axios');
const { Link } = require('../models/urlData'); // Ensure the Link model is imported correctly

// Function to check if URL is accessible
const isUrlWorking = async (url) => {
  try {
    const response = await axios.get(url);
    const notWorkingStatusCodes = [404, 500, 403, 401, 408];
    return notWorkingStatusCodes.includes(response.status) ? 'Not Working' : 'Working';
  } catch (error) {
    return 'Not Working';
  }
};

// Categorize URL based on keyword
const categorizeUrl = (url) => {
  const categories = {
    direct: 'Directory',
    social: 'Social Bookmarking',
    blog: 'Blog Comment',
    guest: 'Guest Post',
    forum: 'Forum',
    articl: 'Article',
    classi: 'Classified',
    profil: 'Profile',
    busine: 'Business Listing',
    activi: 'Activity Submission',
    press: 'Press Release',
    questi: 'Questionnaire',
    infogr: 'Infographic',
  };

  for (const [keyword, category] of Object.entries(categories)) {
    if (url.toLowerCase().includes(keyword)) {
      return category;
    }
  }

  return 'Uncategorized';
};

// Process the Excel file and insert data
const processExcelFile = async (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const processedRows = []; 
    for (const row of rows) {
      const targetUrl = row.targetUrl;
      if (!targetUrl || targetUrl.trim() === '') continue;

      const status = await isUrlWorking(targetUrl);
      const category = categorizeUrl(targetUrl);
      const domainAuthority = row.DomainAuthority || 0;
      const pageAuthority = row.PageAuthority || 0;
      const spamScore = row.SpamScore || 0;

      processedRows.push({
        targetUrl,
        status,
      });

      await Link.create({
        targetURL: targetUrl,
        domainAuthority,
        pageAuthority,
        spamScore,
        status,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log('File processed successfully.');
    return { message: 'File processed successfully.', processedRows }; // Return summary
  } catch (error) {
    console.error('Error in processExcelFile:', error);
    throw error; // Rethrow error to be handled by the caller
  }
};


module.exports = { processExcelFile };
