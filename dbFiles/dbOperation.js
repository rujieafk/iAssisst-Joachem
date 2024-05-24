// dbOperation.js
const config = require('./dbConfig');
const sql = require('mssql');
const fs = require('fs'); 

const insertPDF = async (filename) => {
    try {
        console.log('1')
        let pool = await sql.connect(config);

        // Read the file from the uploads directory
        const fileData = fs.readFileSync(`uploads/${filename}`);

        // Convert binary data to Base64 string
        const base64Data = Buffer.from(fileData).toString('base64');
        
        console.log('2')

        let file = await pool.request()
            .input('pdf', sql.NVarChar(sql.MAX), base64Data) 
            .query(`
                INSERT INTO SSS (Pay_Slip)
                VALUES (@pdf)
            `); 

        console.log(file);
    } catch (error) {
        console.error("Error updating employee attendance:", error);
        throw error;
    }
}

const getSubmissions = async () => {
    try {
        let pool = await sql.connect(config);

        // Query the database to get the PDF data based on the ID
        let result = await pool.request() 
            .query(`
                SELECT 
                    Employee.Name,
                    Submission.SubmissionID,
                    Submission.TransactionType,
                    Submission.TurnAround,
                    Submission.Status,
                    Submission.DateTime,
                    Submission.LoanAppDate,
                    Submission.TransactionNum,
                    Submission.TypeOfDelivery
                FROM Submission
                LEFT JOIN Employee ON Submission.EmpId = Employee.EmpId 
            `);

        // If there's no result, return null
        if (result.recordset.length === 0) {
            return null;
        } 
    
        return result.recordset;

    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}

const getUserSubmissions = async (id) => {
    try {
        let pool = await sql.connect(config);

        // Query the database to get the PDF data based on the ID
        let result = await pool.request() 
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    Employee.Name,
                    Submission.SubmissionID,
                    Submission.TransactionType,
                    Submission.TurnAround,
                    Submission.Status,
                    Submission.DateTime,
                    Submission.LoanAppDate,
                    Submission.TransactionNum,
                    Submission.TypeOfDelivery
                FROM Submission
                LEFT JOIN Employee ON Submission.EmpId = Employee.EmpId 
                Where Submission.EmpId = @id
            `);

        // If there's no result, return null
        if (result.recordset.length === 0) {
            return null;
        } 
    
        return result.recordset;

    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}

const getPDF = async (id) => {
    try {
        let pool = await sql.connect(config);

        // Query the database to get the PDF data based on the ID
        let result = await pool.request() 
            .input('id', sql.Int, id)
            .query(`
                SELECT *
                FROM PdfFile
                WHERE SubmissionID = @id
            `);

        // If there's no result, return null
        if (result.recordset.length === 0) {
            return null;
        } 
        // console.log(result.recordset)
        return result.recordset;
    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}

const updateResubmit = async(data,dataPDF) => {
    try {
        // Assuming you have already initialized SQL connection pool
        let pool = await sql.connect(config);

        const EmpResubmitted = "1";
        
        const file = await pool.request()

        .input('EmpResubmitted', EmpResubmitted) 
        .input('SubmissionID', data.SubmissionID) 
        .query(`
            UPDATE PdfFile SET EmpResubmitted = @EmpResubmitted WHERE SubmissionID = @SubmissionID;
        `); 

        InsertResubmitPdf(data,dataPDF);

        console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}  

//Government Loan -----------------------------------------------------------------------
    const sssLoan = (data, dataPDF) => {
        try {
            const TransactionType = data.TransactionType;
            const Status = data.Status;
            const DateTime = data.currentDate;
            const TurnAround = data.TurnAround;
            const Application_Date = data.Application_Date;
            const Transaction_Num = data.Transaction_Number;
            const TypeOfDelivery = data.TypeOfDelivery;
            const RequestType = data.RequestType;
            const OtherReq = data.OtherReq;
            const EmpId = data.EmpId;
            const ErroneousName = data.ErroneousName;
            const CorrectName = data.CorrectName;
            const RequestTitle = data.RequestTitle;
            const Description = data.Description;
            const CompletionDate = data.CompletionDate;
            const DeductionFor = data.DeductionFor;
            const ReasonType = data.ReasonType;
            insertIntoSubmission(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)

            } catch (error) {
                console.error("Error inserting PDF:", error);
                throw error;
            }
        }
    const PagIbigLandbankCard = async (data, dataPDF) => {
        try {
            const TransactionType = data.TransactionType;
            const Status = data.Status;
            const DateTime = data.currentDate;
            const TurnAround = data.TurnAround;
            const Application_Date = data.Application_Date;
            const Transaction_Num = data.Transaction_Number;
            const TypeOfDelivery = data.TypeOfDelivery;
            const RequestType = data.RequestType;
            const OtherReq = data.OtherReq;
            const EmpId = data.EmpId;
            const ErroneousName = data.ErroneousName;
            const CorrectName = data.CorrectName;
            const RequestTitle = data.RequestTitle;
            const Description = data.Description;
            const CompletionDate = data.CompletionDate;
            const DeductionFor = data.DeductionFor;
            const ReasonType = data.ReasonType;
            insertIntoSubmission(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)
    
        } catch (error) {
            console.error("Error inserting PDF:", error);
            throw error;
        }
    }
    const PagIbigDBPCard = async (data, dataPDF) => {
        try {
            const TransactionType = data.TransactionType;
            const Status = data.Status;
            const DateTime = data.currentDate;
            const TurnAround = data.TurnAround;
            const Application_Date = data.Application_Date;
            const Transaction_Num = data.Transaction_Number;
            const TypeOfDelivery = data.TypeOfDelivery;
            const RequestType = data.RequestType;
            const OtherReq = data.OtherReq;
            const EmpId = data.EmpId;
            const ErroneousName = data.ErroneousName;
            const CorrectName = data.CorrectName;
            const RequestTitle = data.RequestTitle;
            const Description = data.Description;
            const CompletionDate = data.CompletionDate;
            const DeductionFor = data.DeductionFor;
            const ReasonType = data.ReasonType;
            insertIntoSubmission(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)
    
        } catch (error) {
            console.error("Error inserting PDF:", error);
            throw error;
        }
    }
    const PagIbigVirtualAccount = async (data, dataPDF) => {
        try {
            const TransactionType = data.TransactionType;
            const Status = data.Status;
            const DateTime = data.currentDate;
            const TurnAround = data.TurnAround;
            const Application_Date = data.Application_Date;
            const Transaction_Num = data.Transaction_Number;
            const TypeOfDelivery = data.TypeOfDelivery;
            const RequestType = data.RequestType;
            const OtherReq = data.OtherReq;
            const EmpId = data.EmpId;
            const ErroneousName = data.ErroneousName;
            const CorrectName = data.CorrectName;
            const RequestTitle = data.RequestTitle;
            const Description = data.Description;
            const CompletionDate = data.CompletionDate;
            const DeductionFor = data.DeductionFor;
            const ReasonType = data.ReasonType;
            insertIntoSubmission(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)
    
        } catch (error) {
            console.error("Error inserting PDF:", error);
            throw error;
        }
    }
    const MaternityNotification = async (data, dataPDF) => {
        try {
            const TransactionType = data.TransactionType;
            const Status = data.Status;
            const DateTime = data.currentDate;
            const TurnAround = data.TurnAround;
            const Application_Date = data.Application_Date;
            const Transaction_Num = data.Transaction_Number;
            const TypeOfDelivery = data.TypeOfDelivery;
            const RequestType = data.RequestType;
            const OtherReq = data.OtherReq;
            const EmpId = data.EmpId;
            const ErroneousName = data.ErroneousName;
            const CorrectName = data.CorrectName;
            const RequestTitle = data.RequestTitle;
            const Description = data.Description;
            const CompletionDate = data.CompletionDate;
            const DeductionFor = data.DeductionFor;
            const ReasonType = data.ReasonType;
            insertIntoSubmission(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)
    
        } catch (error) {
            console.error("Error inserting PDF:", error);
            throw error;
        }
    }
    const insertIntoSubmission = async (TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,dataPDF) => {
        try {
            let pool = await sql.connect(config);
            
            const RequirementName1 = "1 Month Pay Slip";
            const RequirementName2 = "Loan Disclosure Statement";
    
            const RequirementName3 = "Application Form";
            const RequirementName4 = "1 Month Payslip";
            const RequirementName5 = "Valid ID";
    
            const RequirementName6 = "Application Form";
            const RequirementName7 = "1 Month Payslip";
            const RequirementName8 = "Valid ID";
    
            const RequirementName9 = "Screenshot of Filed Loan via Virtual Account";
            const RequirementName10 = "1 Month Payslip";
            const RequirementName11 = "1 Month Gross Income";
    
            const RequirementName12 = "SSS Maternity Notification Form";
            const RequirementName13 = "Screenshot of SSS Maternity Eligibility";
            const RequirementName14 = "SSS Allocation of Maternity Leave Credit Form";
            const RequirementName15 = "Medical Certificate or Ultrasound Report";
    
            const file = await pool.request()
                .input('TransactionType', TransactionType)
                .input('Status', Status)
                .input('DateTime', DateTime)
                .input('TurnAround', TurnAround)
                .input('Application_Date', Application_Date)
                .input('Transaction_Num', Transaction_Num)
                .input('DeliveryType', TypeOfDelivery)
                .input('RequestType', RequestType)
                .input('OtherReq', OtherReq)
                .input('EmpId', EmpId) 
                .input('ErroneousName', ErroneousName) 
                .input('CorrectName', CorrectName) 
                .input('RequestTitle', RequestTitle) 
                .input('Description', Description)
                .input('CompletionDate', CompletionDate)
                .input('DeductionFor', DeductionFor)
                .input('ReasonType', ReasonType)
                .query(`
                    INSERT INTO Submission (TransactionType,Status,DateTime,TurnAround,LoanAppDate,TransactionNum,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle,Description,CompletionDate,DeductionFor,ReasonType)
                    OUTPUT inserted.SubmissionID
                    VALUES (@TransactionType,@Status,@DateTime,@TurnAround,@Application_Date,@Transaction_Num,@DeliveryType,@RequestType,@OtherReq,@EmpId,@ErroneousName,@CorrectName,@RequestTitle,@Description,@CompletionDate,@DeductionFor,@ReasonType)
                `); 
    
                const SubmissionID = file.recordset[0].SubmissionID;
    
                console.log(dataPDF);
                if(TransactionType === "SSS Loan"){
                    PdfFile(dataPDF.Doc1,SubmissionID,RequirementName1);
                    PdfFile(dataPDF.Doc2,SubmissionID,RequirementName2);
                }else if(TransactionType === "Pag-Ibig Landbank Card"){
                    PdfFile(dataPDF.Doc1,SubmissionID,RequirementName3);
                    PdfFile(dataPDF.Doc2,SubmissionID,RequirementName4);
                    PdfFile(dataPDF.Doc3,SubmissionID,RequirementName5);
                }else if(TransactionType === "Pag-Ibig DBP Card"){
                    PdfFile(dataPDF.Doc1,SubmissionID,RequirementName6);
                    PdfFile(dataPDF.Doc2,SubmissionID,RequirementName7);
                    PdfFile(dataPDF.Doc3,SubmissionID,RequirementName8);
                }else if(TransactionType === "Pag-Ibig Virtual Account"){
                    PdfFile(dataPDF.Doc1,SubmissionID,RequirementName9);
                    PdfFile(dataPDF.Doc2,SubmissionID,RequirementName10);
                    PdfFile(dataPDF.Doc3,SubmissionID,RequirementName11);
                }else if(TransactionType === "Maternity Notication"){
                    PdfFile(dataPDF.Notication_Form,SubmissionID,RequirementName12);
                    PdfFile(dataPDF.Maternity_Eligibility,SubmissionID,RequirementName13);
                    PdfFile(dataPDF.Credit_Form,SubmissionID,RequirementName14);
                    PdfFile(dataPDF.Medical_Reports,SubmissionID,RequirementName15);
                }
    
                console.log("Successfully inserted: ",file);
        } catch (error) {
            console.error("Error inserting PDF:", error);
            throw error;
        }
    }
//---------------------------------------------------------------------------------------------
const InsertResubmitPdf = async (data,dataPDF) => {
    try {
        let pool = await sql.connect(config);
        
        const pdf = fs.readFileSync(`uploads/${dataPDF.resubmitPDF.filename}`);

        const pdf_base64 = Buffer.from(pdf).toString('base64');

        const file = await pool.request()
        .input('RequirementName', data.requirementName)
        .input('FileName', data.FileName)
        .input('ContentType', data.ContentType)
        .input('Filesize', data.Filesize)
        .input('UploadDate', data.UploadDate)
        .input('Resubmit', data.Resubmit)
        .input('ResubmitReason', data.ResubmitReason)
        .input('SubmissionID', data.SubmissionID)
        .input('pdfData', sql.NVarChar(sql.MAX), pdf_base64)
        .query(`
            INSERT INTO PdfFile (RequirementName, FileName, ContentType, Filesize, UploadDate, Resubmit, ResubmitReason, SubmissionID, pdfData)
            VALUES (@RequirementName, @FileName, @ContentType, @Filesize, @UploadDate, @Resubmit, @ResubmitReason, @SubmissionID, @pdfData)
        `);
  

        console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
//--------------------------------------------------------------------------------------------

//Maternity -----------------------------------------------------------------------
const MaternityBenefit = async (selectedNum, data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const TypeOfDelivery = data.TypeOfDelivery;
        const RequestType = data.RequestType;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate = data.CompletionDate;
        const DeductionFor = data.DeductionFor;
        const ReasonType = data.ReasonType;

        insertSubmissionMaternityBenefit(selectedNum,TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)
       
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const insertSubmissionMaternityBenefit = async (selected, TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF) => {
    try {
        // Assuming you have already initialized SQL connection pool
        let pool = await sql.connect(config);

        const RequirementName16 = "Application Form";
        const RequirementName17 = "Live Birth Certificate";
        const RequirementName18 = "Solo Parent ID";

        const RequirementName19 = "Application Form";
        const RequirementName20 = "Proof of Pregnancy";
        const RequirementName21 = "Proof of Termination of Pregnancy";

        const RequirementName22 = "Application Form";
        const RequirementName23 = "Fetal Certificate of Death";

        const file = await pool.request()
            
            .input('TransactionType', TransactionType)
            .input('Status', Status)
            .input('DateTime', DateTime)
            .input('TurnAround', TurnAround)
            .input('Application_Date', Application_Date)
            .input('Transaction_Num', Transaction_Num)
            .input('DeliveryType', TypeOfDelivery)
            .input('RequestType', RequestType)
            .input('OtherReq', OtherReq)
            .input('EmpId', EmpId) 
            .input('ErroneousName', ErroneousName) 
            .input('CorrectName', CorrectName) 
            .input('RequestTitle', RequestTitle) 
            .input('Description', Description)
            .input('CompletionDate', CompletionDate)
            .input('DeductionFor', DeductionFor)
            .input('ReasonType', ReasonType)
            .query(`
                INSERT INTO Submission (TransactionType,Status,DateTime,TurnAround,LoanAppDate,TransactionNum,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle,Description,CompletionDate,DeductionFor,ReasonType)
                OUTPUT inserted.SubmissionID
                VALUES (@TransactionType,@Status,@DateTime,@TurnAround,@Application_Date,@Transaction_Num,@DeliveryType,@RequestType,@OtherReq,@EmpId,@ErroneousName,@CorrectName,@RequestTitle,@Description,@CompletionDate,@DeductionFor,@ReasonType)
            `); 

            const SubmissionID = file.recordset[0].SubmissionID;

            console.log(dataPDF);
            if(TransactionType === "Maternity Benefit"){
                if(selected === "1"){
                    PdfFile(dataPDF.Application_Form,SubmissionID,RequirementName16);
                    PdfFile(dataPDF.LiveBirthCert,SubmissionID,RequirementName17);
                    PdfFile(dataPDF.SoloParent,SubmissionID,RequirementName18);
                }else if(selected === "2"){
                    PdfFile(dataPDF.Application_Form,SubmissionID,RequirementName19);
                    PdfFile(dataPDF.ProofPregnancy,SubmissionID,RequirementName20);
                    PdfFile(dataPDF.HospitalRec,SubmissionID,RequirementName21);
                }else if(selected === "3"){
                    PdfFile(dataPDF.Application_Form,SubmissionID,RequirementName22);
                    PdfFile(dataPDF.DeathCert,SubmissionID,RequirementName23);
                }
            }
            console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
//-----------------------------------------------------------------------------

//Certificate Request ---------------------------------------------------------
const CertificationRequestSSS = async (selectedNum, data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate = data.CompletionDate;
        const DeductionFor = data.DeductionFor;
        const ReasonType = data.ReasonType;

        insertCertificationRequestSSS(selectedNum,TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)
       
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const SSSOtherRequest = async (selectedNum, data, dbDataMessage, dbDataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const TypeOfDelivery = data.TypeOfDelivery;
        const RequestType = data.RequestType;
        const OtherReq = dbDataMessage.DocumentFile;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate = data.CompletionDate;
        const DeductionFor = data.DeductionFor;
        const ReasonType = data.ReasonType;

        insertCertificationRequestSSS(selectedNum,TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dbDataPDF)
       
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const PHILHEALTHrequest = async (data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate= data.CompletionDate;
        const ReasonType = data.ReasonType;
        const DeductionFor = data.DeductionFor;

        insertCertificationRequestPagIbig(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)
       
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const insertCertificationRequestSSS = async (selected, TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF) => {
    try {
        // Assuming you have already initialized SQL connection pool
        let pool = await sql.connect(config);

        const RequirementName16 = "Latest Statement of Account";
        const RequirementName17 = "Request/Verification Form";

        const RequirementName18 = "Latest Monthly Contributions"


        const file = await pool.request()
            
            .input('TransactionType', TransactionType)
            .input('Status', Status)
            .input('DateTime', DateTime)
            .input('TurnAround', TurnAround)
            .input('Application_Date', Application_Date)
            .input('Transaction_Num', Transaction_Num)
            .input('DeliveryType', TypeOfDelivery)
            .input('RequestType', RequestType)
            .input('OtherReq', OtherReq)
            .input('EmpId', EmpId) 
            .input('ErroneousName', ErroneousName) 
            .input('CorrectName', CorrectName) 
            .input('RequestTitle', RequestTitle) 
            .input('Description', Description)
            .input('CompletionDate', CompletionDate)
            .input('DeductionFor', DeductionFor)
            .input('ReasonType', ReasonType)
            .query(`
                INSERT INTO Submission (TransactionType,Status,DateTime,TurnAround,LoanAppDate,TransactionNum,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle,Description,CompletionDate,DeductionFor,ReasonType)
                OUTPUT inserted.SubmissionID
                VALUES (@TransactionType,@Status,@DateTime,@TurnAround,@Application_Date,@Transaction_Num,@DeliveryType,@RequestType,@OtherReq,@EmpId,@ErroneousName,@CorrectName,@RequestTitle,@Description,@CompletionDate,@DeductionFor,@ReasonType)
            `); 

            const SubmissionID = file.recordset[0].SubmissionID;

            if(TransactionType === "Certification Request"){
                if(selected === "1"){
                    PdfFile(dataPDF.Doc1,SubmissionID,RequirementName16);
                    PdfFile(dataPDF.Doc2,SubmissionID,RequirementName17);
                }else if(selected === "2"){
                    PdfFile(dataPDF.Doc1,SubmissionID,RequirementName18);
                    PdfFile(dataPDF.Doc2,SubmissionID,RequirementName17);
                }else if(selected === "3"){
                    PdfFile(dataPDF.DocumentFile,SubmissionID,RequirementName17);
                }
            }
            console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}

const CertificateOfRemittance = async (selectedNum, data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate = data.CompletionDate;
        const DeductionFor = data.DeductionFor;
        const ReasonType = data.ReasonType;

        insertCertificationRequestPAG_IBIG(selectedNum,TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)
       
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const CertificateOfOneness = async (selectedNum, data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate = data.CompletionDate;
        const DeductionFor = data.DeductionFor;
        const ReasonType = data.ReasonType;

        insertCertificationRequestPAG_IBIG(selectedNum,TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF)
       
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}

const insertCertificationRequestPAG_IBIG = async (selected, TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType, dataPDF) => {
    try {
        // Assuming you have already initialized SQL connection pool
        let pool = await sql.connect(config);

        const RequirementName16 = "Latest Statement of Account";

        const RequirementName17 = "Form from Pag-Ibig";

        const file = await pool.request()
            
            .input('TransactionType', TransactionType)
            .input('Status', Status)
            .input('DateTime', DateTime)
            .input('TurnAround', TurnAround)
            .input('Application_Date', Application_Date)
            .input('Transaction_Num', Transaction_Num)
            .input('DeliveryType', TypeOfDelivery)
            .input('RequestType', RequestType)
            .input('OtherReq', OtherReq)
            .input('EmpId', EmpId) 
            .input('ErroneousName', ErroneousName) 
            .input('CorrectName', CorrectName) 
            .input('RequestTitle', RequestTitle) 
            .input('Description', Description)
            .input('CompletionDate', CompletionDate)
            .input('DeductionFor', DeductionFor)
            .input('ReasonType', ReasonType)
            .query(`
                INSERT INTO Submission (TransactionType,Status,DateTime,TurnAround,LoanAppDate,TransactionNum,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle,Description,CompletionDate,DeductionFor,ReasonType)
                OUTPUT inserted.SubmissionID
                VALUES (@TransactionType,@Status,@DateTime,@TurnAround,@Application_Date,@Transaction_Num,@DeliveryType,@RequestType,@OtherReq,@EmpId,@ErroneousName,@CorrectName,@RequestTitle,@Description,@CompletionDate,@DeductionFor,@ReasonType)
           `);

            const SubmissionID = file.recordset[0].SubmissionID;

            if(TransactionType === "Certification Request"){
                if(selected === "1"){
                    PdfFile(dataPDF.DocumentFile,SubmissionID,RequirementName16);
                }else if(selected === "2"){
                    PdfFile(dataPDF.DocumentFile,SubmissionID,RequirementName17);
                }
            }
            console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const insertCertificationRequestPagIbig = async (TransactionType, Status, DateTime, TurnAround, Application_Date, Transaction_Num, RequestType, TypeOfDelivery, OtherReq, EmpId, ErroneousName, CorrectName, RequestTitle, Description, CompletionDate,DeductionFor,ReasonType,dataPDF) => {
    try {
        let pool = await sql.connect(config);

        const RequirementName = ReasonType;

        const file = await pool.request()
            .input('TransactionType', TransactionType)
            .input('Status', Status)
            .input('DateTime', DateTime)
            .input('TurnAround', TurnAround)
            .input('Application_Date', Application_Date)
            .input('Transaction_Num', Transaction_Num)
            .input('RequestType', RequestType)
            .input('DeliveryType', TypeOfDelivery)
            .input('OtherReq', OtherReq)
            .input('EmpId', EmpId) 
            .input('ErroneousName', ErroneousName) 
            .input('CorrectName', CorrectName) 
            .input('RequestTitle', RequestTitle) 
            .input('Description', Description)
            .input('CompletionDate', CompletionDate)
            .input('DeductionFor', DeductionFor)
            .input('ReasonType', ReasonType)
            .query(`
                INSERT INTO Submission (TransactionType,Status,DateTime,TurnAround,LoanAppDate,TransactionNum,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle,Description,CompletionDate,DeductionFor,ReasonType)
                OUTPUT inserted.SubmissionID
                VALUES (@TransactionType,@Status,@DateTime,@TurnAround,@Application_Date,@Transaction_Num,@DeliveryType,@RequestType,@OtherReq,@EmpId,@ErroneousName,@CorrectName,@RequestTitle,@Description,@CompletionDate,@DeductionFor,@ReasonType)
           `);

           const SubmissionID = file.recordset[0].SubmissionID;

           if(DeductionFor === "SSS Salary Loan" || DeductionFor === "SSS Calamity Loan"){
                PdfFile(dataPDF.DocumentFile,SubmissionID,RequirementName);
           }else if(DeductionFor === "PAG-IBIG Salary Loan" || DeductionFor === "PAG-IBIG Calamity Loan"){
                PdfFile(dataPDF.DocumentFile,SubmissionID,RequirementName);
           }
           console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
//---------------------------------------------------------------------------------------------------





const OtherRequest = async (data,dataPDF) => {
    try {

        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate= data.CompletionDate;
        const ReasonType = data.ReasonType;
        const DeductionFor = data.DeductionFor;

        insertOtherRequest(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,dataPDF)
       
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const insertOtherRequest = async (TransactionType, Status, DateTime, TurnAround, Application_Date, Transaction_Num, RequestType, TypeOfDelivery, OtherReq, EmpId, ErroneousName, CorrectName, RequestTitle, Description, CompletionDate,DeductionFor,ReasonType,dataPDF) => {
    try {
        let pool = await sql.connect(config);

        const file = await pool.request()
            .input('TransactionType', TransactionType)
            .input('Status', Status)
            .input('DateTime', DateTime)
            .input('TurnAround', TurnAround)
            .input('Application_Date', Application_Date)
            .input('Transaction_Num', Transaction_Num)
            .input('RequestType', RequestType)
            .input('DeliveryType', TypeOfDelivery)
            .input('OtherReq', OtherReq)
            .input('EmpId', EmpId) 
            .input('ErroneousName', ErroneousName) 
            .input('CorrectName', CorrectName) 
            .input('RequestTitle', RequestTitle) 
            .input('Description', Description)
            .input('CompletionDate', CompletionDate)
            .input('DeductionFor', DeductionFor)
            .input('ReasonType', ReasonType)
            .query(`
                    INSERT INTO Submission (TransactionType,Status,DateTime,TurnAround,LoanAppDate,TransactionNum,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle,Description,CompletionDate,DeductionFor,ReasonType)
                    OUTPUT inserted.SubmissionID
                    VALUES (@TransactionType,@Status,@DateTime,@TurnAround,@Application_Date,@Transaction_Num,@DeliveryType,@RequestType,@OtherReq,@EmpId,@ErroneousName,@CorrectName,@RequestTitle,@Description,@CompletionDate,@DeductionFor,@ReasonType)
            `);

            const SubmissionID = file.recordset[0].SubmissionID;
            const RequirementName = "Other Request Uploaded File";
            PdfFile(dataPDF.DocumentFile,SubmissionID,RequirementName);

            console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}


//-----------------------------------------------------------------------


const PdfFile = async (insertPDF,SubmissionID,RequirementName) => {
    try {
    
        const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

        let pool = await sql.connect(config);

        const thisRequirementName = RequirementName;
        const Filename = insertPDF[0].originalname;
        const ContentType = "pdf";
        const Size = insertPDF[0].size;
        const UploadDate = currentDate;

        const pdf = fs.readFileSync(`uploads/${insertPDF[0].filename}`);

        const pdf_base64 = Buffer.from(pdf).toString('base64');

        const Resubmit = "0";
        const ResubmitReason = "";
        const thisSubmissionID = SubmissionID;

        let file = await pool.request()
            .input('RequirementName', thisRequirementName)
            .input('Filename', Filename)
            .input('ContentType', ContentType)
            .input('Size', Size)
            .input('UploadDate', UploadDate)
            .input('pdfData', sql.NVarChar(sql.MAX), pdf_base64)  
            .input('Resubmit',Resubmit)
            .input('ResubmitReason',ResubmitReason)
            .input('SubmissionID',thisSubmissionID)
            .query(`
                INSERT INTO PdfFile (RequirementName,FileName,ContentType,FileSize,UploadDate, PdfData, Resubmit,ResubmitReason,SubmissionID)
                VALUES (@RequirementName,@Filename,@ContentType,@Size,@UploadDate,@pdfData,@Resubmit,@ResubmitReason,@SubmissionID)
            `); 

        console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
// -----------------------------------------------------------------------


module.exports = {
    insertPDF,
    getSubmissions,
    getUserSubmissions,
    getPDF,
    updateResubmit,
    sssLoan,
    PagIbigLandbankCard,
    PagIbigDBPCard,
    PagIbigVirtualAccount,
    MaternityNotification,
    MaternityBenefit,
    CertificationRequestSSS,
    SSSOtherRequest,
    PHILHEALTHrequest,
    CertificateOfRemittance,
    CertificateOfOneness,
    OtherRequest
};