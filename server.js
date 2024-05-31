// backend
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify upload directory

const dbOperation = require('./dbFiles/dbOperation.js');
const thisDefaultContructor = require('./dbFiles/dbContructor/thisDefaultContructor.js');
const DefaultOneFile = require('./dbFiles/dbContructor/DefaultOneFile.js');
const DefaultTwoFile = require('./dbFiles/dbContructor/DefaultTwoFile.js');
const DefaultThreeFile = require('./dbFiles/dbContructor/DefaultThreeFile.js');
const DefaultSetterFile = require('./dbFiles/dbContructor/DefaultSetterFile.js');

const submissionResubmit = require('./dbFiles/dbContructor/submissionResubmit.js');
const ResubmitPDFContructor = require('./dbFiles/dbContructor/ResubmitPDFContructor.js');

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
app.post('/SSSloan', upload.fields([{ name: 'Pay_Slip' }, { name: 'Disclosure_Statement' }, { name: 'Application_Date' }, { name: 'Transaction_Number' }]), async (req, res) => {
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
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";

      const PlaceOfConfinement ="";
      const BankAccount ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
      const dbDataPDF = new DefaultThreeFile(paySlipFiles,disclosureStatementFiles);

      // Pass the required parameters to insertPDF function
      await dbOperation.sssLoan(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


//Pag-ibig Landbank Card
app.post('/PagIbigLandbankCard', upload.fields([{ name: 'Application_Form' }, { name: 'paySlipFiles' }, { name: 'Valid_ID' } ]), async (req, res) => {
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
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";

      const ApplicationFormFile = req.files['Application_Form'];
      const paySlipFiles = req.files['paySlipFiles'];
      const Valid_ID= req.files['Valid_ID'];

      const PlaceOfConfinement ="";
      const BankAccount ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
      const dbDataPDF = new DefaultThreeFile(ApplicationFormFile,paySlipFiles,Valid_ID);

      // Pass the required parameters to insertPDF function
      await dbOperation.PagIbigLandbankCard(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

//Pag-ibig Virtual Account
app.post('/PagIbigVirtualAccount', upload.fields([ { name: 'paySlip' }, { name: 'Screenshot_Virtual' }, { name: 'GrossIncome' } ]), async (req, res) => {
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
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";

      const paySlip = req.files['paySlip'];
      const Screenshot_Virtual = req.files['Screenshot_Virtual'];
      const GrossIncome= req.files['GrossIncome'];

      const PlaceOfConfinement ="";
      const BankAccount ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
      const dbDataPDF = new DefaultThreeFile(Screenshot_Virtual,paySlip,GrossIncome);

      // Pass the required parameters to insertPDF function
      await dbOperation.PagIbigVirtualAccount(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/MaternityNotification', upload.fields([ { name: 'Notication_Form' }, { name: 'Maternity_Eligibility' }, { name: 'Credit_Form' }, { name: 'Medical_Reports' } ]), async (req, res) => {
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
    const CompletionDate= "";
    const ReasonType="";
    const DeductionFor="";
    
    const Notication_Form = req.files['Notication_Form'];
    const Maternity_Eligibility = req.files['Maternity_Eligibility'];
    const Credit_Form= req.files['Credit_Form'];
    const Medical_Reports= req.files['Medical_Reports'];

    const PlaceOfConfinement ="";
    const BankAccount ="";

    const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
    const dbDataPDF = new DefaultSetterFile(Notication_Form,Maternity_Eligibility,Credit_Form,Medical_Reports);
      
      // console.log(dbData);
      // Pass the required parameters to insertPDF function
      await dbOperation.MaternityNotification(dbData, dbDataPDF);
      
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
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";
      const PlaceOfConfinement ="";
      const BankAccount ="";

    
      const EmpId = "10023";

      if(selectedNum === "1"){
        const TypeOfDelivery = "Live Child Birth";
        
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
        const dbDataPDF = new DefaultThreeFile(Application_Form,LiveBirthCert,SoloParent);
        
        // Pass the required parameters to insertPDF function
        await dbOperation.MaternityBenefit(dbData,dbDataPDF);
      }
      else if(selectedNum === "2"){
        const TypeOfDelivery = "Miscarriage / Emergency Termination of Pregnancy / Ectopic Pregnancy";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
        const dbDataPDF = new DefaultSetterFile(Application_Form,ProofPregnancy,HospitalRec);
        
        // Pass the required parameters to insertPDF function
        await dbOperation.MaternityBenefit(dbData,dbDataPDF);
      }else if(selectedNum === "3"){
        const TypeOfDelivery = "Still Birth / Fetal Death";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
        const dbDataPDF = new DefaultTwoFile(Application_Form,DeathCert);
        
        // Pass the required parameters to insertPDF function
        await dbOperation.MaternityBenefit(dbData,dbDataPDF);
      }
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/CertificationRequestSSS', upload.fields([
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

      const TransactionType = "Certification Request";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      

      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";
      const PlaceOfConfinement ="";
      const BankAccount ="";

      if(selectedNum === "1"){
        const OtherReq = "";
        const RequestType = "SSS Unposted Loan Payment";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
        const dbDataPDF = new DefaultTwoFile(StatementOfAccount,VerificationRequestForm);
        
        await dbOperation.CertificationRequestSSS(dbData,dbDataPDF);
      }
      else if(selectedNum === "2"){
        const OtherReq = "";
        const RequestType = "SSS Unposted Contribution";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
        const dbDataPDF = new DefaultTwoFile(MonthlyContributions,VerificationRequestForm);

        await dbOperation.CertificationRequestSSS(dbData,dbDataPDF);
      
      }else if(selectedNum === "3"){
        const OtherReq = SpecifyOtherRequest;
        const RequestType = "SSS Other Information Update Request";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
        const dbDataPDF = new DefaultOneFile(VerificationRequestForm);

        // Pass the required parameters to insertPDF function
        await dbOperation.CertificationRequestSSS(dbData,dbDataPDF);
      }

      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/PagIbigRequest', upload.fields([
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
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";

      const EmpId = "10023";

      const PlaceOfConfinement ="";
      const BankAccount ="";

      if(selectedNum === "1"){
        const ErroneousName = "";
        const CorrectName = "";
        const RequestType = "PAG-IBIG Certificate of Remittance";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
        const dbDataPDF = new DefaultOneFile(StatementOfAccount);
        
        // Pass the required parameters to insertPDF function
        await dbOperation.CertificateOfRemittance(dbData,dbDataPDF);
      }
      else if(selectedNum === "2"){
        const ErroneousName = req.body.ErroneousName;
        const CorrectName = req.body.CorrectName;
        const RequestType = "PAG-IBIG Certificate of Oneness";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
        const dbDataPDF = new DefaultOneFile(FormFromPagIbig);


        await dbOperation.CertificateOfOneness(dbData,dbDataPDF);
      
      }
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/PHILHEALTHrequest', upload.fields([
  { name: 'selected' },
  { name: 'selectedReason' },
  { name: 'EmailNotification' },
  { name: 'ProvidentApplicationForm' }
]), async (req, res) => {
  try {
      const selected = req.body.selected;
      const selectedReason = req.body.selectedReason;

      const EmailNotification = req.files['EmailNotification'];
      const ProvidentApplicationForm = req.files['ProvidentApplicationForm'];
      
      const TransactionType = "Certification Request";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const RequestType = "";
      const OtherReq = "";
      const RequestTitle = "";
      const Description = "";
      const CompletionDate = "";
        
      const EmpId = "10023";

      const ErroneousName = "";
      const CorrectName = "";
      const PlaceOfConfinement ="";
      const BankAccount ="";
      
      if(selected === "1"){
        if(selectedReason === "1"){
          const ReasonType = "Load is Fully-Paid";
          const DeductionFor = "SSS Salary Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
          const dbDataPDF = new DefaultOneFile(EmailNotification);

          await dbOperation.PHILHEALTHrequest(dbData,dbDataPDF);
        }else if(selectedReason === "2"){
          const ReasonType = "Due to Re-Loan";
          const DeductionFor = "SSS Salary Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
          const dbDataPDF = new DefaultOneFile(EmailNotification);

          await dbOperation.PHILHEALTHrequest(dbData,dbDataPDF);
        }
      }
      else if(selected === "2"){
        if(selectedReason === "1"){
          const ReasonType = "Load is Fully-Paid";
          const DeductionFor = "SSS Calamity Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
          const dbDataPDF = new DefaultOneFile(EmailNotification);

          await dbOperation.PHILHEALTHrequest(dbData,dbDataPDF);
        }else if(selectedReason === "2"){
          const ReasonType = "Due to Re-Loan";
          const DeductionFor = "SSS Calamity Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
          const dbDataPDF = new DefaultOneFile(EmailNotification);

          await dbOperation.PHILHEALTHrequest(dbData,dbDataPDF);
        }
      
      }
      else if(selected === "3"){
        if(selectedReason === "1"){
          const ReasonType = "Provident Fund";
          const DeductionFor = "PAG-IBIG Salary Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
          const dbDataPDF = new DefaultOneFile(ProvidentApplicationForm);

          await dbOperation.PHILHEALTHrequest(dbData,dbDataPDF);
        }else if(selectedReason === "2"){
          const ReasonType = "Re-Loan";
          const DeductionFor = "PAG-IBIG Salary Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
          const dbDataPDF = new DefaultOneFile(ProvidentApplicationForm);

          await dbOperation.PHILHEALTHrequest(dbData,dbDataPDF);
        }
      
      }
      else if(selected === "4"){
        if(selectedReason === "1"){
          const ReasonType = "Provident Fund";
          const DeductionFor = "PAG-IBIG Calamity Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
          const dbDataPDF = new DefaultOneFile(ProvidentApplicationForm);

          await dbOperation.PHILHEALTHrequest(dbData,dbDataPDF);
        }else if(selectedReason === "2"){
          const ReasonType = "Re-Loan";
          const DeductionFor = "PAG-IBIG Calamity Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
          const dbDataPDF = new DefaultOneFile(ProvidentApplicationForm);

          await dbOperation.PHILHEALTHrequest(dbData,dbDataPDF);
        }
      
      }
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/SicknessNotification', upload.fields([
  { name: 'SicknessNotificationForm' },
  { name: 'PlaceOfConfinement' },
  { name: 'MedicalCertificate' },
  { name: 'SupportingDocuments' },
  { name: 'ECSupportingDocuments' }
]), async (req, res) => {
  try {
      const PlaceOfConfinement = req.body.PlaceOfConfinement;
      const SicknessNotificationForm = req.files['SicknessNotificationForm'];
      const MedicalCertificate = req.files['MedicalCertificate'];
      const SupportingDocuments = req.files['SupportingDocuments'];
      const ECSupportingDocuments = req.files['ECSupportingDocuments'];
      
      const TransactionType = "SSS Sickness Notification";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5";
      const Application_Date = "";
      const Transaction_Number = "";
      const RequestType = "";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = ""
      const CompletionDate = "";
      const ReasonType ="";
      const DeductionFor ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement);
      const dbDataPDF = new DefaultSetterFile(SicknessNotificationForm,MedicalCertificate,SupportingDocuments,ECSupportingDocuments);
      await dbOperation.SicknessNotification(dbData,dbDataPDF);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/SicknessApproval', upload.fields([
  { name: 'SicknessEligibility' },
  { name: 'BankAccount' }
]), async (req, res) => {
  try {
      const BankAccount = req.body.BankAccount;
      const SicknessEligibility = req.files['SicknessEligibility'];
      
      const TransactionType = "SSS Sickness Approval";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5";
      const Application_Date = "";
      const Transaction_Number = "";
      const RequestType = "";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = ""
      const CompletionDate = "";
      const ReasonType ="";
      const DeductionFor ="";
      const PlaceOfConfinement ="";
      

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
      const dbDataPDF = new DefaultOneFile(SicknessEligibility);
      await dbOperation.SicknessApproval(dbData,dbDataPDF);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/UpdateRequest', upload.fields([
  { name: 'thisAction' },
  { name: 'thisSubmissionID' }
]), async (req, res) => {
  try {

      const { thisAction, thisSubmissionID} = req.body;
      
      await dbOperation.UpdateRequest(thisAction, thisSubmissionID);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/OtherRequest', upload.fields([
  { name: 'RequestTitle' },
  { name: 'Description' },
  { name: 'NeccesaryFile' }
]), async (req, res) => {
  try {

      const { RequestTitle, Description } = req.body;
      const NeccesaryFile = req.files['NeccesaryFile'];
      
      const TransactionType = "Other Request";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5";
      const Application_Date = "";
      const Transaction_Number = "";
      const RequestType = "Other Request";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const EmpId = "10023";
      const ErroneousName = "";
      const CorrectName = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";
      const PlaceOfConfinement ="";
      const BankAccount ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount);
      const dbDataPDF = new DefaultOneFile(NeccesaryFile);
      await dbOperation.OtherRequest(dbData,dbDataPDF);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/UpdateRequest', upload.fields([
  { name: 'thisAction' },
  { name: 'thisSubmissionID' }
]), async (req, res) => {
  try {

      const { thisAction, thisSubmissionID} = req.body;
      
      await dbOperation.UpdateRequest(thisAction, thisSubmissionID);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

      
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));