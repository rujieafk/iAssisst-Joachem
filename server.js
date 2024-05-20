// backend
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify upload directory

const dbOperation = require('./dbFiles/dbOperation.js');
const thisDefaultContructor = require('./dbFiles/dbContructor/thisDefaultContructor.js');
const DefaultPdfFile = require('./dbFiles/dbContructor/DefaultPdfFile.js');

const sssLoanPDF = require('./dbFiles/dbContructor/sssLoanPDF.js');

const submissionResubmit = require('./dbFiles/dbContructor/submissionResubmit.js');
const ResubmitPDFContructor = require('./dbFiles/dbContructor/ResubmitPDFContructor.js');

const PagIbigVirtualAccountPDF = require('./dbFiles/dbContructor/PagIbigVirtualAccountPDF.js');
const MaternityNotification = require('./dbFiles/dbContructor/MaternityNotification.js');

const MaternityBenefit1PDF = require('./dbFiles/dbContructor/MaternityBenefit1PDF.js');
const MaternityBenefit2PDF = require('./dbFiles/dbContructor/MaternityBenefit2PDF.js');
const MaternityBenefit3PDF = require('./dbFiles/dbContructor/MaternityBenefit3PDF.js');


const SSSrequesterPDF = require('./dbFiles/dbContructor/SSSrequesterPDF.js');
const SSSrequesterPDF2 = require('./dbFiles//dbContructor/SSSrequesterPDF2.js')

const SSSrequester3 = require('./dbFiles/dbContructor/SSSrequester3.js');
const SSSrequesterPDF3 = require('./dbFiles/dbContructor/SSSrequesterPDF3.js');

const PAG_IBIGrequesterPDF = require('./dbFiles/dbContructor/PAG_IBIGrequesterPDF.js');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('sssloanPDF'), async (req, res) => {
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

//SSS Loan
app.post('/SSS_upload', upload.fields([{ name: 'Pay_Slip' }, { name: 'Disclosure_Statement' }, { name: 'Application_Date' }, { name: 'Transaction_Number' }]), async (req, res) => {
  try {
      const TransactionType = "SSS Loan";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5"

      const { Application_Date, Transaction_Number } = req.body;
      const TypeOfDelivery = "";
      const paySlipFiles = req.files['Pay_Slip']; // Assuming Pay_Slip can have multiple files
      const disclosureStatementFiles = req.files['Disclosure_Statement']; // Assuming Disclosure_Statement can have multiple files
      const RequestType = "";
      const OtherReq = "";
      
      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, TypeOfDelivery,RequestType,OtherReq, EmpId, ErroneousName, CorrectName,RequestTitle, Description);
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
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const RequestType = "";
      const OtherReq = "";
      
      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";

      const ApplicationFormFile = req.files['Application_Form'];
      const paySlipFiles = req.files['paySlipFiles'];
      const Valid_ID= req.files['Valid_ID'];

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, TypeOfDelivery,RequestType,OtherReq, EmpId, ErroneousName, CorrectName,RequestTitle, Description);
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
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const RequestType = "";
      const OtherReq = "";

      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";

      const ApplicationFormFile = req.files['Application_Form'];
      const paySlipFiles = req.files['paySlipFiles'];
      const Valid_ID= req.files['Valid_ID'];

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, TypeOfDelivery,RequestType,OtherReq, EmpId, ErroneousName, CorrectName,RequestTitle, Description);
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
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const RequestType = "";
      const OtherReq = "";

      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";

      const paySlip = req.files['paySlip'];
      const Screenshot_Virtual = req.files['Screenshot_Virtual'];
      const GrossIncome= req.files['GrossIncome'];

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, TypeOfDelivery,RequestType,OtherReq, EmpId, ErroneousName, CorrectName,RequestTitle, Description);
      const dbDataPDF = new PagIbigVirtualAccountPDF(paySlip,Screenshot_Virtual,GrossIncome);

      // Pass the required parameters to insertPDF function
      await dbOperation.insertPagIbig_VirtualAcc(dbData,dbDataPDF);
      
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
    const TurnAround = "5"
    const Application_Date = "";
    const Transaction_Number = "";
    const TypeOfDelivery = "";
    const RequestType = "";
    const OtherReq = "";

    const EmpId = "10023";
    const ErroneousName = "";
    const CorrectName = "";
    const RequestTitle = "";
    const Description = "";
    
    const Notication_Form = req.files['Notication_Form'];
    const Maternity_Eligibility = req.files['Maternity_Eligibility'];
    const Credit_Form= req.files['Credit_Form'];
    const Medical_Reports= req.files['Medical_Reports'];

    const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, TypeOfDelivery,RequestType,OtherReq, EmpId, ErroneousName, CorrectName,RequestTitle, Description);
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

app.post('/MaternityBenefit', upload.fields([
  { name: 'selected' }, 
  { name: 'Application_Form' }, 
  { name: 'LiveBirthCert' }, 
  { name: 'SoloParent' }, 
  { name: 'ProofPregnancy' }, 
  { name: 'HospitalRec' }, 
  { name: 'DeathCert' }
]), async (req, res) => {
  try {
      const selectedNum = req.body.selected;
      const Application_Form = req.files['Application_Form'];
      const LiveBirthCert = req.files['LiveBirthCert'];
      const SoloParent = req.files['SoloParent'];
      const ProofPregnancy = req.files['ProofPregnancy'];
      const HospitalRec = req.files['HospitalRec'];
      const DeathCert = req.files['DeathCert'];

      const TransactionType = "Maternity Benefit";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const RequestType = "";
      const OtherReq = "";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";

      const EmpId = "10023";

      if(selectedNum === "1"){
        const TypeOfDelivery = "Live Child Birth";
        
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, TypeOfDelivery,RequestType,OtherReq, EmpId,ErroneousName,CorrectName,RequestTitle, Description);
        const dbDataPDF = new MaternityBenefit1PDF(Application_Form,LiveBirthCert,SoloParent);
        
        // Pass the required parameters to insertPDF function
        await dbOperation.MaternityBenefit(selectedNum,dbData,dbDataPDF);
      }
      else if(selectedNum === "2"){
        const TypeOfDelivery = "Miscarriage / Emergency Termination of Pregnancy / Ectopic Pregnancy";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, TypeOfDelivery,RequestType,OtherReq, EmpId,ErroneousName,CorrectName,RequestTitle, Description);
        const dbDataPDF = new MaternityBenefit2PDF(Application_Form,ProofPregnancy,HospitalRec);
        
        // Pass the required parameters to insertPDF function
        await dbOperation.MaternityBenefit(selectedNum,dbData,dbDataPDF);
      }else if(selectedNum === "3"){
        const TypeOfDelivery = "Still Birth / Fetal Death";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, TypeOfDelivery,RequestType,OtherReq, EmpId,ErroneousName,CorrectName,RequestTitle, Description);
        const dbDataPDF = new MaternityBenefit3PDF(Application_Form,DeathCert);
        
        // Pass the required parameters to insertPDF function
        await dbOperation.MaternityBenefit(selectedNum,dbData,dbDataPDF);
      }

      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/SSSrequest', upload.fields([
  { name: 'selected' }, 
  { name: 'StatementOfAccount' }, 
  { name: 'VerificationRequestForm' },
  { name: 'MonthlyContributions' },
  { name: 'SpecifyOtherRequest' }
]), async (req, res) => {
  try {
      const selectedNum = req.body.selected;
      const StatementOfAccount = req.files['StatementOfAccount'];
      const VerificationRequestForm = req.files['VerificationRequestForm'];
      const MonthlyContributions = req.files['MonthlyContributions'];
      const SpecifyOtherRequest = req.body.SpecifyOtherRequest;

      // console.log(selectedNum);
      // console.log("Application_Form: ",StatementOfAccount);
      // console.log("LiveBirthCert: ",VerificationRequestForm);

      const TransactionType = "Certification Request";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const OtherReq = "";

      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";

      if(selectedNum === "1"){
        const RequestType = "SSS Unposted Loan Payment";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, RequestType,TypeOfDelivery,OtherReq, EmpId,ErroneousName,CorrectName,RequestTitle, Description);
        const dbDataPDF = new SSSrequesterPDF(StatementOfAccount,VerificationRequestForm);
        
        // Pass the required parameters to insertPDF function
        await dbOperation.SSSrequest(selectedNum,dbData,dbDataPDF);
      }
      else if(selectedNum === "2"){
        const RequestType = "SSS Unposted Contribution";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, RequestType,TypeOfDelivery,OtherReq, EmpId,ErroneousName,CorrectName,RequestTitle, Description);
        const dbDataPDF = new SSSrequesterPDF2(MonthlyContributions,VerificationRequestForm);

        await dbOperation.SSSrequest(selectedNum,dbData,dbDataPDF);
      
      }else if(selectedNum === "3"){
        const RequestType = "SSS Other Information Update Request";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date, Transaction_Number, RequestType,TypeOfDelivery,OtherReq, EmpId,ErroneousName,CorrectName,RequestTitle, Description);
        const dbDataPDF1 = new SSSrequester3(SpecifyOtherRequest);
        const dbDataPDF2 = new SSSrequesterPDF3(VerificationRequestForm);

        // Pass the required parameters to insertPDF function
        await dbOperation.SSSOtherRequest(selectedNum,dbData,dbDataPDF1,dbDataPDF2);
      }

      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/PAG_IBIGrequest', upload.fields([
  { name: 'selected' },
  { name: 'StatementOfAccount' },
  { name: 'FormFromPagIbig' },
  { name: 'ErroneousName' },
  { name: 'CorrectName' },
]), async (req, res) => {
  try {
      const selectedNum = req.body.selected;
      const StatementOfAccount = req.files['StatementOfAccount'];

      const FormFromPagIbig = req.files['FormFromPagIbig'];
      


      const TransactionType = "Certification Request";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const RequestTitle = "";
      const Description = "";

      const EmpId = "10023";

      if(selectedNum === "1"){
        const ErroneousName = "";
        const CorrectName = "";
        const RequestType = "PAG-IBIG Certificate of Remittance";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description);
        const dbDataPDF = new PAG_IBIGrequesterPDF(StatementOfAccount);
        
        // Pass the required parameters to insertPDF function
        await dbOperation.CertificateOfRemittance(selectedNum,dbData,dbDataPDF);
      }
      else if(selectedNum === "2"){
        const ErroneousName = req.body.ErroneousName;
        const CorrectName = req.body.CorrectName;
        const RequestType = "PAG-IBIG Certificate of Oneness";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description);
        const dbDataPDF = new PAG_IBIGrequesterPDF(FormFromPagIbig);


        await dbOperation.CertificateOfOneness(selectedNum,dbData,dbDataPDF);
      
      }
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/OtherRequest', upload.fields([
  { name: 'RequestTitle' },
  { name: 'Description' }
]), async (req, res) => {
  try {

      const { RequestTitle, Description } = req.body;
      
      const TransactionType = "Other Request";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5";
      const Application_Date = "";
      const Transaction_Number = "";
      const thisRequestType = "Other Request";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";

      const dbData = new thisDefaultContructor(TransactionType, Status, currentDate, TurnAround, Application_Date, Transaction_Number, thisRequestType, TypeOfDelivery, OtherReq, EmpId, ErroneousName, CorrectName, RequestTitle, Description);
      await dbOperation.OtherRequest(dbData);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

      
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));