// backend
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify upload directory

const dbOperation = require('./dbFiles/dbOperation.js');
const submissionResubmit = require('./dbFiles/dbContructor/submissionResubmit.js');
const ResubmitPDFContructor = require('./dbFiles/dbContructor//ResubmitPDFContructor.js');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('sssloanPDF'), async (req, res) => {
  // console.log(req);
  // console.log("this");
  // try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

  //   // Here you can save the file to the database
    await dbOperation.insertPDF(req.file.filename); // Pass filename to the insertPDF function

  //   res.status(200).json({ message: 'PDF uploaded successfully' });
  // } catch (error) {
  //   console.error('Error uploading PDF:', error);
  //   res.status(500).json({ error: 'Internal server error' });
  // }
});

app.post('/hrsubmission', async (req, res) => {

  try {

    // if (!req.body) {
    //   return res.status(400).json({ error: 'No Employee ID' });
    // }
  
    const result = await dbOperation.getSubmissions();
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/submissionpdf',  upload.single('SubmissionID'), async (req, res) => {

  try {

    // if (!req.body) {
    //   return res.status(400).json({ error: 'No Employee ID' });
    // } 
  
    const result = await dbOperation.getPDF(req.body.SubmissionID);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/usersubmission',  upload.single('EmpId'), async (req, res) => {

  try {

    // if (!req.body) {
    //   return res.status(400).json({ error: 'No Employee ID' });
    // } 
  
    const result = await dbOperation.getUserSubmissions(req.body.EmpId);
    console.log(req.body.EmpId);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/resubmitPDF', upload.fields([{ name: 'newPDF' }, { name: 'requirementName' }, {name: 'PdfFileID'}, {name: 'SubmissionID'}]), async (req, res) => {
  try {
    const uploadedFiles = req.files;
    const { requirementName, PdfFileID, SubmissionID } = req.body;

    uploadedFiles.newPDF.forEach((file, index) => {
      let setrequirementName;
      if (uploadedFiles.newPDF.length === 1) {
        setrequirementName = requirementName;
      } else {
        setrequirementName = requirementName[index];
      }

      console.log(setrequirementName);

      const FileName = file.originalname;
      const ContentType = "pdf";
      const setFileSize = file.size;

      const now = new Date();
      const UploadDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

      const PdfData = file;
      const Resubmit = "0";
      const ResubmitReason = "";
      const setSubmissionID = SubmissionID[index];
      const setPdfFileID = PdfFileID[index];

      const dbData = new submissionResubmit(setrequirementName, FileName, ContentType, setFileSize, UploadDate, Resubmit, ResubmitReason, setSubmissionID, setPdfFileID);
      const dbDataPDF = new ResubmitPDFContructor(PdfData);

      dbOperation.updateResubmit(dbData, dbDataPDF);
    });

    res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.post('/resubmitPDF', upload.fields([{ name: 'newPDF' }, { name: 'requirementName' }, {name: 'PdfFileID'}, {name: 'SubmissionID'}]), async (req, res) => {
//   try {
    

//     const uploadedFiles = req.files;
//     const { requirementName }  = req.body; 
//     const { PdfFileID } = req.body; 
//     const { SubmissionID } = req.body; 

//     uploadedFiles.newPDF.forEach((file, index) => {

//       const setrequirementName = requirementName[index];
//       const setrequirementName = requirementName;
      
//       console.log("SubmissionID:", SubmissionID[index]);
//       console.log("PdfFileID:", PdfFileID[index]);
//       console.log("Requirement Name:", fileRequirementName); 
//       console.log("File:", file);

//       const FileName = file.originalname;
//       const ContentType = "pdf";
//       const setFileSize = file.size;

//       const now = new Date();
//       const UploadDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

//       const PdfData = file;
//       const Resubmit = "0";
//       const ResubmitReason = "";
//       const setSubmissionID = SubmissionID[index];

//       const setPdfFileID = PdfFileID[index];

//       const dbData = new submissionResubmit(setrequirementName,FileName,ContentType,setFileSize,UploadDate, Resubmit,ResubmitReason,setSubmissionID,setPdfFileID);
//       const dbDataPDF = new ResubmitPDFContructor(PdfData);

//       dbOperation.updateResubmit(dbData,dbDataPDF);
//     });

//     res.status(200).json({ message: 'Files uploaded successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



      
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));