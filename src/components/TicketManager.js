import React, {useEffect, useState } from "react";
import SideNav from "./SideNav";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import QrReader from 'react-qr-scanner'
// import  { QrReader}  from 'react-qr-reader';

import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/config";
import { BsCheck2Circle } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";

function TicketManager() {
  const [bookingId, setBookingId] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [ticket, setTicket] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessagembl, setErrorMessagembl] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [qrResult, setQrResult] = useState();
  const [adminDetail , setAdminDetail] =useState('')

  const [showOTPModel, setShowOTPModel] = useState(false);
  const [showSuccessModel, setShowSuccessModel] = useState(false);
  const [showErrorModel, setShowErrorModel] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [ticketErrorMsg,setTicketErrorMsg] = useState("");
  const [redeemOtp, setRedeemOtp] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('admin_is_loggedin') && localStorage.getItem('admin_is_loggedin') == 'true'){
      if(localStorage.getItem('admin_login_details')){
        // if(localStorage.getItem('user_login_details') == true){
          setAdminDetail(JSON.parse(localStorage.getItem('admin_login_details')))
        // }
      }
    }
    else{
      navigate("/login");
    }
  }, []);

  const checkBookingId = () => {
    axios
      .get(BASE_URL + `/tickets/getBookingByBookingId/${bookingId}`,)
      .then((res) => {
        if (res.data.status == "200") {
          let ticket = res.data.data[0].booking_id;
          console.log(ticket);
          setShowModel(false);
          setErrorMessage("Server error");
          navigate("/redeemticket", { state: { id: ticket, searchBy: "ticketId" }});
        } else{
          setErrorMessage("Please enter valid Booking Id");
        }
      });
  };

  const checkBookingQR = (qrdata) => {
    axios
      .get(BASE_URL + `/tickets/getBookingByBookingId/${bookingId}`).then((res) => {
        if (res.data.status === "200") {
          setShowModel(false);
          console.log(qrdata)
          setRedeemOtp(qrdata.otp)
          setShowOTPModel(true)
          setQrResult(qrdata)
        }else {
          setErrorMessage("Please Scan valid QR");        
        }
      });
  };

  const checkMobileNumber = () => {
    console.log("check mobile");
    axios
      .get(BASE_URL + `/tickets/getAllBookingsByphone/${phoneNo}`).then((res) => {
        if (res.data.status == "200") {
          setTicket(res.data);
          let id = phoneNo
          console.log(id);
          navigate("/redeemticket", { state: { id: id, searchBy: "mblNo" } });
        } else if (res.data.status == "400") {
          setErrorMessagembl( res.data.message);
          console.log("wrong mbl");
        } else {
          setErrorMessagembl("Server error");
        }
        console.log(ticket);
      });
  };

  const handleCloseModel = () => setShowModel(false);
  const handleShowModel = () => setShowModel(true);


  const handleCloseOTPModel = () => setShowOTPModel(false);

  

  const handleCloseSuccessModel = () => {setShowSuccessModel(false);setShowErrorModel(false)};
  const handleShowSuccessModel = () => {setShowSuccessModel(true)};
  const handleShowErrorModel = () => {setShowErrorModel(true)};

  const handleQrScan = (data) => {
    
    if (data) {
      let qrData;
      try {
        qrData = Buffer.from(data.text, 'base64').toString()
        console.log("Scaned QR ", qrData)
        try {
          qrData = JSON.parse(qrData); 
          if (qrData.bookingId) {
            setBookingId(qrData.bookingId);
            checkBookingQR(qrData);
            setErrorMessage(" ");
          } else {
            setErrorMessage("Please Scan QR Corectly 1");
          } 
        } catch (error) {
          setErrorMessage("Please Scan QR Corectly 2");
        }
      } catch (error) { 
        console.log(error);
        setErrorMessage("Please Scan QR Corectly 3");
      }
    }
  };

  const handleQrError = (err) => {
    console.error(err);
  };

  const redeemTicket = () =>{
    axios
    .get(BASE_URL + `/tickets/redeemBookingTicket/${bookingId}/${redeemOtp}`)
    .then((res) => {
      handleCloseOTPModel();
      if (res.data.status == "200") {
        handleShowSuccessModel();
        setOtpErrorMsg("");
        setTicketErrorMsg('')
      } else{
        handleShowErrorModel();
        setTicketErrorMsg(res.data.message)
      } 
    });
  }

  return (
    <>
      <SideNav />
      <div className="main_body">
        <div className="row">
          <div
            className="col-sm-4 col-lg-4 px-5 py-5 p ticketmanager"
          >
            <h5 className="fw-bold text-light">Redeem</h5>
            <div className="row py-3 mt-5 admin">
              <div className="col-sm-9 col-lg-9">
                <h5 className="fw-normal text-light">hello,</h5>
                <h3 className="fw-normal text-light">{adminDetail.admin_name}</h3>
                <p
                  className="text-light"
                  style={{ fontWeight: "200", fontFamily: "system-ui" }}
                >
                  Lorem ipsum dolor sit amet consectetuer adipiscing elit
                </p>
              </div>
              <div className="col-sm-3 col-lg-3 d-flex align-items-center justify-content-center">
                <img
                  src="https://i.imgur.com/0LKZQYM.jpg"
                  className="rounded-circle float-sm-end"
                  width="80"
                />
              </div>
            </div>
            <div className="row py-2">
              <div className="col-sm-8 col-lg-8 py-2">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Booking ID Number"
                  onChange={(e) => setBookingId(e.target.value)}
                  style={{ outline: "none", boxShadow: "none" }}
                />
              </div>
              <div className="col-sm-4 col-lg-4 d-grid gap-2 py-2">
                <button
                  type="button"
                  class="btn btn-primary rounded-pill "
                  style={{ boxShadow: "none" }}
                  onClick={checkBookingId}
                >
                  Click
                </button>
              </div>
            </div>
            <p style={{ color: "red" }}>{errorMessage}</p>
            <div
              className="img my-4 p-3 rounded-3 row"
              onClick={handleShowModel}
              style={{
                backgroundImage:
                  'url("https://img.freepik.com/free-photo/biryani-rice-vegetable-biryani-indian-basmati-rice-curry-vegetables-spices-indian-kitchen_90380-572.jpg?size=626&ext=jpg")',
                backgroundPosition: "center",
              }}
            >
              <div className="col-sm-8 col-lg-8">
                <h3 className="fw-normal text-light">
                  Click here to <h2 className="fw-bold">Scan QR</h2>
                </h3>
              </div>
              <div className="col-sm-4 col-lg-4 d-grid gap-2">
                <i
                  className="fas fa-qrcode"
                  style={{ fontSize: "80px", color: "#fff" }}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div className="row redeem-form">
          <div
            className="col-sm-4  col-lg-4 px-4 py-4 "
           
          >
            <div class="mb-3 py-3">
              <label for="mobnum" class="form-label text-light">
                Enter Phone Number
              </label>
              <input
                type="text"
                className="form-control bg-transparent mt-2 "
                id="mobnum"
                placeholder=""
                onChange={(e) => setPhoneNo(e.target.value)}
                style={{
                  color: "#fff",
                  border: "0px",
                  borderBottom: "2px solid white",
                  outline: "none",
                  boxShadow: "none",
                  borderRadius: "0px",
                }}
              />
              <p style={{ color: "red" }}>{errorMessagembl}</p>
              <button
                type="button"
                class="btn btn-primary rounded-pill mt-3 px-4"
                style={{ boxShadow: "none" }}
                onClick={checkMobileNumber}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModel}
        onHide={handleCloseModel}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Make QR on Center
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <QrReader
            delay={1}
            onError={handleQrError}
            onScan={handleQrScan}
            style={{ width: "100%" }}
            resolution='1200'
          />
         
          <br />
          <p style={{ color: "red" }}>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModel}>Close</Button>
        </Modal.Footer>
      </Modal>


      <Modal
        size="md"
        id="showOTPModel"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showOTPModel}
        onHide={handleCloseOTPModel}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Enter OTP
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center text-center p-4">
          
            <input
              value={redeemOtp}
              type="text"
              className="text-center my-3"
              maxLength={4}
              minLength={4}
              onChange={(e) => setRedeemOtp(e.target.value)}
              style={{border: '2px solid orange',
                width: '140px',
                fontSize: '30px',
                letterSpacing: '10px',
                fontWeight: 'bold',
                borderRadius: '10px'}}
            />
          <Button className="px-3 my-3 rounded-pill" size="sm" onClick={redeemTicket}>Redeem</Button>
          {otpErrorMsg ? <div className="m-2" style={{color:"red"}}>{otpErrorMsg}</div> : <></>}
        </Modal.Body>
      </Modal>

      <Modal
        size="md"
        id="SuccessModel"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showSuccessModel}
        onHide={handleCloseSuccessModel}
      >
        <Modal.Body className="justify-content-center align-items-center text-center">
          <BsCheck2Circle style={{ color: "green", fontSize: "50px" }} />
          <br />
          <br />
          <div
            style={{
              color: "green",
              fontSize: "22px",
              verticalAlign: "middle",
            }}
          >
            Ticket Redeemed Successfully !
          </div>
          <Button className="btn-sm mt-5 mb-3 px-4 rounded-pill" onClick={handleCloseSuccessModel}>OK</Button>
        </Modal.Body>
      </Modal>
      <Modal
        size="md"
        id="ErrorModel"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showErrorModel}
        onHide={handleCloseSuccessModel}
      >
        <Modal.Body className="justify-content-center align-items-center text-center">
          <IoCloseCircleOutline style={{ color: "red", fontSize: "50px" }} />
          <br />
          <br />
          <div
            style={{
              color: "red",
              fontSize: "18px",
              verticalAlign: "middle",
            }}>Sorry<br/>
            {ticketErrorMsg}
          </div>
          <Button className="btn-sm mt-5 mb-3 px-4 rounded-pill" onClick={handleCloseSuccessModel}>OK</Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TicketManager;
