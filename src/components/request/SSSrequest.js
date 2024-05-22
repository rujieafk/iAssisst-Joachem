import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { variables } from '../../variables';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 function SSSRequest() {
   
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
      EmailAddress: '',
      deliveryType: ''
    });
    
    const [selected, setSelected] = useState("0")
    const [specifyOtherRequest, setSpecifyOtherRequest] = useState("");
    const [thisInfo, setThisInfo] = useState({
      StatementOfAccount: '',
      VerificationRequestForm: '',
      MonthlyContributions: '',
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
  
    const handleInputChange = (e) => {
      
      setSelected(e.target.value);

      const { name, value } = e.target;
      setEmployeeData({
        ...employeeData,
        [name]: value
      });
    }; 
    const handleFormSubmit = async (e) => {
      e.preventDefault();

      // if(selected === '1'){
      //   if (!thisInfo.StatementOfAccount || !thisInfo.VerificationRequestForm) {
      //     toast.warn('Please fill in all required fields', {
      //         position: "bottom-right",
      //         autoClose: 5000,
      //         hideProgressBar: false,
      //         closeOnClick: true,
      //         pauseOnHover: true,
      //         draggable: true,
      //         progress: undefined,
      //         theme: "light",
      //       });
      //     return; // Stop form submission
      //   }
      // } 
      // else if(selected === '2'){
      //   if (!thisInfo.ProofPregnancy || !thisInfo.HospitalRec) {
      //     toast.warn('Please fill in all required fields', {
      //         position: "bottom-right",
      //         autoClose: 5000,
      //         hideProgressBar: false,
      //         closeOnClick: true,
      //         pauseOnHover: true,
      //         draggable: true,
      //         progress: undefined,
      //         theme: "light",
      //       });
      //     return; // Stop form submission
      //   }
      // } else if(selected === '3'){
      //   if (!thisInfo.DeathCert) {
      //     toast.warn('Please fill in all required fields', {
      //         position: "bottom-right",
      //         autoClose: 5000,
      //         hideProgressBar: false,
      //         closeOnClick: true,
      //         pauseOnHover: true,
      //         draggable: true,
      //         progress: undefined,
      //         theme: "light",
      //       });
      //     return; // Stop form submission
      //   }
      // }else{
      //   toast.warn('Please fill in all required fields', {
      //     position: "bottom-right",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light",
      //   });
      //   return; 
      // }
      

      const formData = new FormData();
      formData.append("selected", selected); // Assuming selected is define
  
      // Append other files based on selected option
      if(selected === '1'){
          formData.append('StatementOfAccount', thisInfo.StatementOfAccount);
          formData.append('VerificationRequestForm', thisInfo.VerificationRequestForm);
      } 
      else if(selected === '2'){
          formData.append('MonthlyContributions', thisInfo.MonthlyContributions);
          formData.append('VerificationRequestForm', thisInfo.VerificationRequestForm);
        } 
      else if(selected === '3'){
          formData.append('SpecifyOtherRequest', specifyOtherRequest);
          formData.append('VerificationRequestForm', thisInfo.VerificationRequestForm);
      }

      try {
        const response = await fetch('/CertificationRequestSSS', {
            method: 'POST',
            body: formData,
        });
    
        if (response.ok) {
            const jsonResponse = await response.json();
    
            console.log(jsonResponse.message);
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
          
            setEmployeeData({
              deliveryType: ''
            });
            
            // Clear file input fields
            document.getElementById('deliveryType').value = null;
            setSelected("0");
            document.getElementById('Application_Form').value = null;
    
           
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
    };
    const handleStatementOFAccount = (e) => {
      setThisInfo({ ...thisInfo, StatementOfAccount: e.target.files[0] });
    };
    const handleVerificationRequestForm = (e) => {
      setThisInfo({ ...thisInfo, VerificationRequestForm: e.target.files[0] });
    };
    const handleMonthlyContributions = (e) => {
      setThisInfo({ ...thisInfo, MonthlyContributions: e.target.files[0] });
    };
    const handleOtherRequestChange = (event) => {
      setSpecifyOtherRequest(event.target.value);
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
                      <h4 className="m-0 font-weight-bold text-primary header-name">Certification Request ( SSS )</h4>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                      
                      {/* page content begin here */}
                      <div className="container-fluid">
                        <div className="row justify-content-center">
                          <div className="col-xl-8 col-lg-7">
                            <div className="card shadow mb-4">
                              
                              {/* Card Body - New Hire Options */}
                              <div className="card-body">
                                <div className="tab-content card-tab">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-left">
                                      <div className="form-group">
                                        <label htmlFor="deliveryType">SSS Request for: </label>
                                        <select className="form-control" id="deliveryType" name="deliveryType" value={employeeData.deliveryType} onChange={handleInputChange}>
                                          <option value="0" >Select Type</option>
                                          <option value="1">Unposted Loan Payment</option>
                                          <option value="2">Unposted Contribution</option>
                                          <option value="3">Other infromation Update Request </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Vertical line */}
                                  <div className="vertical-line"></div>
                                    <div className="card-body">
                                      <div className="d-flex justify-content-left ">
                                        { selected === "0" && (
                                          <div className="no-selected">
                                            <label >Select a type of request.</label>  
                                          </div>
                                        )}
                                        { selected === "1" && selected  !== "0" && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                            <label htmlFor="middleName">Unposted Loan Payment</label>  
                                          </div>
                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Upload Latest Statement of Account (Non-anonymous question) *</label>
                                            <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleStatementOFAccount}/>
                                            <button style={{ fontSize: '12px', border: 'none', background: 'none'}}>
                                                <a href="https://innodata.sharepoint.com/:w:/s/HR-TOOLS/EeIZSXnDEa1PgSYB9UNHSSIBs1YOqm4xZPPGESXLB-EOJA?e=SD9ISX" target="_blank" rel="noopener noreferrer">How to download SSS SOA</a>
                                            </button>
                                          </div>

                                          <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />

                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Upload "Request/Verification Form" (Non-anonymous question) *</label> 
                                            <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleVerificationRequestForm}/>
                                            <button style={{ fontSize: '12px', border: 'none', background: 'none'}}>
                                                <a href="https://www.sss.gov.ph/sss/DownloadContent?fileName=cov-01205-052015.pdf" download target="_blank" rel="noopener noreferrer">View Form</a>
                                            </button>
                                          </div>
                                        </div> 
                                        )}
                                         
                                        { selected === '2' && selected !== '0' && selected !== '1' && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                          <label htmlFor="middleName">Unposted Contribution</label> 
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="middleName">Upload Latest Monthly Contributions (Non-anonymous question) *</label> 
                                            <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleMonthlyContributions}/>
                                          </div>

                                          <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />
                                          
                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Upload "Request/Verification Form" (Non-anonymous question) *</label> 
                                            <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleVerificationRequestForm}/>
                                            <button style={{ fontSize: '12px', border: 'none', background: 'none'}}>
                                                <a href="https://www.sss.gov.ph/sss/DownloadContent?fileName=cov-01205-052015.pdf" download target="_blank" rel="noopener noreferrer">View Form</a>
                                            </button>
                                          </div>
                                        </div>  
                                        )}

                                        { selected === '3' && selected !== '0' && selected !== '1' && selected !== '2' && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                          <label htmlFor="middleName">Other Information Update Request</label> 
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="middleName">Specify Other Request *</label> 
                                            <input id='DeathCert' type="text" className="form-control-file" aria-describedby="fileHelp" onChange={handleOtherRequestChange} value={specifyOtherRequest} placeholder='Type here...'/>
                                          </div>

                                          <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />
                                          
                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Upload "Request/Verification Form" (Non-anonymous question) *</label> 
                                            <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleVerificationRequestForm}/>
                                            <button style={{ fontSize: '12px', border: 'none', background: 'none'}}>
                                                <a href="https://www.sss.gov.ph/sss/DownloadContent?fileName=cov-01205-052015.pdf" download target="_blank" rel="noopener noreferrer">View Form</a>
                                            </button>
                                          </div>
                                        </div>  
                                        )}
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

export default SSSRequest;

