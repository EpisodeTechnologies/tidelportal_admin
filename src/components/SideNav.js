import React, { useState, useEffect } from "react";
import { NavLink, Link,useNavigate, Navigate } from "react-router-dom";
import { createHashHistory } from "history";
import DefaultImage from "../img/userprofile/default.png"
const history = createHashHistory()

function SideNav() {
  const [adminDetail , setAdminDetail] =useState('')
  const [marginLeft, setmarginLeft] = useState("0");
  const navigate = useNavigate();

  var Profileimage ="https://med.gov.bz/wp-content/uploads/2020/08/dummy-profile-pic-300x300.jpg";

  useEffect(() => {
      if(localStorage.getItem('admin_login_details')){
        // if(localStorage.getItem('user_login_details') == true){
          setAdminDetail(JSON.parse(localStorage.getItem('admin_login_details')))
        // }
      }

      var x = window.matchMedia("(max-width: 971px)");
      if (x.matches) {
        setmarginLeft("-250px");
      } else {
        setmarginLeft("0px");
      }
  }, []);

  const logout = () => {
    localStorage.setItem("admin_is_loggedin",false);
    localStorage.removeItem("user_login_details");
    localStorage.removeItem("user_login");
    navigate('/login')
  }


  return (
    <>
      <div className="main">
        <div className="Side-nav" style={{ marginLeft: marginLeft }}>
          <i
            class="fas fa-times"
            id="sidebarbnt"
            onClick={() => setmarginLeft("-250px")}
          ></i>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "250px",
            }}
            onClick={()=>navigate('/editProfile')}
          >
            <div>
              <img className="profile_square" src={adminDetail.admin_profile!= null ?`https://pannaiyarbiriyani.com/user/demo/img/userprofile/${adminDetail.admin_profile}`:DefaultImage} />
            </div>
            <span class="Login" >{adminDetail.admin_name}</span>
            <p class="" style={{color:'#fff'}}>{adminDetail.admin_role}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
              width: "250px",
              height: "100%",
              position: "absolute",
            }}
          >
            <span className="option_menu">Menu</span>
            <div className="nav_list">
              <ul>
                <NavLink to="/" activeClassName="active">
                  <li>
                    <i class="fas fa-clipboard-list"></i>
                    Dashboard
                  </li>
                </NavLink>
                <NavLink exact to="/ticketManager" activeClassName="active">
                  <li>
                    <i class="fas fa-receipt"></i>Ticket Manager
                  </li>
                </NavLink>
                <NavLink exact to="/history" activeClassName="active">
                  <li>
                    <i class="fas fa-history"></i>History
                  </li>
                </NavLink>
                <NavLink exact to="/about" activeClassName="active">
                  <li>
                    <i class="fas fa-info-circle"></i>About
                  </li>
                </NavLink>
                <NavLink exact to="/customerservice" activeClassName="active">
                  <li>
                    <i class="fas fa-user-astronaut"></i>Customer Service
                  </li>
                </NavLink>
                <NavLink exact to="/couponsDetail" activeClassName="active">
                  <li>
                    <i class="fas fa-ticket-alt"></i>Coupon Manager
                  </li>
                </NavLink> 
                {
                  adminDetail.admin_role === "Super Admin" ? 
                  <NavLink exact to="/adminDetail" activeClassName="active">
                  <li>
                    <i class="fas fa-user-cog"></i>Admin Detail
                  </li>
                </NavLink> :
                <></>
                }
                {
                  adminDetail.admin_role === "Super Admin" ? 
                 <NavLink exact to="/scheduleTicket" activeClassName="active">
                  <li>
                    <i class="fas fa-user-cog"></i>Schedule Ticket
                  </li>
                </NavLink>
                :
                <></>
                }
              </ul>
            </div>
          </div>
        </div>

        <div className="main_body_nav ">
          <div className="nav_body normal-nav">
            <div className="body_left"></div>
            <div className="body_right">
              <i class="fas fa-bell"></i>

              <ul class="nav navbar-nav ms-auto">
                <li class="nav-item dropdown">
                  <a href="#" class="nav-link " data-bs-toggle="dropdown">
                    <i class="fas fa-cog "></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a href="#" class="dropdown-item">
                      Reports
                    </a>
                    <a href="#" class="dropdown-item">
                      Settings
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" onClick={() => logout()} >
                      Logout
                    </a>
                  </div>
                </li>
              </ul>
              <div className="logo_box">
                <i className="PB_logo"> </i>
              </div>
            </div>
          </div>
          {/* mobile responsive */}
          <div className="nav_body responsive-nav">
            <div className="body_left">
              <i
                class="fas fa-bars"
                id="sidebar-btn"
                onClick={() => setmarginLeft("0px")}
              ></i>
            </div>
            <div className="body_right">
              
            <div className="logo_box">
                <i className="PB_logo"> </i>
            </div>
            
            <div className="icons-containe">
            <i class="fas fa-bell"></i>
            <ul class="nav navbar-nav ms-auto">
                <li class="nav-item dropdown">
                  <a href="#" class="nav-link " data-bs-toggle="dropdown">
                    <i class="fas fa-cog "></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a href="#" class="dropdown-item">
                      Reports
                    </a>
                    <a href="#" class="dropdown-item">
                      Settings
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" onClick={() => logout()} >
                      Logout
                    </a>
                  </div>
                </li>
            </ul>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideNav;
