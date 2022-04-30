import React,{ useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../config/config';
import logo from '../img/brandlogo-4.png'

function VerifyOtp() {
    const [UserEmail, setUserEmail] = useState("");
    // const [UserOtp,setUserOtp] = useState("");
    const [otp, setOtp] = useState("");
    const [EmailError, setEmailError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        var localvar = JSON.parse(localStorage.getItem("user_login"));
        console.log(localvar);
        setUserEmail(localvar.adminEmail);
        // setUserOtp(localvar.userotp);
      }, []);   

    const verifyOtp = () => {
        if(otp != ''){
            axios.post(BASE_URL+"/optVerify", {
              adminEmail: UserEmail,
              otp : otp
            }).then((res)=>{
                console.log(res.data)
                if (res.data.status === 'Otp Valid') {
                    localStorage.setItem("admin_login_details",JSON.stringify(res.data.result));
                    localStorage.setItem("admin_is_loggedin",true)
                    localStorage.removeItem("user_login");
                    navigate('/')
                  } else {
                    setEmailError("Please Correct OTP")
                  }
            })
        }
        else{
            setEmailError("Please Correct OTP")
        }
    }

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
  
          <h2 id="title" className=''>Log In</h2>
          <p className="or">
            <span style={{ color: "red" }}>{EmailError}</span>
          </p>
          <form>
            <div id="email-login">
              <label htmlFor="emailId">
                {" "}
                {/* <b>OTP</b> */}
              </label>
              <input
                id="emailId"
                type='text' maxLength='4'
                placeholder="Enter Your OTP"
                name="Otp"
                onChange={(e)=>setOtp(e.target.value)}
                required
              />
            </div>
            {/* <input  value='submit' /> */}
            <button className="cta-btn" type='button' onClick={() => verifyOtp() }>
             Verify
            </button>
          </form>
          <p className="or">
            <span style={{ color: "#5c76f7" }} onClick={()=> navigate('/login')}>Click here <br/>to Login as Different E-mail</span>
          </p>
        </div>
      </>
    )
}

export default VerifyOtp
