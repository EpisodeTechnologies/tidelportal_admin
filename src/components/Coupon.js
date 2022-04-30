import React,{useState} from "react";
import SideNav from "./SideNav";
import "./coupon.scss";
import { BASE_URL } from "../config/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Coupon() {
  const [couponcode, setcouponcode] = useState();
  const [phoneNumber, setphoneNumber] = useState();
  const [discountAmount, setdiscountAmount] = useState();
  const [adminDetail , setAdminDetail] =useState('')


  const handleChangecouponcodegenerate = (e) => {
    setAdminDetail(JSON.parse(localStorage.getItem('admin_login_details')))
    var ticketNumber = "";
    var user_otp;
  
    var digits = "0123456789";
    var alphabet ="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let OTP = "PBC";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    for (let i = 0; i < 2; i++) {
        OTP += alphabet[Math.floor(Math.random() * 10)];
        ticketNumber = OTP;
      }
    setcouponcode(ticketNumber);
  };
  const handleChangeSend = (e) => {
    const admin =  JSON.parse(localStorage.getItem('admin_login_details'))
    axios
    .post(BASE_URL + "/generateCoupon", {
        couponCode: couponcode,
        phone: parseInt(phoneNumber) ,
        amount: parseInt(discountAmount),
        admin:admin.admin_name
    })
    .then((res) => {
    
        console.log("coupon",res.data.message);
      if(res.status=="200"){
        setcouponcode('');
        setphoneNumber('');
        setdiscountAmount('');
      if (res.data.status=="200") {
        toast.success("Coupon Successfully Sent", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
      } 
    else {
      toast.error(res.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
}
 
})
  };
 
 

  return (
    <>
            <ToastContainer />
      <SideNav />
      <div className="main_body">
        <div className="Coupon-body">
          <div className="Coupon-countainer">
            <div className="row" >
              <form className="form_input_field" onSubmit={handleChangeSend}>
                <h1 className="Coupon-head">COUPON CODE</h1>
                <div className="coupon-form-head">
                 
                  <div
                    className="form-group input-group"
                    style={{ marginTop: "20px" }}
                  >
                    <label class="has-float-label" style={{ width: "100%" }}>
                      <input
                        class="form-control"
                        type="text"
                        placeholder=" Enter User Phone Number"
                        onChange={(e) => setphoneNumber(e.target.value)} value={phoneNumber} 
                        required
                       maxLength={10}
                      />
                      <span>User Phone Number</span>
                    </label>
                  </div>

                  <div
                    className="form-group input-group"
                    style={{ marginTop: "20px" }}
                  >
                    <label class="has-float-label" style={{ width: "100%" }}>
                      <input
                        class="form-control"
                        maxLength={2}
                        placeholder="Enter Discount Amount"
                        onChange={(e) => setdiscountAmount(e.target.value)} value={discountAmount} 
                        required
                        
                       
                      />
                      <span>Discount Amount</span>
                    </label>
                  </div>
                  <div style={{ position: "relative" }}>
                    <div
                      class="form-group input-group"
                      style={{ marginTop: "20px" }}
                    >
                      <label class="has-float-label" style={{ width: "70%",PointerEvent:'none' }}>    
                        <input
                          class="form-control"
                          type="text"
                          placeholder="Generate Auto coupen Code"
                          value={couponcode}
                          required
                          readOnly
                      
                        />
                        <span>Generate coupen Code</span>
                      </label>
                    </div>
                    <button type="button" className="Generate-btn" onClick={handleChangecouponcodegenerate}>Generate</button>
                  </div>
                </div>
                
                <div className="coupun-send">
                  <button className="coupun-send-code" type="submit" >Send Code</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Coupon;
