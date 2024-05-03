import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { variables } from '../../variables';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SSSLoan() {

    const { employeeId } = useParams();
    const [employeeData, setEmployeeData] = useState({
        LastName: '',
        FirstName: '',
        MiddleName: '',
        MaidenName: '',
        Birthdate: '',
        Age: '',
        BirthMonth: '',
        AgeBracket: '',
        Aender: '',
        MaritalStatus: '',
        SSS: '',
        PHIC: '',
        HDMF: '',
        TIN: '',
        HRANID: '',
        ContactNumber: '',
        EmailAddress: ''
    });

    const [thisInfo, setSSSinfo] = useState({
        Application_Date: '',
        Transaction_Number: '',
        Pay_Slip: '',
        Disclosure_Statement: ''
    });

    useEffect(() => {
        // Fetch employee data based on employeeId
        const fetchEmployeeData = async () => {
            try {
                const response = await fetch(variables.API_URL + 'UploadEmp/' + employeeId);
                if (!response.ok) {
                    throw new Error('Failed to fetch employee data');
                }
                const data = await response.json();
                setEmployeeData(data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployeeData();
    }, [employeeId]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!thisInfo.Application_Date || !thisInfo.Transaction_Number || !thisInfo.Pay_Slip || !thisInfo.Disclosure_Statement) {
            // If any required field is empty, show a warning toast
            toast.warn('Please fill in all required fields', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return; // Stop form submission
        }
        
        // const paySlipFile = thisInfo.Pay_Slip;
        // const disclosureFile = thisInfo.Disclosure_Statement;

        // // Check if the files are PDF
        // if (paySlipFile.type !== 'application/pdf' || disclosureFile.type !== 'application/pdf') {
        //     // If not PDF, show a warning toast
        //     toast.warn('Please upload only PDF files for Pay Slip and Disclosure Statement', {
        //         position: "bottom-right",
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //         theme: "light",
        //     });
        //     return; // Stop form submission
        // }

        // Proceed with the file upload
        const formData = new FormData();
        formData.append('Application_Date', thisInfo.Application_Date);
        formData.append('Transaction_Number', thisInfo.Transaction_Number);
        formData.append('Pay_Slip', thisInfo.Pay_Slip);
        formData.append('Disclosure_Statement', thisInfo.Disclosure_Statement);
        
        try {
            const response = await fetch('/SSS_upload', {
                method: 'POST',
                body: formData,
            });
        
            if (response.ok) {
                const jsonResponse = await response.json();
        
                console.log(jsonResponse.message);
        
                setSSSinfo({
                    Application_Date: '',
                    Transaction_Number: '',
                    Pay_Slip: '',
                    Disclosure_Statement: ''
                });
        
                // Clear file input fields
                document.getElementById('loanApplicationDate').value = null;
                document.getElementById('TransactionNum').value = null;
                document.getElementById('PaySlip').value = null;
                document.getElementById('DisclosureStatement').value = null;
        
                // Emit success toast
                toast.success('Submitted Successfully', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
        
            } else {
                console.error('Failed to upload PDF:', response.statusText);
                toast.error('Failed to Submit', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
        
    }

    const handlePay_Slip = (e) => {
        setSSSinfo({ ...thisInfo, Pay_Slip: e.target.files[0] });
    };

    const handleDisclosure_Statement = (e) => {
        setSSSinfo({ ...thisInfo, Disclosure_Statement: e.target.files[0] });
    };

    const handleLoanApplicationDateChange = (e) => {
        setSSSinfo({ ...thisInfo, Application_Date: e.target.value });
    };

    if (!employeeData) {
        return <div>Loading...</div>;
    }

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    };


    return (
        <div id="wrapper">
            <Navbar />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <TopNavbar />
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <h4 className="m-0 font-weight-bold text-primary header-name">SSS Loan</h4>
                        </div>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        {/* page content begin here */}
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-8 col-lg-7">
                                    <div className="card shadow mb-4">
                                        {/* Card Header - New Hire Upload */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Loan Details</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="tab-content">
                                                <div className="card-body loan-row">
                                                    <div className="form-group">
                                                        <label>Loan Application Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            id="loanApplicationDate"
                                                            name="loanApplicationDate"
                                                            max={getCurrentDate()}
                                                            value={thisInfo.Application_Date}
                                                            onChange={handleLoanApplicationDateChange}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="name">Transaction Number</label>
                                                        <input type="text" className="form-control" id="TransactionNum" name="name" onChange={(e) => setSSSinfo({ ...thisInfo, Transaction_Number: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Page content ends here */}
                        {/* page content begin here */}
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-8 col-lg-7">
                                    <div className="card shadow mb-4">
                                        {/* Card Header - New Hire Upload */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">1 Month Pay Slip</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="tab-content">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-left">
                                                        <input
                                                            type="file"
                                                            className="input-file"
                                                            aria-describedby="fileHelp"
                                                            onChange={handlePay_Slip}
                                                            id='PaySlip'
                                                        />
                                                        <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Page content ends here */}
                        {/* page content begin here */}
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-8 col-lg-7">
                                    <div className="card shadow mb-4">
                                        {/* Card Header - New Hire Upload */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Loan Disclosure Statement</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="tab-content">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-left">
                                                        <input type="file" className="input-file" aria-describedby="fileHelp" onChange={handleDisclosure_Statement} id='DisclosureStatement' />
                                                        <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Page content ends here */}
                        <button type="submit" className="btn btn-primary d-block mx-auto loan-btn">Submit</button>
                    </form>
                </div>
                <Footer />
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default SSSLoan;
