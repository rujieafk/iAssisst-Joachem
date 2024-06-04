import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { variables } from '../../variables';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SSSRequest() {

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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

  const [selected, setSelected] = useState("0");
  const [LinkUrl, setLinkUrl] = useState('');
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
    // handleUpdateLink();
  }, [employeeId]);

  const handleInputChange = async(e) => {
    setSelected(e.target.value);
    // if (e.target.value === '1') {
    //   const LinkHeader1 = "SSS SOA";
    //   const LinkHeader2 = "SSS VF";
      
    //   const formData = new FormData();
    //   formData.append('LinkHeader1', LinkHeader1);
    //   formData.append('LinkHeader2', LinkHeader2);

    //   try {
    //       const response = await fetch('/SetLink', {
    //           method: 'POST',
    //           body: formData,
    //       });

    //       // if (response.ok) {
    //       //     const jsonResponse = await response.json();
    //       //     console.log(jsonResponse.message);

    //       //     const url = jsonResponse.data;
    //       //     console.log('url',url);
    //       //     setLinkUrl(url);
              
    //       // }
    //   } catch (error) {
    //       console.error('Error uploading:', error);
    //   }
      
    // }
    
    
    

    // const { name, value } = e.target;
    // setEmployeeData({
    //   ...employeeData,
    //   [name]: value
    // });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValidFileType = (file) => {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      return allowedTypes.includes(file.type);
    };
  
    const formData = new FormData();
    formData.append("selected", selected);

    if (selected === '1') {
      if (thisInfo.StatementOfAccount && isValidFileType(thisInfo.StatementOfAccount)) {
          formData.append('StatementOfAccount', thisInfo.StatementOfAccount);
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
  
      if (thisInfo.VerificationRequestForm && isValidFileType(thisInfo.VerificationRequestForm)) {
          formData.append('VerificationRequestForm', thisInfo.VerificationRequestForm);
      } else {
          toast.error('Invalid VerificationRequestForm file type. Please upload a PDF, PNG, or JPEG file.', {
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
  } else if (selected === '2') {
      if (thisInfo.MonthlyContributions && isValidFileType(thisInfo.MonthlyContributions)) {
          formData.append('MonthlyContributions', thisInfo.MonthlyContributions);
      } else {
          toast.error('Invalid MonthlyContributions file type. Please upload a PDF, PNG, or JPEG file.', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
          return; 
      }
  
      if (thisInfo.VerificationRequestForm && isValidFileType(thisInfo.VerificationRequestForm)) {
          formData.append('VerificationRequestForm', thisInfo.VerificationRequestForm);
      } else {
          toast.error('Invalid VerificationRequestForm file type. Please upload a PDF, PNG, or JPEG file.', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
          return; 
        }
      } else if (selected === '3') {
          formData.append('SpecifyOtherRequest', specifyOtherRequest); // Assuming no file validation required for this field
      
          if (thisInfo.VerificationRequestForm && isValidFileType(thisInfo.VerificationRequestForm)) {
              formData.append('VerificationRequestForm', thisInfo.VerificationRequestForm);
          } else {
              toast.error('Invalid VerificationRequestForm file type. Please upload a PDF, PNG, or JPEG file.', {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
              });
            return; 
          }
      }

    try {
      const response = await fetch('/CertificationRequestSSS', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse.message);
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

        setEmployeeData({
          deliveryType: ''
        });

        // Clear file input fields
        document.getElementById('deliveryType').value = null;
        setSelected("0");
        document.getElementById('Application_Form').value = null;

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

  const handleUpdateLink = async () => {
    const LinkHeader = "SSS SOA";
    
    const formData = new FormData();
    formData.append('LinkHeader', LinkHeader);

    try {
        const response = await fetch('/GetLink', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse.message);

            const url = jsonResponse.data;
            console.log('url',url);
            setLinkUrl(url);
        }
    } catch (error) {
        console.error('Error uploading:', error);
    }
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
                                  <option value="3">Other information Update Request</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          {/* Vertical line */}
                          <div className="vertical-line"></div>
                          <div className="card-body">
                            <div className="d-flex justify-content-left ">
                              {selected === "0" && (
                                <div className="no-selected">
                                  <label >Select a type of request.</label>
                                </div>
                              )}
                              {selected === "1" && selected !== "0" && (
                                <div className="row justify-content-left content-holder">
                                  <div className="form-group">
                                    <label htmlFor="middleName">Unposted Loan Payment</label>
                                  </div>
                                  <div className="form-group">
                                    <label style={{ fontSize: '14px' }}>Upload Latest Statement of Account (Non-anonymous question) *</label>
                                    <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleStatementOFAccount} />
                                    {/* <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                      <a href={LinkUrl} target="_blank" rel="noopener noreferrer">How to download SSS SOA</a>
                                    </button> */}
                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                      <a href={LinkUrl} target="_blank" rel="noopener noreferrer">How to download SSS SOA</a>
                                    </button>
                                    <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" onClick={handleUpdateLink}>
                                      Update 
                                    </button>

                                  </div>

                                  <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />

                                  <div className="form-group">
                                    <label style={{ fontSize: '14px' }}>Upload "Request/Verification Form" (Non-anonymous question) *</label>
                                    <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleVerificationRequestForm} />
                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                      <a href="https://www.sss.gov.ph/sss/DownloadContent?fileName=cov-01205-052015.pdf" download target="_blank" rel="noopener noreferrer">View Form</a>
                                    </button>
                                    <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" onClick={handleShowModal}>
                                        Update
                                    </button>
                                  </div>
                                </div>
                              )}

                              {selected === '2' && selected !== '0' && selected !== '1' && (
                                <div className="row justify-content-left content-holder">
                                  <div className="form-group">
                                    <label htmlFor="middleName">Unposted Contribution</label>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="middleName">Upload Latest Monthly Contributions (Non-anonymous question) *</label>
                                    <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleMonthlyContributions} />
                                  </div>

                                  <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />

                                  <div className="form-group">
                                    <label style={{ fontSize: '14px' }}>Upload "Request/Verification Form" (Non-anonymous question) *</label>
                                    <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleVerificationRequestForm} />
                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                      <a href="https://www.sss.gov.ph/sss/DownloadContent?fileName=cov-01205-052015.pdf" download target="_blank" rel="noopener noreferrer">View Form</a>
                                    </button>
                                    <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" onClick={handleShowModal}>
                                        Update
                                    </button>
                                  </div>
                                </div>
                              )}

                              {selected === '3' && selected !== '0' && selected !== '1' && selected !== '2' && (
                                <div className="row justify-content-left content-holder">
                                  <div className="form-group">
                                    <label htmlFor="middleName">Other Information Update Request</label>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="middleName">Specify Other Request *</label>
                                    <input id='DeathCert' type="text" className="form-control-file" aria-describedby="fileHelp" onChange={handleOtherRequestChange} value={specifyOtherRequest} placeholder='Type here...' />
                                  </div>

                                  <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />

                                  <div className="form-group">
                                    <label style={{ fontSize: '14px' }}>Upload "Request/Verification Form" (Non-anonymous question) *</label>
                                    <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleVerificationRequestForm} />
                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                      <a href="https://www.sss.gov.ph/sss/DownloadContent?fileName=cov-01205-052015.pdf" download target="_blank" rel="noopener noreferrer">View Form</a>
                                    </button>
                                    <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" onClick={handleShowModal}>
                                        Update
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
                {/* Page content ends here */}
                <button type="submit" className="btn btn-primary d-block mx-auto loan-btn">Submit</button>
              </div>
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header >
          <Modal.Title>Update Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Your modal content here */}
          <p></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {/* Add any additional buttons or actions here */}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SSSRequest;
