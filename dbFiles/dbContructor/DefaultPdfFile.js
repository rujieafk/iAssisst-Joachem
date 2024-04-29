class DefaultPdfFile{
    constructor(ApplicationFormFile, paySlipFiles, Valid_ID){
        this.ApplicationFormFile = ApplicationFormFile;
        this.paySlipFiles = paySlipFiles;
        this.Valid_ID = Valid_ID;
    }
}
module.exports = DefaultPdfFile;