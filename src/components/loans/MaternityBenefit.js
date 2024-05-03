import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { variables } from '../../variables';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 function MaternityBenefit() {
   
    const { employeeId } = useParams();
    const [selected, setSelected] = useState("0")
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

    const [thisInfo, setThisInfo] = useState({
      Application_Form: '',
      paySlipFiles: '',
      Valid_ID: ''
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
      console.log(e.target.value);
      setSelected(e.target.value);

      const { name, value } = e.target;
      setEmployeeData({
        ...employeeData,
        [name]: value
      });
    }; 
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      
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
                      <h4 className="m-0 font-weight-bold text-primary header-name">Maternity Benefit</h4>
                    </div>
                    <form onSubmit={handleFormSubmit}>

                      {/* page content begin here */}
                      <div className="container-fluid">
                        <div className="row justify-content-center">
                          <div className="col-xl-8 col-lg-7">
                            <div className="card shadow mb-4">
                              {/* Card Header - New Hire Upload */}
                              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">SSS Maternity Reimbursement Application Form</h6>
                              </div>
                              {/* Card Body - New Hire Options */}
                              <div className="card-body">
                                <div className="tab-content">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-left">
                                      <input type="file" className="input-file" aria-describedby="fileHelp"/>
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
                                <h6 className="m-0 font-weight-bold text-primary">Delivery</h6>
                              </div>
                              {/* Card Body - New Hire Options */}
                              <div className="card-body">
                                <div className="tab-content card-tab">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-left">
                                      <div className="form-group">
                                        <label htmlFor="deliveryType">Type of Delivery</label>
                                        <select className="form-control" id="deliveryType" name="deliveryType" value={employeeData.deliveryType} onChange={handleInputChange}>
                                          <option value="0">Select Type</option>
                                          <option value="1">Live Child Birth</option>
                                          <option value="2">Miscarriage/ Emergency Termination of Pregnancy/ Ectopic Pregnancy</option>
                                          <option value="3">Still Birth/ Fetal Death</option>
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
                                            <label >Select a type of delivery</label>  
                                          </div>
                                        )}
                                        { selected === "1" && selected  !== "0" && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                            <label htmlFor="middleName">Live Childbirth</label>  
                                          </div>
                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Proof of Child's Birth (Live Birth Certificate)</label>
                                            <input type="file" className="form-control-file" aria-describedby="fileHelp"/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                          </div>

                                          <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />

                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Solo Parent ID or Certificate of Eligibility (Solo Parent only)</label> 
                                            <input type="file" className="form-control-file" aria-describedby="fileHelp"/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                          </div>

                                          <label style={{ fontSize: '10px' }}>Note: Documents issued in a foreign country shall be submitted with English Translation, if applicable</label>
                                        </div> 
                                        )}
                                         
                                        { selected === '2' && selected !== '0' && selected !== '1' && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                          <label htmlFor="middleName">Miscarriage/ Emergency Termination of Pregnancy/ Ectopic Pregnancy</label> 
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="middleName">Proof of Pregnancy</label> 
                                            <input type="file" className="form-control-file" aria-describedby="fileHelp"/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                          </div>

                                          <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />
                                          
                                          <div className="form-group">
                                            <label htmlFor="middleName">Proof of Termination of Pregnancy/ Hospital Record</label> 
                                            <input type="file" className="form-control-file" aria-describedby="fileHelp"/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                          </div>
                                        </div>  
                                        )}

                                        { selected === '3' && selected !== '0' && selected !== '1' && selected !== '2' && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                          <label htmlFor="middleName">Still Birth/Fetal Death</label> 
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="middleName">Fetal Certificate of Death/ Hospital/ Medical Records</label> 
                                            <input type="file" className="form-control-file" aria-describedby="fileHelp"/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
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
      </div>
  );
}

export default MaternityBenefit;

