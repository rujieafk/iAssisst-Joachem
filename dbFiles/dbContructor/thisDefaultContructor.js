class thisDefaultContructor{
    constructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,TypeOfDelivery,RequestType,OtherReq,EmpId){
        this.TransactionType = TransactionType;
        this.Status = Status;
        this.currentDate = currentDate;
        this.TurnAround = TurnAround;
        this.Application_Date = Application_Date;
        this.Transaction_Number = Transaction_Number;
        this.TypeOfDelivery = TypeOfDelivery;
        this.RequestType = RequestType;
        this.OtherReq = OtherReq;
        this.EmpId = EmpId;
    }
}
module.exports = thisDefaultContructor;