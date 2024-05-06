// backend
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify upload directory

const dbOperation = require('./dbFiles/dbOperation.js');
const submissionResubmit = require('./dbFiles/dbContructor/submissionResubmit.js');
const ResubmitPDFContructor = require('./dbFiles/dbContructor//ResubmitPDFContructor.js');


const DefaultPdfFile = require('./dbFiles/dbContructor/DefaultPdfFile.js');
const DefualtSubmissionContructor = require('./dbFiles/dbContructor/DefualtSubmissionContructor.js');

const sssLoan = require('./dbFiles/dbContructor/sssLoan.js');
const sssLoanPDF = require('./dbFiles/dbContructor/sssLoanPDF.js');

const PagIbigVirtualAccountPDF = require('./dbFiles/dbContructor/PagIbigVirtualAccountPDF.js');
const MaternityNotification = require('./dbFiles/dbContructor/MaternityNotification.js');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('sssloanPDF'), async (req, res) => {
  console.log(req);
  console.log("this");
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Here you can save the file to the database
    await dbOperation.insertPDF(req.file.filename); // Pass filename to the insertPDF function

    res.status(200).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
    const { requirementName, PdfFileID, SubmissionID} = req.body;

    uploadedFiles.newPDF.forEach((file, index) => {
      let setrequirementName;
      if (uploadedFiles.newPDF.length === 1) {
        setrequirementName = requirementName;
      } else {
        setrequirementName = requirementName[index];
      }

      const FileName = file.originalname;
      const ContentType = "pdf";
      const setFileSize = file.size;

      const now = new Date();
      const UploadDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

      const PdfData = file;
      const Resubmit = "0";
      const ResubmitReason = "";
      const setSubmissionID = SubmissionID;
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


//SSS Loan
app.post('/SSS_upload', upload.fields([{ name: 'Pay_Slip' }, { name: 'Disclosure_Statement' }, { name: 'Application_Date' }, { name: 'Transaction_Number' }]), async (req, res) => {
  try {
      const TransactionType = "SSS Loan";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }); // Format: HH:MM
      const TurnAround = "5"

      const { Application_Date, Transaction_Number } = req.body;
      const paySlipFiles = req.files['Pay_Slip']; // Assuming Pay_Slip can have multiple files
      const disclosureStatementFiles = req.files['Disclosure_Statement']; // Assuming Disclosure_Statement can have multiple files
      const EmpId = "10023";
      
      const dbData = new sssLoan(TransactionType,Status,currentDate,currentTime,TurnAround,Application_Date, Transaction_Number,EmpId);
      const dbDataPDF = new sssLoanPDF(paySlipFiles,disclosureStatementFiles);

      // Pass the required parameters to insertPDF function
      await dbOperation.sssLoan(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


//Pag-ibig Landbank Card
app.post('/Landbank_upload', upload.fields([{ name: 'Application_Form' }, { name: 'paySlipFiles' }, { name: 'Valid_ID' } ]), async (req, res) => {
  try {
      const TransactionType = "Pag-Ibig Landbank Card";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }); // Format: HH:MM
      const TurnAround = "5"

      const ApplicationFormFile = req.files['Application_Form'];
      const paySlipFiles = req.files['paySlipFiles'];
      const Valid_ID= req.files['Valid_ID'];

      const EmpId = "10023";

      const dbData = new DefualtSubmissionContructor(TransactionType,Status,currentDate,currentTime,TurnAround,EmpId);
      const dbDataPDF = new DefaultPdfFile(ApplicationFormFile,paySlipFiles,Valid_ID);

      // Pass the required parameters to insertPDF function
      await dbOperation.insertPagIbig_Landbank(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

//Pag-ibig DBP Card
app.post('/DBP_upload', upload.fields([{ name: 'Application_Form' }, { name: 'paySlipFiles' }, { name: 'Valid_ID' } ]), async (req, res) => {
  try {
      const TransactionType = "Pag-Ibig DBP Card";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }); // Format: HH:MM
      const TurnAround = "5"

      const ApplicationFormFile = req.files['Application_Form'];
      const paySlipFiles = req.files['paySlipFiles'];
      const Valid_ID= req.files['Valid_ID'];

      const EmpId = "10023";

      const dbData = new DefualtSubmissionContructor(TransactionType,Status,currentDate,currentTime,TurnAround,EmpId);
      const dbDataPDF = new DefaultPdfFile(ApplicationFormFile,paySlipFiles,Valid_ID);

      // Pass the required parameters to insertPDF function
      await dbOperation.insertPagIbig_DBP(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

//Pag-ibig Virtual Account
app.post('/VirtualAcc_upload', upload.fields([ { name: 'paySlip' }, { name: 'Screenshot_Virtual' }, { name: 'GrossIncome' } ]), async (req, res) => {
  try {
      const TransactionType = "Pag-Ibig Virtual Account";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }); // Format: HH:MM
      const TurnAround = "5"

      const paySlip = req.files['paySlip'];
      const Screenshot_Virtual = req.files['Screenshot_Virtual'];
      const GrossIncome= req.files['GrossIncome'];

      const EmpId = "10023";

      const dbData = new DefualtSubmissionContructor(TransactionType,Status,currentDate,currentTime,TurnAround,EmpId);
      const dbDataPDF = new PagIbigVirtualAccountPDF(paySlip,Screenshot_Virtual,GrossIncome);

      // Pass the required parameters to insertPDF function
      await dbOperation.insertPagIbig_VirtualAcc(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

//
app.post('/MaternityBenefit', upload.fields([{ name: 'selected' }, { name: 'Application_Form' }, { name: 'LiveBirthCert' }, { name: 'SoloParent' }]), async (req, res) => {
  try {
      const selected = req.body.selected;
      const Application_Form = req.files['Application_Form'];
      const LiveBirthCert = req.files['LiveBirthCert'];
      const SoloParent = req.files['SoloParent'];

      console.log(selected);
      console.log(Application_Form);
      console.log(LiveBirthCert);
      console.log(SoloParent);

      // const TransactionType = "SSS Loan";
      // const Status = "Pending";
      // const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      // const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }); // Format: HH:MM
      // const TurnAround = "5"

      // const { Application_Date, Transaction_Number } = req.body;
      // const paySlipFiles = req.files['Pay_Slip']; // Assuming Pay_Slip can have multiple files
      // const disclosureStatementFiles = req.files['Disclosure_Statement']; // Assuming Disclosure_Statement can have multiple files
      // const EmpId = "10023";
      
      // const dbData = new sssLoan(TransactionType,Status,currentDate,currentTime,TurnAround,Application_Date, Transaction_Number,EmpId);
      // const dbDataPDF = new sssLoanPDF(paySlipFiles,disclosureStatementFiles);

      // Pass the required parameters to insertPDF function
      // await dbOperation.sssLoan(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/Maternity_upload', upload.fields([ { name: 'Notication_Form' }, { name: 'Maternity_Eligibility' }, { name: 'Credit_Form' }, { name: 'Medical_Reports' } ]), async (req, res) => {
  try {
    const TransactionType = "Maternity Notication";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }); // Format: HH:MM
      const TurnAround = "5"

      const Notication_Form = req.files['Notication_Form'];
      const Maternity_Eligibility = req.files['Maternity_Eligibility'];
      const Credit_Form= req.files['Credit_Form'];
      const Medical_Reports= req.files['Medical_Reports'];

      const EmpId = "10023";

      const dbData = new DefualtSubmissionContructor(TransactionType,Status,currentDate,currentTime,TurnAround,EmpId);
      const dbDataPDF = new MaternityNotification(Notication_Form,Maternity_Eligibility,Credit_Form,Medical_Reports);

      // console.log(dbData);
      // Pass the required parameters to insertPDF function
      await dbOperation.insertMaternityNotification(dbData, dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {``
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


      
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));