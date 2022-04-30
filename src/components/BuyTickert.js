import React from "react";
import { Link } from "react-router-dom";

import Body_img from "../img/collection-indian-biryanis-styled-260nw-1836975842.png";
import Body_img_icon from "../img/restaurant-cutlery-circular-symbol-of-a-spoon-and-a-fork-in-a-circle (1)1.png";
import Emptycart from "../img/cartempty.jpg";
import veg_img from "../img/veg.jpg";
import special from "../img/special.jpg";
import DatePicker from './datePicker'
import $ from 'jquery';

import nonveg_img from "../img/non_veg.jpg";
import brandlogo from "../img/brandlogo-4.png";
import { GrClose } from "react-icons/gr";
import { IoClose } from "react-icons/io5";

import Checkout from "./checkout";
import Cart from "./Cart";
import SideNav from "./SideNav";
import Veg from "./menu_veg";
import NonVeg from "./menu_non_veg";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { BsFillSuitHeartFill } from "react-icons/bs";
import { useDispatch, useSelector, connect } from "react-redux";
import {
  cartIncrement,
  cartDecrement,
  TotalItem,
  TotalAmt,
} from "../action/index";
import Modal from "react-bootstrap/Modal";
// import Tabs from "react-bootstrap/Tabs";
import { HiSortDescending } from "react-icons/hi";

import Tab from "react-bootstrap/Tab";
// import { BiFoodTag } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
import { IoTriangle } from "react-icons/io5";
import axios from "axios";
import { apibaseURL } from "../apiBaseURL";
import Countdown, { zeroPad } from "react-countdown";
import moment from 'moment'
import { HiPlusSm, HiMinusSm } from "react-icons/hi";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { createHashHistory } from "history";
import io from "socket.io-client"
const history = createHashHistory();

// const socket = io.connect("http://localhost:3006")

class BuyTickert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPrice: 0,
      mobilecartdisplay: "",
      cartempty: null,
      show: false,
      foodTypes: [],
      CartItem: [],
      cart: [],
      cartIdAarry: [],
      countValues: [],
      dummyState: true,
      modelImage: '',
      modelAboutContent: '',
      selectedDate: { value: new Date(new Date().setDate(new Date().getDate() + 0)) },
      apiGetFullData: '',
      buyTickertData: [],
      allbuyTickertData: [],
      filterdata: 'all',
      slideImages: ['PNBI_TICKET1650345806156.png', 'PNBI_TICKET1650345806156.png', 'PNBI_TICKET1650345806156.png'],
      detailsPopUPData: ''
    };
  }

  componentDidMount() {


    window.addEventListener('scroll', this.handleScroll);

    if (this.props.cartreducer.TotalItem > 0) {
      this.setState({ cartempty: false });
    } else {
      this.setState({ cartempty: true });
    }
    if (localStorage.getItem("cart")) {
      this.setState({ cart: JSON.parse(localStorage.getItem("cart")) });
    }
    $(function () {
      var move = '200px';
      $("div.active")
        .next("div.timeline-item")
        .css("border-left-width", "0");

      $(".prev-btn").click(function () {
        $(".timeline-list").animate({ scrollLeft: "-=" + move });

      });
      $(".next-btn").click(function () {
        $(".timeline-list").animate({ scrollLeft: "+=" + move });
      });

      $(".timeline-item").click(function () {
        $(".timeline-item").removeClass('active');
        $(this).addClass('active');
      });
      $(".filter").click(function () {
        $(".filter").removeClass('active');
        $(this).addClass('active');
      });

    });

    axios.get(apibaseURL + "/tickets/ticketsByDate/" + new Date(new Date().setDate(new Date().getDate() + 0))).then((res) => {
      // console.log("FoodDataApi", res.data);
      if (res.data && res.status == 200) {
        let buyTickerts = [];

        buyTickerts.push(res.data.data.BreakFast)
        buyTickerts.push(res.data.data.MorningSnacks)
        buyTickerts.push(res.data.data.Lunch)
        buyTickerts.push(res.data.data.EveningSnacks)
        buyTickerts.push(res.data.data.Dinner)
        buyTickerts.push(res.data.data.LateNight)
        buyTickerts.push(res.data.data.FullDay)
        buyTickerts.push(res.data.data.Specials)
        // console.log("->", buyTickerts)

        this.setState({ buyTickertData: buyTickerts, apiGetFullData: res, allbuyTickertData: buyTickerts });
      }

    })
  }

  componentWillUnmount() {
    // clearInterval(this.timer);
  }






  itemPlus = (id, price, name, foodtype, day) => {

    // socket.on("receive_message", (data) => {
    //   console.log(data)
    // });
    let cart = [];
    let totalItemcount = 0;
    let totalAmount = 0;
    let countValues = this.state.countValues;
    if (localStorage.getItem("cartList")) {
      let cartlist = JSON.parse(localStorage.getItem("cartList"));
      totalItemcount = cartlist.totalItemcount;
      totalAmount = cartlist.totalAmount;

    }
    if (localStorage.getItem("cart")) {
      let cartDetails = JSON.parse(localStorage.getItem("cart"));
      cart = cartDetails;
      const array1 = [];

      cart.map((item) => {
        array1.push(item.itemId);
        if (item.itemId == id) {
          item.itemQty = item.itemQty + 1;
          totalItemcount = totalItemcount + 1;
          totalAmount = totalAmount + 1 * price;

          countValues["count" + id] = item.itemQty;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem(
          "cartList",
          JSON.stringify({ totalItemcount, cart, totalAmount })
        );
        this.setState({ cart: cart });
      });

      if (!array1.includes(id)) {
        cart.push({
          itemName: name,
          itemFoodType: foodtype,
          itemId: id,
          itemPrice: price,
          itemQty: 1,
          itemDay: day,
          bookingDate:this.state.selectedDate
        });
        totalItemcount = totalItemcount + 1;
        totalAmount = totalAmount + price;
        countValues["count" + id] = 1;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem(
        "cartList",
        JSON.stringify({ totalItemcount, cart, totalAmount })
      );
      this.setState({ cart: cart });
    } else {
      cart.push({
        itemName: name,
        itemFoodType: foodtype,
        itemId: id,
        itemPrice: price,
        itemQty: 1,
        itemDay: day,
        bookingDate:this.state.selectedDate
      });
      totalItemcount = totalItemcount + 1;
      totalAmount = totalAmount + price;
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem(
        "cartList",
        JSON.stringify({ totalItemcount, cart, totalAmount })
      );
      countValues["count" + id] = 1;
      this.setState({ cart: cart });
    }
    this.setState({ countValues });
    // this.addcart();
  };

  itemMinus = (id, price, name, foodtype, index) => {

    let cart = this.state.cart;
    let totalItemcount = 0;
    let totalAmount = 0;
    let countValues = this.state.countValues;
    if (localStorage.getItem("cartList")) {
      let cartlist = JSON.parse(localStorage.getItem("cartList"));
      totalItemcount = cartlist.totalItemcount;
      totalAmount = cartlist.totalAmount;

      // console.log(cartlist);
    }

    cart.map((item, i) => {
      // array1.push(item.itemId);  
      if (item.itemId == id) {
        if (item.itemQty <= 0) {
          //  .splice(index,1)
        } else {
          item.itemQty = item.itemQty - 1;
          totalItemcount = totalItemcount - 1;
          totalAmount = totalAmount - price;
          countValues["count" + id] = countValues["count" + id] - 1;

          if (item.itemQty == 0) {
            cart.splice(i, 1);
          }
          localStorage.setItem("cart", JSON.stringify(cart));
          localStorage.setItem(
            "cartList",
            JSON.stringify({ totalItemcount, cart, totalAmount })
          );
        }
      }

      this.setState({ cart: cart });
      this.setState({ countValues });
    });

    // this.addcart();
  };

  addcart = () => {

    // localStorage.removeItem("cart")
    // localStorage.removeItem("cartList")
    axios.get(apibaseURL + "/tickets/ticketsByDate/" + this.state.selectedDate.value).then((res) => {
      console.log("FoodDataApi", res.data);
      if (res.data && res.status == 200) {
        let buyTickerts = [];
        let filterdata = this.state.filterdata;
        if (filterdata == "all") {
          buyTickerts.push(res.data.data.BreakFast)
          buyTickerts.push(res.data.data.MorningSnacks)
          buyTickerts.push(res.data.data.Lunch)
          buyTickerts.push(res.data.data.EveningSnacks)
          buyTickerts.push(res.data.data.Dinner)
          buyTickerts.push(res.data.data.LateNight)
          buyTickerts.push(res.data.data.FullDay)
          buyTickerts.push(res.data.data.Specials)
        }
        if (filterdata == "snacks") {
          buyTickerts.push(res.data.data.MorningSnacks)
          buyTickerts.push(res.data.data.EveningSnacks)
        }
        if (filterdata == "meals") {
          buyTickerts.push(res.data.data.BreakFast)
          buyTickerts.push(res.data.data.Lunch)
          buyTickerts.push(res.data.data.Dinner)
          buyTickerts.push(res.data.data.LateNight)
          buyTickerts.push(res.data.data.FullDay)
        }

        if (filterdata == "spacial") {
          buyTickerts.push(res.data.data.Specials)
        }



        this.setState({ buyTickertData: buyTickerts, apiGetFullData: res });

      }

    })

  }

  render() {
    // window.addEventListener('scroll', this.handleScroll);
    localStorage.setItem("user", JSON.stringify({ name: this.state }));
    let cartDetails;
    let cartList;
    if (localStorage.getItem("cart")) {
      cartDetails = JSON.parse(localStorage.getItem("cart"));
      cartList = JSON.parse(localStorage.getItem("cartList"));
    }
    let { foodTypes } = this.state;

    let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];

    var AllDates = [];
    var showdate;
    for (var i = 0; i <= 1000; i++) {
      // let date = new Date(tomorrow.setDate(new Date().getDate() + i))
      // let value = new Date(tomorrow.setDate(new Date().getDate() + i))
      var current = new Date(); //'Mar 11 2022' current.getTime() = 1426060964567
      let date = new Date(current.getTime() + i * 86400000); // + 1 day in ms
      let data;

      if (i == 0) {
        data = {
          // date: date.getDate(),
          date: date.getDate(),
          day: dayNames[date.getDay()],
          time: date.getTime(),
          year: date.getFullYear(),
          month: monthName[date.getMonth()],
          holiday: false,
          showdate: "Today",
          value: date

        }
        showdate = data
        AllDates.push(data)
      } else if (i == 1) {
        data = {
          date: date.getDate(),
          day: dayNames[date.getDay()],
          time: date.getTime(),
          year: date.getFullYear(),
          holiday: false,
          month: monthName[date.getMonth()],
          value: date,
          showdate: "Upcoming",
        }

        AllDates.push(data)
      }
      else {
        data = {
          date: date.getDate(),
          day: dayNames[date.getDay()],
          time: date.getTime(),
          year: date.getFullYear(),
          month: monthName[date.getMonth()],
          holiday: false,
          value: date,
          showdate: "Upcoming",
        }
        // console.log(date.getMonth())
        AllDates.push(data)
      }
    }
    const dateSelected = (data, key) => {
      console.log(" selectedDate", data)
      this.setState({ selectedDate: data })
      localStorage.removeItem("cart")
      localStorage.removeItem("cartList")
      axios.get(apibaseURL + "/tickets/ticketsByDate/" + data.value).then((res) => {
        console.log("FoodDataApi", res.data);
        if (res.data && res.status == 200) {
          let buyTickerts = [];
          let allbuyTickertData = [];
          let filterdata = this.state.filterdata;
          if (true) {
            allbuyTickertData.push(res.data.data.BreakFast)
            allbuyTickertData.push(res.data.data.MorningSnacks)
            allbuyTickertData.push(res.data.data.Lunch)
            allbuyTickertData.push(res.data.data.EveningSnacks)
            allbuyTickertData.push(res.data.data.Dinner)
            allbuyTickertData.push(res.data.data.LateNight)
            allbuyTickertData.push(res.data.data.FullDay)
            allbuyTickertData.push(res.data.data.Specials)
          }
          if (filterdata == "all") {
            buyTickerts.push(res.data.data.BreakFast)
            buyTickerts.push(res.data.data.MorningSnacks)
            buyTickerts.push(res.data.data.Lunch)
            buyTickerts.push(res.data.data.EveningSnacks)
            buyTickerts.push(res.data.data.Dinner)
            buyTickerts.push(res.data.data.LateNight)
            buyTickerts.push(res.data.data.FullDay)
            buyTickerts.push(res.data.data.Specials)
          }
          if (filterdata == "snacks") {
            buyTickerts.push(res.data.data.MorningSnacks)
            buyTickerts.push(res.data.data.EveningSnacks)
          }
          if (filterdata == "meals") {
            buyTickerts.push(res.data.data.BreakFast)
            buyTickerts.push(res.data.data.Lunch)
            buyTickerts.push(res.data.data.Dinner)
            buyTickerts.push(res.data.data.LateNight)
            buyTickerts.push(res.data.data.FullDay)
          }

          if (filterdata == "spacial") {

            buyTickerts.push(res.data.data.Specials)
          }



          this.setState({ buyTickertData: buyTickerts, apiGetFullData: res, allbuyTickertData: allbuyTickertData });

        }

      })

    }
    const addcart = () => {
      axios.get(apibaseURL + "/tickets/ticketsByDate/" + this.state.selectedDate.value).then((res) => {
        console.log("FoodDataApi", res.data);
        if (res.data && res.status == 200) {
          let buyTickerts = [];
          let allbuyTickertData = [];
          let filterdata = this.state.filterdata;
          if (true) {
            allbuyTickertData.push(res.data.data.BreakFast)
            allbuyTickertData.push(res.data.data.MorningSnacks)
            allbuyTickertData.push(res.data.data.Lunch)
            allbuyTickertData.push(res.data.data.EveningSnacks)
            allbuyTickertData.push(res.data.data.Dinner)
            allbuyTickertData.push(res.data.data.LateNight)
            allbuyTickertData.push(res.data.data.FullDay)
            allbuyTickertData.push(res.data.data.Specials)
          }
          if (filterdata == "all") {
            buyTickerts.push(res.data.data.BreakFast)
            buyTickerts.push(res.data.data.MorningSnacks)
            buyTickerts.push(res.data.data.Lunch)
            buyTickerts.push(res.data.data.EveningSnacks)
            buyTickerts.push(res.data.data.Dinner)
            buyTickerts.push(res.data.data.LateNight)
            buyTickerts.push(res.data.data.FullDay)
            buyTickerts.push(res.data.data.Specials)
          }
          if (filterdata == "snacks") {
            buyTickerts.push(res.data.data.MorningSnacks)
            buyTickerts.push(res.data.data.EveningSnacks)
          }
          if (filterdata == "meals") {
            buyTickerts.push(res.data.data.BreakFast)
            buyTickerts.push(res.data.data.Lunch)
            buyTickerts.push(res.data.data.Dinner)
            buyTickerts.push(res.data.data.LateNight)
            buyTickerts.push(res.data.data.FullDay)
          }

          if (filterdata == "spacial") {

            buyTickerts.push(res.data.data.Specials)
          }
          this.setState({ buyTickertData: buyTickerts, apiGetFullData: res, allbuyTickertData: allbuyTickertData });
        }
      })

      // var cart = cartrender();
      // if (cart) {
        history.push("/checkout");
      // }
      // console.log(cart);


    }
    const filterTicket = (filterdata) => {

      let buyTickerts = []
      let res = this.state.apiGetFullData;
      this.setState({ filterdata: filterdata });

      if (filterdata == "all") {
        buyTickerts.push(res.data.data.BreakFast)
        buyTickerts.push(res.data.data.MorningSnacks)
        buyTickerts.push(res.data.data.Lunch)
        buyTickerts.push(res.data.data.EveningSnacks)
        buyTickerts.push(res.data.data.Dinner)
        buyTickerts.push(res.data.data.LateNight)
        buyTickerts.push(res.data.data.FullDay)
        buyTickerts.push(res.data.data.Specials)
      }
      if (filterdata == "snacks") {
        buyTickerts.push(res.data.data.MorningSnacks)
        buyTickerts.push(res.data.data.EveningSnacks)
      }
      if (filterdata == "meals") {
        buyTickerts.push(res.data.data.BreakFast)
        buyTickerts.push(res.data.data.Lunch)
        buyTickerts.push(res.data.data.Dinner)
        buyTickerts.push(res.data.data.LateNight)
        buyTickerts.push(res.data.data.FullDay)
      }

      if (filterdata == "spacial") {

        buyTickerts.push(res.data.data.Specials)
      }


      this.setState({ buyTickertData: buyTickerts })
    }

    const reverseOrder = (e) => {
      console.log("reverse")
      let reverseData = this.state.buyTickertData
      console.log(reverseData.reverse())
      this.setState({ buyTickertData: reverseData })
    }

    showdate = this.state.selectedDate ? this.state.selectedDate : showdate;
    // console.log("state", this.state.buyTickertData)
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        // return <span>Ticket Expired</span>
        // window.location.reload(true)
        return (<div className="expiry-ticket-img">
          {/* <img src={'https://www.onlygfx.com/wp-content/uploads/2020/05/expired-stamp-5.png'} height="180" /> */}
        </div>)
      } else {
        return <><span>{days > 0 ? zeroPad(days) + ':' : ''}{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span><br />
        </>
        // return <div className="counter-body">
        //   <div className="counter-sec1" ><span className="count-number">{zeroPad(days)}</span><span className="count-string">Days</span></div> <span className="colan">:</span>
        //   <div className="counter-sec1" ><span className="count-number">{zeroPad(hours)}</span><span className="count-string">Hours</span></div><span className="colan">:</span>
        //   <div className="counter-sec1" ><span className="count-number">{zeroPad(minutes)}</span><span className="count-string">Minutes</span></div><span className="colan">:</span>
        //   <div className="counter-sec1" ><span className="count-number">{zeroPad(seconds)}</span><span className="count-string">Seconds</span></div>

        // </div>
      }
    };
    let Cart1 = [];
    if (localStorage.getItem("cart")) {
      Cart1 = JSON.parse(localStorage.getItem("cart"));
    }
    let filterCart = [];
    let totalAmount = 0;
    let totalItemcount = 0;
    console.log(this.state.allbuyTickertData);

    const cartrender = () => {
      let reture = false
      this.state.allbuyTickertData.length > 0 ?
        this.state.allbuyTickertData.map((data, key) => {
          data.length > 0 ? data.map((item, id) => {
            if (Cart1.length > 0) {
              console.log("cart-->>", Cart1)
              const result = Cart1.filter(cart => cart.itemId == item.ticket_id);
              if (result[0]) {
                filterCart.push(result[0]);
                totalItemcount = totalItemcount + result[0].itemQty;
                totalAmount = totalAmount + (result[0].itemQty * result[0].itemPrice);
              }
              localStorage.setItem("cart", JSON.stringify(filterCart));
              let cart = Cart1;
              localStorage.setItem("cartList", JSON.stringify({ totalItemcount, cart, totalAmount }));
              cartDetails = filterCart;
              cartList = { totalItemcount, cart, totalAmount }
              // console.log("cart result--->", filterCart)
              // console.log("count result--->", totalItemcount)
              // console.log("amount result--->", totalAmount)

            }
            reture = true
          }) : reture = false
        }) : reture = false
      return reture
    }
    return (
      <>
        <SideNav />
        <Cart value={this.state} showdate={showdate} />

        <div className="main_body">
          <div className="row bothSidePaddiing" >
            <div className="col-sm-12	col-md-12	col-lg-12">
              <div
                className="body_container"
                style={{ backgroundColor: "white" }}
              >
                <div className="container_text">
                  {/* <span className="Trending-Offer"> Trending Offer</span> */}
                  <div className="container_inner_text">
                    <h1 className="Pannaiyar-Party">Tidel Party</h1>
                    <h3 className="Different-meal-course">
                      12 Different Meal Course
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="" style={{ display: "flex", justifyContent: "center", margin: "20px 0px 0px 0px" }}>
            <DatePicker AllDates={AllDates} onClickDate={dateSelected} />
          </div>
          <hr className="hrTag" />

          <div className="tk_filter">
            <div className="ticket_filter_body" >
              <div className="filter_all active filter" onClick={() => filterTicket('all')}>All</div>
              <div className="filter_snacks  filter" onClick={() => filterTicket('snacks')}>SNACKS</div>
              <div className="filter_meals filter" onClick={() => filterTicket('meals')}>MEALS</div>
              <div className="filter_special filter" onClick={() => filterTicket('spacial')}>SPECIAL</div>
              <HiSortDescending className="filter_icon" onClick={() => reverseOrder("reverse")} />

            </div>
          </div>
          <div class="row ticket_margin" >
            {/* version 5 new tickets */}
            <div className="col-sm-12	col-md-12	col-lg-8 pc-new-ticket">
              {cartrender()}
              {this.state.buyTickertData.length > 0 ?
                this.state.buyTickertData.map((data, key) => {

                  return (<>
                    {data.length > 0 ?
                      <div className="new-ticket-body" id="ticket-body">
                        <div className="new-ticket-container">
                          {data.length > 0 ?
                            <div className="new-ticket-header">
                              <div className="new-ticket-dot">  </div>
                              <div className="new-ticket-time">
                                {data[0].redeem_validity == 'Deadline' || data[0].redeem_validity == 'Any time' ? <><span>Specials</span></> : <span>{data[0].redeem_start} - {data[0].redeem_end} </span>}
                                {data[0].redeem_validity == 'Deadline' || data[0].redeem_validity == 'Any time' ? <></> : <span>({data[0].meal_time})</span>}
                              </div>
                              <div className="new-ticket-available">
                                <span> {data[0].redeem_validity == 'Deadline' || data[0].redeem_validity == 'Any time' ? ` ${data.length}` + " " + "Specials" : <>{data.length} {data[0].meal_time}</>} Available</span>
                              </div>
                            </div> : <></>}
                          {data.length > 0 ? data.map((item, id) => {
                            let counts = {};
                            counts["count" + item.ticket_id] = 0;

                            if (Cart1.length > 0) {
                              Cart1.map((item1) => {
                                if (item.ticket_id == item1.itemId) {
                                  counts["count" + item.ticket_id] = item1.itemQty;
                                }
                              });
                            }



                            return (<>
                              <div className="new-ticket-box">
                                <div className="ticket-box-container">
                                  <div className="ticket-top-box">
                                    <div className="ticket-food-image">
                                      <img src={veg_img} height="50px" className="" />
                                    </div>
                                    <div className="ticket-top-right">
                                      <div>
                                        <div className="ticket-food-mealtime"><span>{item.redeem_validity == 'Deadline' || item.redeem_validity == 'Any time' ? "Specials" : item.meal_time}</span></div>
                                        <div className="ticket-food-name"><span>{item.item_name}</span></div>
                                      </div>
                                      <div className="ticket-food-type">
                                        {item.item_type == 'veg' ? <GoPrimitiveDot className="food-symbol-veg" /> : <IoTriangle className="food-symbol-nonveg" />}
                                      </div>
                                    </div>

                                  </div>
                                  <div className="ticket-center-box">
                                    <div className="center-dot"></div>
                                    <div className="time-left-body">
                                      {item.redeem_validity == 'Deadline' || item.redeem_validity == 'Any time' ? <></> :
                                        <>  <div className="time-left-count"><Countdown date={new Date(item.booking_end)} renderer={renderer}></Countdown></div>
                                          <div className="time-left-text">Time Left</div></>}
                                    </div>
                                    <div className="ticket-left-body">
                                      <div class="top">
                                        <span className="ticket-left-count">{item.is_limited == 1 ? item.limited_quantity_count > 0 ? item.limited_quantity_count - counts["count" + item.ticket_id] : '' : '∞'}	</span>
                                      </div>
                                      <div className="ticket-left-text"><span>Ticket Left</span></div>
                                    </div>

                                    <div className="ticket-price-body">
                                      <div className="ticket-reduce-price">{item.discount == 1 ? `Rs.${item.sale_price}` : ''}</div>
                                      <div className="sale-price">{item.discount == 1 ? `Rs.${item.discount_price}` : `Rs.${item.sale_price}`}</div>
                                    </div>

                                  </div>
                                  <div className="new-ticket-hr-div"></div>
                                  <div className="ticket-bottom-box">
                                    <div className="details-body" onClick={() => { this.setState({ show: true, detailsPopUPData: item, slideImages: JSON.parse(item.image) }) }}><span className="text">Details</span></div>
                                    <div className="add-cart-body">
                                      <div className="minus add-btn"><HiMinusSm className="icon"

                                        onClick={() =>
                                          this.itemMinus(
                                            item.ticket_id,
                                            item.discount == 1 ? item.discount_price : item.sale_price,
                                            item.ticket_name,
                                            item.item_type,
                                            // index
                                          )
                                        }

                                      /></div>

                                      <span className="cart-count">{counts ? (
                                        counts["count" + item.ticket_id]
                                      ) : (
                                        <></>
                                      )} </span>
                                      <div className="plus add-btn"><HiPlusSm className="icon"

                                        onClick={() =>
                                          item.is_limited == 1 ? item.limited_quantity_count > 0 ? item.limited_quantity_count - counts["count" + item.ticket_id] <= 0 ? '' : this.itemPlus(
                                            item.ticket_id,
                                            item.discount == 1 ? item.discount_price : item.sale_price,
                                            item.ticket_name,
                                            item.item_type,
                                            item
                                          ) : this.itemPlus(
                                            item.ticket_id,
                                            item.discount == 1 ? item.discount_price : item.sale_price,
                                            item.ticket_name,
                                            item.item_type,
                                            item
                                          ) :
                                            this.itemPlus(
                                              item.ticket_id,
                                              item.discount == 1 ? item.discount_price : item.sale_price,
                                              item.ticket_name,
                                              item.item_type,
                                              item
                                            )

                                        }
                                      /></div>
                                      <div></div>
                                    </div>

                                  </div>
                                </div>

                              </div>
                            </>)
                          }) : <></>}

                        </div>
                      </div> : <></>}
                  </>)
                }) : <></>}


            </div>
            {/* version 5 new tickets */}
            <div className="col-sm-12	col-md-12	col-lg-4">
              <div className="Rectangle-cart">
                <div className="cart">
                  <div>
                    <span>Cart</span>
                  </div>
                  <div>
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                </div>
                <div className="Line-125"></div>
                {cartList != null ? (
                  cartList.totalItemcount <= 0 ? (
                    <div className="Empatcart">
                      <b>Cart Empty</b>
                    </div>
                  ) : (
                    <div className="CartDetails">
                      <div className="itemlist">
                        {/* <Cartlist /> */}
                        {cartDetails ? (
                          cartDetails.length > 0 ? (
                            cartDetails.map((item, index) => {
                              return (
                                <div
                                  className="FoodItem"
                                // style={{ display: this.state.item1display }}
                                >
                                  <div className="Food_Name">
                                    {item.itemFoodType == "veg" ? (
                                      <GoPrimitiveDot className="food-symbol-veg_cart" />
                                    ) : (
                                      <IoTriangle className="food-symbol-nonveg_cart" />
                                    )}

                                    <span>{item.itemName}</span>
                                  </div>
                                  <div className="Ticket_qnt_btn">
                                    <FaMinusCircle
                                      className="min_btn"
                                      // onClick={this.props.nonVegcartDecrement}
                                      onClick={() =>
                                        this.itemMinus(
                                          item.itemId,
                                          item.itemPrice,
                                          item.itemName,
                                          item.itemFoodType,
                                          index
                                        )
                                      }
                                    />
                                    <span className="Ticket_qnt-val">
                                      <span>{item.itemQty}</span>
                                    </span>
                                    <FaPlusCircle
                                      className="plus_btn"
                                      // onClick={this.props.nonVegcartIncrement}
                                      onClick={() =>
                                        this.itemPlus(
                                          item.itemId,
                                          item.itemPrice,
                                          item.itemName,
                                          item.itemFoodType
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="Empatcart">
                              {/* <img src={Emptycart} /> */}
                              {/* <b>Cart Empty</b> */}
                            </div>
                          )
                        ) : (
                          <div className="Empatcart">
                            {/* <img src={Emptycart} /> */}
                            <b>Cart Empty</b>
                          </div>
                        )}

                        <div className="Line-125"></div>
                        {/* </div> */}
                        <div className="Subtotal">
                          <div className="Food_Name">
                            <span>Subtotal</span>
                          </div>
                          <div className="Total_amt">
                            <span>₹{cartList ? cartList.totalAmount : 0}</span>
                          </div>
                        </div>
                        <div>
                          <span className="Extra-charges-may-apply">
                            Extra charges may apply
                          </span>
                        </div>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <ink1>
                            <div className="Union-31" onClick={() => addcart()}>
                              <span className="Proceed-To-Checkout">
                                Proceed To Checkout
                              </span>
                            </div>
                          </ink1>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <>
                    {" "}
                    <div className="Empatcart">
                      {/* <img src={Emptycart} /> */}
                      <b>Cart Empty</b>
                    </div>{" "}
                  </>
                )}
              </div>
            </div>
            {/* /privacy-policy */}

            <Modal
              show={this.state.show}
              onHide={() => this.setState({ show: false })}
              dialogClassName="modal-90w"
              id="modal-dialog"
              aria-labelledby="example-custom-modal-styling-title"
              centered
            >
              <Modal.Header>
                <div></div>
                <IoClose
                  className="close-icon"
                  onClick={() => this.setState({ show: false })}
                />
              </Modal.Header>
              <Modal.Body>

                <div className="non_veg_item_body">
                  <div className="header-title" >
                    <span>Details</span>
                  </div>

                  <div className="item-body">
                    <div className="item-name">
                      <div className="item-image"><div className="htext"></div>
                        <div>
                          <Carousel showThumbs={true} autoPlay={true} infiniteLoop={true} interval={3000}>
                            {this.state.slideImages.length > 0 ?
                              this.state.slideImages.map((image, key) => {
                                console.log(key, image)
                                return (
                                  <div>
                                    <img src={"https://pannaiyarbiriyani.com/user/demo/img/userprofile/" + image} />
                                    {/* <p className="legend">Legend 1</p> */}
                                    {/* <div className="delete-image" 
                                onClick={() => deleteSlideImage(key)}><FaTrashAlt color="red" size={20} style={{ cursor: "pointer" }} />
                                </div> */}
                                  </div>)
                              }) : <></>
                            }

                          </Carousel></div></div>
                      <div className="htext">Name :<span className="danswer-text"> {this.state.detailsPopUPData != '' ? this.state.detailsPopUPData.item_name : <></>}</span></div>

                    </div>
                    <div className="htext">Ticket:<span className="danswer-text"> {this.state.detailsPopUPData != '' ? this.state.detailsPopUPData.ticket_name : <></>}</span></div>

                    <div className="description"><div className="htext">Description: <div className="danswer-text"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div></div></div>

                    {/* <div className="purchased-date"><div  className="htext">purchased Date: <span className="danswer-text">{this.state.detailsPopUPData!=''?this.state.detailsPopUPData.ticket_name:<></>}</span></div></div> */}

                    {/* <div className="redeemValidity-date"  ><div className="htext">Redeem Validity: <span className="danswer-text">{this.state.detailsPopUPData!=''?this.state.detailsPopUPData.redeem_end_date_time:<></>}</span></div></div> */}

                  </div>
                  {/* <img src={veg_img} /> */}
                  {/* <h1>Description</h1> */}
                  {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> */}
                </div>



              </Modal.Body>
            </Modal>
          </div>
          <div className="footer-copyright">
            Copyright Pannaiyar Biriyani All Right Reserved.
            <Link to="/privacy-policy" >   Privacy Policy </Link>
            |
            <Link to="/terms-and-conditions" > Terms and Conditions</Link>
          </div>
        </div>
      </>
    );
  }
}

// export default BuyTickert;

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    VegcartIncrement: (amt) => {
      dispatch(cartIncrement({ type: "Vegcartincrement", price: 200 }));
      dispatch(TotalItem("cartTotalItem"));
      dispatch(TotalAmt("cartTotalamt"));
    },
    VegcartDecrement: (amt) => {
      dispatch(cartDecrement({ type: "Vegcartdecrement", price: 200 }));
      dispatch(TotalItem("cartTotalItem"));
      dispatch(TotalAmt("cartTotalamt"));
    },

    nonVegcartIncrement: (amt) => {
      dispatch(cartIncrement({ type: "nonVegcartincrement", price: 100 }));
      dispatch(TotalItem("cartTotalItem"));
      dispatch(TotalAmt("cartTotalamt"));
    },
    nonVegcartDecrement: (amt) => {
      dispatch(cartDecrement({ type: "nonVegcartdecrement", price: 100 }));
      dispatch(TotalItem("cartTotalItem"));
      dispatch(TotalAmt("cartTotalamt"));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyTickert);
