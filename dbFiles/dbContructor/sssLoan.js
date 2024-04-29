class sssLoan{
    constructor(TransactionType,Status,currentDate,currentTime,TurnAround,Application_Date, Transaction_Number,EmpId){
        this.TransactionType = TransactionType;
        this.Status = Status;
        this.currentDate = currentDate;
        this.currentTime = currentTime;
        this.TurnAround = TurnAround;
        this.Application_Date = Application_Date;
        this.Transaction_Number = Transaction_Number;
        this.EmpId = EmpId;
    }
}
module.exports = sssLoan;