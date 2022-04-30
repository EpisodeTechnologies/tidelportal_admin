import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import SideNav from "./SideNav";
import "./Dashboard.css";
import { BASE_URL } from "../config/config";

import QRCode from "qrcode";
import axios from "axios";
import { BiFoodTag } from "react-icons/bi";
import { BsCheck2Circle,BsCaretUpSquare } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";
import redeemed from '../img/redeemed.png'
import expired from '../img/expired.png'


// IoCloseCircleOutline
function RedeemTicket() {
  const { state } = useLocation();
  const { id, searchBy } = state;

  const [tickets, setTickets] = useState([]);
  const [ticketsData,setTicketsData ] = useState([]);
  const [showTickets, setShowTickets] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showSuccessModel, setShowSuccessModel] = useState(false);
  const [showErrorModel, setShowErrorModel] = useState(false);
  
  
  const [redeemId, setRedeemId] = useState("");
  const [redeemOtp, setRedeemOtp] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [ticketErrorMsg,setTicketErrorMsg] = useState("");

  const [foodItems,setFoodItems] = useState("");

  const [activeFilter , setActiveFilter] = useState("All")

  useEffect(() => {
    axios.get(BASE_URL + "/food_items").then((res)=>{
      if(res.status ==200){
        setFoodItems(res.data)
      }
    })

    if (searchBy == "ticketId") {
      axios
        .get(BASE_URL + `/tickets/getBookingByBookingId/${id}`)
        .then((res) => {
          if (res.data.status == "200") {
            setShowTickets(true);
            setTickets(res.data.data);
            setTicketsData(res.data.data)
            console.log(res.data.data)
          } else {
            setTickets([]);
            setTicketsData([])
            setShowTickets(false);
          }
        });
    } else if (searchBy == "mblNo") {
      axios
        .get(BASE_URL + `/tickets/getAllBookingsByphone/${id}`)
        .then((res) => {
          if (res.data.status == "200") {
            setTickets(res.data.data);
            setTicketsData(res.data.data)
            setShowTickets(true);
          } else {
            setTickets([]);
            setTicketsData([])
            setShowTickets(false);
          }
        });
    } else if (searchBy == "byQR") {
      // redeemTicketWithQR(id);
      axios
        .post(BASE_URL + "/findTicketByBookingId", {
          bookingId: id,
        })
        .then((res) => {
          if (res.data.status == "valid") {
            setShowTickets(true);
            setTickets(res.data.result);
            setTicketsData(res.data.result);
          } else {
            setTickets([]);
            setTicketsData([])
            setShowTickets(false);
          }
        });
    }
  }, [refreshKey]);

  const handleCloseModel = () => {
    setShowModel(false);
    setOtpErrorMsg("");
  };
  const handleShowModel = () => setShowModel(true);

  const handleCloseSuccessModel = () => {setShowSuccessModel(false);setShowErrorModel(false)};
  const handleShowSuccessModel = () => {setShowSuccessModel(true)};
  const handleShowErrorModel = () => {setShowErrorModel(true)};

  const redeemTicketHandler = (e, ticketNo) => {
    setRedeemId(ticketNo);
    handleShowModel();
  };

  const redeemTicket = () => {
    if (redeemId && redeemOtp) {
      axios
        .get(BASE_URL + `/tickets/redeemBookingTicket/${redeemId}/${redeemOtp}`)
        .then((res) => {
          if (res.data.status == "200"){
            handleCloseModel();
            handleShowSuccessModel();
            setOtpErrorMsg("");
            setRefreshKey((oldKey) => oldKey + 1);
          } else {
            setTicketErrorMsg(res.data.message)
            handleShowErrorModel()
            // setOtpErrorMsg("Please enter Valid OTP");
            // console.log("otp not valid");
          }
        });
    }
  };



  const filterTickets = (filterby) =>{
    console.log('filterby' ,filterby)
    let FilterData = []
    console.log(new Date().getDate())
    tickets.map(ticket=>{
      console.log('ticket............',ticket)
      if(filterby == 'Today'){
        if(ticket.booking_status == 'active' && new Date(ticket.redeem_start).getDate() == new Date().getDate()){
          FilterData.push(ticket) 
          setActiveFilter('Today')
        }
      }
      else if(filterby == 'Upcoming'){
        if(ticket.booking_status == 'active' && new Date(ticket.redeem_start).getDate() > new Date().getDate()){
          FilterData.push(ticket) 
          setActiveFilter('Upcoming')
        }
      }
      else if(filterby == 'Redeemed'){
        if(ticket.booking_status == 'redeemed'){
          FilterData.push(ticket) 
          setActiveFilter('Redeemed')
        }
      }else if(filterby == 'Expired'){
        if(ticket.booking_status == 'expired'){
          FilterData.push(ticket) 
          setActiveFilter('Expired')
        }
      }else{
        FilterData.push(ticket)
        setActiveFilter('All')
      }
    })
    setTicketsData(FilterData)
  }

  return (
    <>
      <SideNav />
      <div className="main_body">
        <div className="row">
          
          <div
            className=""
            style={{
              backgroundColor: "rgb(42, 42, 48)",
              height: "auto",
              marginTop: "100px",
              borderRadius: "10px",
              // marginLeft: "20px",
            }}
          > 
        <div className="d-flex justify-content-center">
          {searchBy == 'mblNo' ? <div className="d-flex justify-content-evenly m-3 tickets-filter">
            <p className={activeFilter == 'All' ? "active" : ""} onClick={()=>filterTickets('All')}>All</p>|
            <p className={activeFilter == 'Today' ? "active" : ""} onClick={()=>filterTickets('Today')}>Today</p>|
            <p className={activeFilter == 'Upcoming' ? "active" : ""} onClick={()=>filterTickets('Upcoming')}>Upcoming</p>|
            <p className={activeFilter == 'Redeemed' ? "active" : ""} onClick={()=>filterTickets('Redeemed')}>Redeemed</p>|
            <p className={activeFilter == 'Expired' ? "active" : ""} onClick={()=>filterTickets('Expired')}>Expired</p>
          </div> :<></>}
        </div>
            {showTickets ? (

              <div className="row row-cols-1 row-cols-md-5 g-4 px-4 py-4">
                {ticketsData.map((ticket) => {
                  let  qrImage = ticket.qr_image ;
                  let foodImgAll =JSON.parse(ticket.image)
                  let foodImg = ''
                  foodImgAll && foodImgAll.length > 0 ? foodImgAll.map(food =>{
                      foodImg = food
                  }):<></>
                  return (
                    <div className="col ">
                      <div className="card  ticket-card text-center position-relative">
                        <img
                          src={`https://pannaiyarbiriyani.com/user/demo/img/userprofile/${foodImg}`}
                          className="card-img-top"
                          alt="..."
                        />
                        <div className="card-body">
                          <h5 className="card-title ticket-id">
                           {ticket.item_type == 'veg' ?
                            <BiFoodTag style={ ticket.item_type == 'veg' ?  { color: "green" } :  { color: "red" }} />  :
                            <BsCaretUpSquare style={ ticket.item_type == 'veg' ?  { color: "green" } :  { color: "red" }} />
                          }
                            {/* <>BsCaretUpSquare</> */}
                            &ensp;{ticket.booking_id}
                          </h5>
                          <span className="card-text ">
                          <h5 className="ticket-title">{ticket.item_name}</h5>
                          <p className="booking-time">
                            {new Date(ticket.create_at).toLocaleString()}
                          </p>
                          <h5 className="branch">
                             {ticket.ticket_name}
                          </h5>
                          <button
                            className="btn btn-primary btn-sm rounded-pill redeem-btn mt-2 position-absolute"
                           
                            style={ticket.booking_status == 'active'  ? { visibility: "visible", boxShadow: "none" }
                                : { visibility: "hidden",boxShadow: "none" }
                            }
                            onClick={e => redeemTicketHandler(e,ticket.booking_id)}
                          >
                            Redeem
                          </button>
                          {
                            ticket.booking_status == 'redeemed' ?  
                            <p className="booking-time"  style={{boxShadow: "none"}}>
                             Redeemed on <br />{ "  "+new Date(ticket.redeemed_time).toLocaleString() }
                           </p>  : <></>
                          }
                          {
                            ticket.booking_status == 'expired' ?  
                            <p className="booking-time"  style={{boxShadow: "none"}}>
                             Expired on <br />{ "  "+ new Date(ticket.expired_time).toLocaleString() }
                           </p>  : <></>
                          }
                          
                        </span>
                        {
                          ticket.booking_status == 'redeemed' ? 
                          <div className="redeemed-ribbon">
                          <img
                            src={redeemed} 
                          />
                        </div> : <></>
                        }
                        {
                         ticket.booking_status == 'expired' ?
                          <div className="expiry-ribbon">
                            <img src={expired}  />
                          </div> : <></>
                        }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <></>
            // (
            //   <div style={{ color: "red", fontSize: "22px", padding: "30px" }}>
            //     {" "}
            //     There is no Tickets
            //   </div>
            // )
            }
          </div>
        </div>
      </div>


      <Modal
        size="md"
        id="showOTPModel"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModel}
        onHide={handleCloseModel}
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
                paddingLeft:'10px',
                fontWeight: 'bold',
                borderRadius: '10px'}}
            />
          <Button className="px-3 my-3 rounded-pill" size="sm" onClick={redeemTicket}>Redeem</Button>
          {otpErrorMsg ? <div className="m-2" style={{color:"red"}}>{otpErrorMsg}</div> : <></>}
        </Modal.Body>
      </Modal>
      {/* <Modal
        size="sm"
        id="showOTPModel"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModel}
        onHide={handleCloseModel}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Enter OTP
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex">
            <input
              type="text"
              maxLength={4}
              minLength={4}
              onChange={(e) => setRedeemOtp(e.target.value)}
            />
            &ensp;&ensp;
            <Button size="sm" onClick={redeemTicket}>
              Redeem
            </Button>
          </div>
          <div style={{ color: "red" }}>{otpErrorMsg}</div>
        </Modal.Body>
      </Modal> */}

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
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RedeemTicket;
