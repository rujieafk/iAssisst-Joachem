import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { variables } from '../../variables';

 function PagIbigVirtualAccount() {
   
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
      Screenshot_VirtualAcc: '',
      paySlipFiles: '',
      GrossIncome: ''
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
      const { name, value } = e.target;
      setEmployeeData({
        ...employeeData,
        [name]: value
      });
    };
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      formData.append('Screenshot_Virtual', thisInfo.Screenshot_VirtualAcc);
      formData.append('paySlip', thisInfo.paySlip);
      formData.append('GrossIncome', thisInfo.GrossIncome);

      try {
        const response = await fetch('/VirtualAcc_upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(formData);
          console.log(jsonResponse.message);
  
        } else {
          console.error('Failed to upload PDF:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading PDF:', error);
      }
    };

    const handleScreenshot_Virtual = (e) => {
      setThisInfo({ ...thisInfo, Screenshot_VirtualAcc: e.target.files[0] });
    };
    const handlePay_Slip = (e) => {
      setThisInfo({ ...thisInfo, paySlip: e.target.files[0] });
    };
    const handleGrossIncome = (e) => {
      setThisInfo({ ...thisInfo, GrossIncome: e.target.files[0] });
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
                      <h4 className="m-0 font-weight-bold text-primary header-name">Pag-Ibig Virtual Account</h4>
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
                              <h6 className="m-0 font-weight-bold text-primary">Screenshot of Filed Loan via Virtual Account</h6>
                            </div>
                            {/* Card Body - New Hire Options */}
                            <div className="card-body">
                              <div className="tab-content">
                                <div className="card-body">
                                  <div className="d-flex justify-content-left">
                                    <input type="file" className="input-file" aria-describedby="fileHelp" onChange={handleScreenshot_Virtual}/>
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
                              <h6 className="m-0 font-weight-bold text-primary">1 Month Payslip</h6>
                            </div>
                            {/* Card Body - New Hire Options */}
                            <div className="card-body">
                              <div className="tab-content">
                                <div className="card-body">
                                  <div className="d-flex justify-content-left">
                                    <input type="file" className="input-file" aria-describedby="fileHelp" onChange={handlePay_Slip}/>
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
                              <h6 className="m-0 font-weight-bold text-primary">1 Month Gross Income</h6>
                            </div>
                            {/* Card Body - New Hire Options */}
                            <div className="card-body">
                              <div className="tab-content">
                                <div className="card-body">
                                  <div className="d-flex justify-content-left">
                                    <input type="file" className="input-file" aria-describedby="fileHelp" onChange={handleGrossIncome}/>
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
      </div>
  );
}

export default PagIbigVirtualAccount;

