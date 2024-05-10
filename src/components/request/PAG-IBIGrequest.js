import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { variables } from '../../variables';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PAGIBIGrequest() {
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

    }

    return (
        <div id="wrapper">
            <Navbar />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <TopNavbar />
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <h4 className="m-0 font-weight-bold text-primary header-name">Certificate Request ( PAG-IBIG )</h4>
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
                                            <h6 className="m-0 font-weight-bold text-primary">Loan Disclosure Statement</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="tab-content">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-left">
                                                        <input type="file" className="input-file" aria-describedby="fileHelp" onChange={""} id='DisclosureStatement' accept=".pdf" />
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

export default PAGIBIGrequest;
