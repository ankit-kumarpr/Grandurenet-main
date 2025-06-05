import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import './login.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import Slider1 from '../images/slider-1.jpg';
import Slider2 from '../images/slider-2.jpg';
import Slider3 from '../images/slider-3.jpg';

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Send OTP API
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire('Error', 'Please enter your email address', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://grandurenet-main.onrender.com/api/auth/send-otp`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
      const requestBody = { email }

      const response = await axios.post(url, requestBody, { headers });
      console.log("Response of send otp api", response.data);
      
      if (response.data.error === false) {
        Swal.fire('Success', 'OTP sent to your email!', 'success');
        setShowOtpInput(true);
      } else {
        Swal.fire('Error', response.data.message || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  // Verify OTP API
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      Swal.fire('Error', 'Please enter the OTP', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://grandurenet-main.onrender.com/api/auth/verify-otp`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
      const requestBody = { email, otp }

      const response = await axios.post(url, requestBody, { headers });
      console.log("Response of Verify OTP", response.data);
      
      if (response.data.error == false) {
        const { accessToken, user } = response.data.data;
        console.log("user",user.role);
        // Store token and role in session storage
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('userRole', user.role);
        
        Swal.fire('Success', 'Logged in successfully!', 'success');
        
        // Redirect based on role
        switch(user.role) {
          case 'SuperAdmin':
            navigate('/super-admin-dashboard');
            break;
          case 'Admin':
            navigate('/admin-dashboard');
            break;
          case 'User':
            navigate('/user-dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        Swal.fire('Error', response.data.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="row g-0 main-wrapper">
          <div className="col-lg-6 right-section">
            <div className="form-container">
              <h1 className="get-started-title">Get Started</h1>
              <p className="subtitle">
                {showOtpInput 
                  ? "Enter the OTP sent to your email" 
                  : "Enter your email address to receive an OTP and login"}
              </p>
              
              <form onSubmit={showOtpInput ? handleVerifyOTP : handleSendOTP}>
                {!showOtpInput ? (
                  <div className="input-group d-flex">
                    <div className="country-code">
                      <i className="fas fa-envelope" style={{color:"#653db8"}}></i>
                    </div>
                    <input 
                      type="email" 
                      className="email-input" 
                      placeholder="Enter email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                ) : (
                  <div className="input-group d-flex">
                    <div className="country-code">
                      <i className="fas fa-key"></i>
                    </div>
                    <input 
                      type="text" 
                      className="email-input" 
                      placeholder="Enter OTP" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required 
                    />
                  </div>
                )}
                
                <div className="terms-container">
                  <div className="terms-checkbox">
                    <i className="fas fa-check" style={{color: "white", fontSize: "12px"}}></i>
                  </div>
                  <div className="terms-text">
                    Please accept our <a href="#" className="terms-link">Terms & Conditions</a>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="send-otp-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : showOtpInput ? (
                    "Login"
                  ) : (
                    "Send OTP"
                  )}
                </button>
                
                {showOtpInput && (
                  <button 
                    type="button" 
                    className="btn btn-link mt-2"
                    onClick={() => {
                      setShowOtpInput(false);
                      setOtp("");
                    }}
                  >
                    Back to email
                  </button>
                )}
              </form>
              
              <div className="features-section">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-university"></i>
                  </div>
                  <div className="feature-text">Expert-Curated
Learning Paths</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <div className="feature-text">Interactive
Virtual Classrooms</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-filter"></i>
                  </div>
                  <div className="feature-text">Real-Time
Progress Tracking</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 left-section">
            <div className="carousel-container">
              <div id="imageCarousel" className="carousel slide h-100" data-bs-ride="carousel" data-bs-interval="4000">
                <div className="carousel-inner h-100">
                  <div className="carousel-item active h-100">
                    <img src={Slider1} 
                         alt="Financial Growth Illustration" className="h-100 w-100" />
                  </div>
                  <div className="carousel-item h-100">
                    <img src={Slider2} 
                         alt="Digital Investment Platform" className="h-100 w-100" />
                  </div>
                  <div className="carousel-item h-100">
                    <img src={Slider1} 
                         alt="Wealth Management" className="h-100 w-100" />
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-overlay"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;
