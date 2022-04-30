import React, { useEffect, useState } from "react";
import SideNav from "./SideNav";
import "./Dashboard.css";
import axios from "axios";
import { BsGraphDown, BsGraphUp } from "react-icons/bs";
import { BASE_URL } from "../config/config";
import { useNavigate, } from "react-router-dom";
import moment from "moment"
import Moment from 'react-moment';
import DatePicker from "react-multi-date-picker"
import Icon from "react-multi-date-picker/components/icon"
// import { createHashHistory } from "history";
// const history = createHashHistory()

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalTickets, setTotalTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [activeCount, setActiveCount] = useState();
  const [redeemedCount, setRedeemedCount] = useState();
  const [expiredCount, setExpiredCount] = useState();
  const [activeDate,setActiveDate] = useState(new Date().toString())
  const [foodItems,setfoodItems] =useState()
  const navigate = useNavigate();

  useEffect(() => {
    console.log(localStorage.getItem('admin_is_loggedin'))
    if (localStorage.getItem('admin_is_loggedin') && localStorage.getItem('admin_is_loggedin') == 'true') {

      // setIsLoggedIn(localStorage.getItem('admin_is_loggedin'));
      axios.get(BASE_URL+`/tickets/getAllBookings/all`).then((res) => {
        if(res.data.status = '200'){
          let totalCount= 0
          let activeCount= 0
          let redeemedCount= 0
          let expiredCount = 0

          res.data.data.map(ticket =>{
            totalCount = totalCount + 1
            if (ticket.booking_status == 'active') {
              activeCount = activeCount + 1
            } else if(ticket.booking_status == 'redeemed'){
              redeemedCount = redeemedCount + 1
            }
            else if(ticket.booking_status == 'expired'){
              expiredCount = expiredCount + 1
            } 
          })

          setTotalCount(totalCount);
          setActiveCount(activeCount);
          setRedeemedCount(redeemedCount);
          setExpiredCount(expiredCount);
        }

      });
      axios.get(BASE_URL + `/tickets/getAllBookingWithChars/all`).then((res) => {
        if(res.data.status == '200'){
          const ticketData = res.data.data
          setTotalTickets(ticketData);
          setAllTickets(res.data.data)
        }
      });
        // getTicketsBydate()
    }
    else {
      navigate("/login");
    }
  }, []);

  // setInterval(() => {
  //   axios.get(BASE_URL + `/tickets/getAllBookingWithChars/all`).then((res) => {
  //     if(res.data.status == '200'){
  //       const ticketData = res.data.data
  //       // setTotalTickets(ticketData);
  //       setAllTickets(res.data.data)
  //     }
  //   });
  // }, 1500);

  let food_Items = []
  if(allTickets && allTickets.length > 0 ){
    totalTickets.map(ticket =>{
      let bookedDate =  new Date(ticket.redeem_start).toDateString()
      let selectedDate = new Date(activeDate).toDateString()
     if(new Date(bookedDate).getTime() == new Date(selectedDate).getTime()){
       let  data = food_Items.filter(item => item.ticket_id == ticket.ticket_id)
       if(data.length == 0 ){ 
         console.log(ticket)
         food_Items.push({ticket_id:ticket.ticket_id, foodName : ticket.item_name , items : [ ticket ]})
       }else{
       food_Items.map(food => {
         console.log(ticket.ticket_id)
         if(food.ticket_id == ticket.ticket_id){
           food.items.push(ticket)
         }
       }) 
      }
     }
    })
    console.log(food_Items);
 }
  
  const handleChangeActiveTime = (value) =>{
    setActiveDate(new Date(value.toString()).toString())
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <>
      <SideNav />
      <div className="main_body">
        <div className="row">
          <div
            className="col"
            style={{ marginTop: "150px", marginLeft: "30px" }}
          >
            <h2 className="fw-bold color-light" style={{ color: "#fff" }}>
              Dashboard
            </h2>
            <p
              style={{
                color: "#fff",
                fontWeight: "200",
                fontFamily: "system-ui",
              }}
            >
              Wellcome Back!
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8 px-4 px-sm-5" >
            <div className="row details-container">
              <div className="col-sm-3 details-box">
                <div className="count-box bg-light">
                  <h4 className="count-box-title">Total Tickets</h4>
                  <h4 className="count-box-count">{totalCount}</h4>
                </div>
              </div>
              <div className="col-sm-3 details-box">
                <div className="count-box bg-light">
                  <h4 className="count-box-title">Active</h4>
                  <h4 className="count-box-count" style={{ color: "red" }}>
                    {activeCount}
                  </h4>
                </div>
              </div>
              <div className="col-sm-3 details-box">
                <div className="count-box bg-light">
                  <h4 className="count-box-title"> Redeemed</h4>
                  <h4 className="count-box-count ">
                    {redeemedCount}&ensp;&ensp;
                    <BsGraphUp color="green" size="18px" />
                  </h4>
                </div>
              </div>
              <div className="col-sm-3 details-box">
                <div className="count-box bg-light">
                  <h4 className="count-box-title"> Expired</h4>
                  <h4 className="count-box-count">
                    {expiredCount}&ensp;&ensp;
                    <BsGraphDown color="red" size="18px" />
                  </h4>
                </div>
              </div>
            </div>
            <div
              className="row"
              style={{ marginTop: "20px", padding: "0px 10px" }}
            >
              <div className="broadcast-box">
                <h4 className="broadcast-title">Broadcast Message:</h4>
                <p className="broadcast-message">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                  natoque penatibus et magnis dis parturient montes, nascetur
                  ridiculus mus. Donec quam felis, ultricies nec, pellentesque
                  eu, pretium quis, sem. Nulla consequat massa quis enim.
                </p>
              </div>
            </div>
          </div>
          <div
            className="col-sm-4"
            // style={{ padding: "0px 40px 0px 20px " }}
          >
            <div className="booknow-box">
              <div className="row details-container">
                <div className="col-sm-12 details-box" >
                  
                  <div className="count-box today-bookings bg-light" >
                    <h4 className="count-box-title "><h4><Moment date={new Date(activeDate)} format="dddd(DD.MM.YYYY)"/> Bookings</h4><DatePicker classNeme='calender' render={<Icon/>} onChange={value =>handleChangeActiveTime(value)}/></h4>
                    <div className="food-items mt-4">
                      {
                        food_Items && food_Items.length > 0 ? 
                      <div className="d-flex justify-content-between">
                        <h4 className="fw-bold">Item Name</h4>
                        <h4 className="fw-bold">Count</h4>
                      </div> : 
                      <div className="d-flex justify-content-between">
                         <h4 className="fw-bold">Ticket Not Booked for {new Date(activeDate).toDateString()}</h4>
                      </div> 
                      }
                      {
                      food_Items && food_Items.length > 0 ?  food_Items.map(food =>{
                          return(
                            <div className="d-flex justify-content-between">
                              <h4>{food.foodName}</h4>
                              <h4>{food.items.length}</h4>
                            </div>
                          )
                        }) : <></>
                      } 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>)

}

export default Dashboard;
