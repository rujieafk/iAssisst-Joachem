import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { variables } from '../../variables';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SicknessNotification() {

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

    const [thisInfo, setThisInfo] = useState({
        SicknessNotificationForm: "",
        PlaceOfConfinement: "",
        MedicalCertificate: "",
        SupportingDocuments: "",
        ECSupportingDocuments: ""
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
        const formData = new FormData();

        const isValidFileType = (file) => {
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
            return allowedTypes.includes(file.type);
        };

        if (thisInfo.SicknessNotificationForm && isValidFileType(thisInfo.SicknessNotificationForm)) {
            formData.append("SicknessNotificationForm", thisInfo.SicknessNotificationForm);
        } else {
            toast.error('Invalid StatementOfAccount file type. Please upload a PDF, PNG, or JPEG file.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return; // Stop further execution
        }
        if (thisInfo.MedicalCertificate && isValidFileType(thisInfo.MedicalCertificate)) {
            formData.append("MedicalCertificate", thisInfo.MedicalCertificate);
        } else {
            toast.error('Invalid StatementOfAccount file type. Please upload a PDF, PNG, or JPEG file.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return; // Stop further execution
        }
        if (thisInfo.SupportingDocuments && isValidFileType(thisInfo.SupportingDocuments)) {
            formData.append("SupportingDocuments", thisInfo.SupportingDocuments);
        } else {
            toast.error('Invalid StatementOfAccount file type. Please upload a PDF, PNG, or JPEG file.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return; // Stop further execution
        }
        if (thisInfo.ECSupportingDocuments && isValidFileType(thisInfo.ECSupportingDocuments)) {
            formData.append("ECSupportingDocuments", thisInfo.ECSupportingDocuments);
        } else {
            toast.error('Invalid StatementOfAccount file type. Please upload a PDF, PNG, or JPEG file.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return; // Stop further execution
        }
    
        let POCvalue = "";
        if(thisInfo.PlaceOfConfinement === '1'){
            POCvalue = "Home Confinement";
        }else{
            POCvalue = "Hospital Confinement";
        }
        
        try {
            formData.append("PlaceOfConfinement", POCvalue);

            const response = await fetch('/SicknessNotification', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse.message);
    
                setThisInfo({
                    SicknessNotificationForm: '',
                    PlaceOfConfinement: '',
                    MedicalCertificate: '',
                    SupportingDocuments: '',
                    ECSupportingDocuments: ''
                });
    
                // Clear file input fields
                document.getElementById('SicknessNotificationForm').value = null;
                document.getElementById('PlaceOfConfinement').checked = null;
                document.getElementById('MedicalCertificate').value = null;
                document.getElementById('SupportingDocuments').value = null;
                document.getElementById('ECSupportingDocuments').value = null;
    
                // Emit success toast
                toast.success('Thank you! Your request has been submitted.', {
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
                console.error('Failed to submit request:', response.statusText);
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
            console.error('Error uploading:', error);
        }
    }
    
    const handleSicknessNotificationForm = (e) => {
        setThisInfo({ ...thisInfo, SicknessNotificationForm: e.target.files[0] });
    };
    const handlePlaceOfConfinement = (e) => {
        setThisInfo({ ...thisInfo, PlaceOfConfinement: e.target.value });
    };
    const handleMedicalCertificate = (e) => {
        setThisInfo({ ...thisInfo, MedicalCertificate: e.target.files[0] });
    };
    const handleSupportingDocuments = (e) => {
        setThisInfo({ ...thisInfo, SupportingDocuments: e.target.files[0] });
    };
    const handleECSupportingDocuments = (e) => {
        setThisInfo({ ...thisInfo, ECSupportingDocuments: e.target.files[0] });
    };

    if (!employeeData) {
        return <div>Loading...</div>;
    }

    return (
        <div id="wrapper">
            <Navbar />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <TopNavbar />
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <h4 className="m-0 font-weight-bold text-primary header-name">SSS Sickness Notication</h4>
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
                                            <h6 className="m-0 font-weight-bold text-primary">SSS Sickness Notification Form (Non-anonymous question) *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="">
                                                <div className="">
                                                    <div className="">
                                                        <label> Upload completely filled-out SSS Sickness Notification Form or Medical Certificate with Diagnosis and indicated number of days or period covered for the SSS Sickness application. </label>
                                                    </div>
                                                    <br/>
                                                    <input id='SicknessNotificationForm' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleSicknessNotificationForm} />
                                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                                        Link to download Form: <a href="https://www.sss.gov.ph/sss/DownloadContent?fileName=SIC_01252.pdf" target="_blank" rel="noopener noreferrer">SSS Notification Form</a>
                                                    </button>
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
                                            <h6 className="m-0 font-weight-bold text-primary">Place of Confinement *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="PlaceOfConfinement"  
                                                        id="PlaceOfConfinement"
                                                        value="1"
                                                        checked={thisInfo.PlaceOfConfinement === '1'}  // Compare with '1'
                                                        onChange={handlePlaceOfConfinement}
                                                    />
                                                    <label className="form-check-label" htmlFor="homeConfinement">
                                                        Home Confinement (Notification on the first day of confinement)
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="PlaceOfConfinement"  
                                                        id="PlaceOfConfinement"
                                                        value="2"
                                                        checked={thisInfo.PlaceOfConfinement === '2'}  // Compare with '2'
                                                        onChange={handlePlaceOfConfinement}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Hospital Confinement (Notification after discharge)
                                                    </label>
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
                                            <h6 className="m-0 font-weight-bold text-primary">Medical Certificate (Non-anonymous question) *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="">
                                                    <div className="">
                                                        <label>
                                                            SS Medical Certificate (MMD 102) Form or attending physician's personal Medical Certificate with the following information:
                                                            <br/>
                                                            Name of attending Physician
                                                            <br/>
                                                            -PRC Number (Not required if Physician is practicing abroad) <br/>
                                                            -Clinic Address, and/or <br/>
                                                            -Contact information (such as but not limited to landline/mobile number) <br/>
                                                            -Diagnosis <br/>
                                                            -Recommended number of days of convalescence including recuperation  <br/>
                                                        </label>
                                                    </div>
                                                    <br/>
                                                    <input id='MedicalCertificate' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleMedicalCertificate} />
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
                                            <h6 className="m-0 font-weight-bold text-primary">Supporting Documents (Non-anonymous question)</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="">
                                                    <div className="">
                                                        <label>
                                                            Other Medical Documents
                                                            <br/>
                                                            A certified true copy of ANY 1 of the following, whichever is applicable: <br/>
                                                            -Hospital Abstract <br/>
                                                            -Discharge Summary <br/>
                                                            -Record of Operation <br/>
                                                            -Histopathology Report <br/>
                                                            -Chest X-Ray Result <br/>
                                                            -X-ray result of the affected part (For Fracture) <br/>
                                                            -ECG/2D Echo Result <br/>
                                                            -MRI/CT Scan Result <br/>
                                                            -Laboratory Result <br/>
                                                        </label>
                                                    </div>
                                                    <br/>
                                                    <input id='SupportingDocuments' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleSupportingDocuments} />
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
                                            <h6 className="m-0 font-weight-bold text-primary">EC Supporting Documents (Non-anonymous question)</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="">
                                                    <div className="">
                                                        <label>
                                                        -Accident/Sickness Report (Form B-309) <br/>
                                                        -EC Logbook <br/>
                                                        -Job Description <br/>
                                                        -Police Report (if applicable) <br/>
                                                        Certificate from Employer indicating the following: <br/>
                                                        &nbsp;&nbsp;-Last day of work before the COVID infection <br/>
                                                        &nbsp;&nbsp;-Inclusive dates of leave of absence or quarantine leave <br/>
                                                        </label>
                                                    </div>
                                                    <br/>
                                                    <input id='ECSupportingDocuments' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleECSupportingDocuments} />
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

export default SicknessNotification;