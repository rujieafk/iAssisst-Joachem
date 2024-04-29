class DefualtSubmissionContructor{
    constructor(TransactionType,Status,currentDate,currentTime,TurnAround,EmpId){
        this.TransactionType = TransactionType;
        this.Status = Status;
        this.currentDate = currentDate;
        this.currentTime = currentTime;
        this.TurnAround = TurnAround;
        this.EmpId = EmpId;
    }
}
module.exports = DefualtSubmissionContructor;