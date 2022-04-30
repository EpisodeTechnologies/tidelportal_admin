import React, { useState } from "react";
import "../Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/config";
import logo from '../img/brandlogo-4.png'


function Login() {
  const [UserEmail, setUserEmail] = useState("");
  const [Otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [EmailError, setEmailError] = useState("");
  const navigate = useNavigate();


  const setOtpDetailMail = () => { 
    setLoader(true) 
    axios.post(BASE_URL+"/sendOtp", {
        adminEmail: UserEmail,
      })
      .then((res) => {
        console.log(res.data.status);
        let data={adminEmail: UserEmail }
        setLoader(false)
        if (res.data.status === "Email sent") {
          localStorage.setItem("user_login",JSON.stringify(data));
          navigate('/otpverification')
        } else if (res.data.status === "Wrong Email") {
          setEmailError("Please enter correct Email address");
        } else {
          setEmailError("Server error");
        }
      });
  };

  return (
    <>
      <div className="logincard ">
        <div
          className="text-center login-logo-box"
          style={{ padding: "40px 0px" }}
        >
          <img
            className="login-logo"
            style={{ width: "200px" }}
            src={logo}
          />
        </div>

        <h2 id="title"> Log in</h2>

        <p className="or">
          <span style={{ color: "red" }}>{EmailError}</span>
        </p>
        <form>
          <div id="email-login">
            <label htmlFor="email">
              {" "}
              {/* <b>Email</b> */}
            </label>
            <input
              id="emailId"
              type="email"
              placeholder="Enter Your Email"
              name="EmailId"
              required
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          {/* <input  value='submit' /> */}
          <button className="cta-btn" type="button" onClick={() => setOtpDetailMail() }>
            
            { loader ? <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div> : 'Send OTP' }
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
