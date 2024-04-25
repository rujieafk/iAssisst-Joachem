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
        .input('PdfFileID', data.PdfFileID) 
        .query(`
            UPDATE PdfFile SET EmpResubmitted = @EmpResubmitted WHERE PdfFileID = @PdfFileID;
        `); 

        InsertResubmitPdf(data,dataPDF);

        console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}  

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

module.exports = {
    insertPDF,
    getSubmissions,
    getUserSubmissions,
    getPDF,
    updateResubmit
};