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

const updateResubmit = (data) => {
    try {
        // const currentDate = data.currentDate + " " +data.currentTime;

        // const TransactionType = data.TransactionType;
        // const Status = data.Status;
        // const DateTime = currentDate;
        // const TurnAround = data.TurnAround;
        // const Application_Date = data.Application_Date;
        // const Transaction_Num = data.Transaction_Number;
        // const EmpId = data.EmpId;

        // resubmitPdfFile(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,EmpId, dataPDF)
      
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}  

const resubmitPdfFile = async (insertPDF,SubmissionID,RequirementName) => {
    try {
    
        const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }); // Format: HH:MM

        let pool = await sql.connect(config);

        const thisRequirementName = RequirementName;
        const Filename = insertPDF[0].originalname;
        const ContentType = "pdf";
        const Size = insertPDF[0].size;
        const UploadDate = currentDate + " " + currentTime;

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
module.exports = {
    insertPDF,
    getSubmissions,
    getUserSubmissions,
    getPDF,
    updateResubmit
};