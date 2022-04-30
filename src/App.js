import "./App.css";
import Login from "./components/Login";
import { BrowserRouter as Router,HashRouter, Routes, Route } from "react-router-dom";
import VerifyOtp from "./components/VerifyOtp";
import Dashboard from "./components/Dashboard";
import TicketManager from "./components/TicketManager";
import History from "./components/History";
import About from "./components/About";
import CustomerService from "./components/CustomerService";
import RedeemTicket from "./components/RedeemTicket";
import ScheduleFood from "./components/ScheduleFood";
import EditProfile from "./components/editProfile";
import Coupon from "./components/Coupon"
import CouponDetails from "./components/CouponDetails"
import AdminDetail from "./components/adminDetail";
import ViewTicketPage from "./components/viewTicketPage";



function App() {
  return (
    <>
      {/* <SideNav /> */}
      <HashRouter>
      {/* <Router> */}
        <Routes>
          <Route exact path="/login" element={<Login></Login>}></Route>
          <Route path="/otpverification" element={<VerifyOtp></VerifyOtp>}></Route>
          <Route path="/" element={<Dashboard></Dashboard>}></Route>
          <Route path="/ticketmanager" element={<TicketManager></TicketManager>}></Route>
          <Route path="/history" element={<History></History>}></Route>
          <Route path="/about" element={<About></About>}></Route>
          <Route path="/customerservice" element={<CustomerService></CustomerService>}></Route>
          <Route path="/redeemticket" element={<RedeemTicket></RedeemTicket>}></Route>
          <Route path="/scheduleTicket" element={<ScheduleFood></ScheduleFood>}></Route>
          <Route path="/editProfile" element={<EditProfile></EditProfile>}></Route>
          <Route path="/couponManager" element={<Coupon></Coupon>}></Route>
          <Route path="/adminDetail" element={<AdminDetail></AdminDetail>}></Route>
          <Route path="/view-ticket" element={<ViewTicketPage></ViewTicketPage>}></Route>
          <Route path="/couponsDetail" element={<CouponDetails></CouponDetails>}></Route>
          
        </Routes>
      {/* </Router> */}
      </HashRouter>
    </>
  );
}

export default App;
