import React, { Component } from "react";
import ReactDOM from 'react-dom'

import SideNav from "./SideNav";
import "./Dashboard.css";
import "./adminDetail.scss";

import { BASE_URL } from "../config/config";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { FaEdit,FaTrashAlt,FaCameraRetro } from "react-icons/fa";
import { Link } from "react-router-dom";


// import

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Slider from '@material-ui/core/Slider'
import Cropper from 'react-easy-crop'

class CouponDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      filterData: [],
      errorTost: false,
      successTost: false,
      message: "",
      showModel:false,
    };
  }

  componentDidMount = () => {
    let couponData=[];
    axios.get(BASE_URL + "/couponsDetail").then((res) => {
        
    //   let data = res.data;
      res.data.map((result,key)=> {
        console.log(result)
        let status;
        if(result.coupen_status == 1){
          status = 'Redeemed'
        }else {
          status = 'Active'
        }
        let coupon = {
            sno : key+1,
            couponCode:result.coupen_code,
            createDate:new Date(result.create_date).toLocaleString(),
            coupon_status:status,
            amount:result.discount_amount,
            id:result.id,
            user:result.user_id,
            userPhone:result.created_for,
            admin:result.created_by
        }
        couponData.push(coupon)
      })
      this.setState({data:couponData,filterData:couponData})
    });

  };

   handleCloseModel = () => {
       this.setState({showModel:false})
   }

   handleShowModel = () => {
    this.setState({showModel:true})
   }

  searchData = (e) =>{
		const val = e.target.value;
		const { data } = this.state;
		console.log(val.toLowerCase());
		const temp = data.filter((value) => {
      return( 
            value.admin.toLowerCase().includes(val.toLowerCase()) || 
            value.couponCode.toLowerCase().includes(val.toLowerCase())) 
            // value.IType.toLowerCase().includes(val.toLowerCase()))
            
		});
		console.log(temp);

		this.setState({ filterData: temp });
	}


  render() {
    // console.log(this.state);
    const tableData = this.state.filterData
   
    const columns = [
      {
        Header: "Serial No",
        accessor: "sno",
      },
      {
        Header: "Coupon Code",
        accessor: "couponCode",
      },
      {
        Header: "Discount",
        accessor: "amount",
      },
      {
        Header: "Status",
        accessor: "coupon_status",
      },
      {
        Header: "Created On",
        accessor: "createDate",
      },
      {
        Header: "Created For",
        accessor: "userPhone",
      },
      {
        Header: "Created By",
        accessor: "admin",
      },
      
      // {
      //   Header: "Update",
      //   accessor: "-",
      // }
     
    ];

    return (
      <>
        <SideNav />
        <div className="main_body">
          <div className="row">
            <div
              className="p-4"
              style={{
                backgroundColor: "#fff",
                height: "auto",
                marginTop: "100px",
                borderRadius: "10px",
                // marginLeft: "20px",
              }}
            >
              <div className="top-filter">
              <div>
                Search :{" "}<input type='text' onChange={(e)=>{ this.searchData(e)}} placeholder="Search here" className='input search-by'/></div>
              
                {/* <select name="cars" id="cars" className="input filter-by" onChange={(e)=>{this.filterSelected(e)}}>
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Redeemed">Redeemd</option>
                  <option value="Expired">Expired</option>
                </select> */}
                <Link to="/couponManager">
                <input type='button'  value='Generate New'className='input add-btn' style={{width:'unset'}}/></Link>
              </div>
              <ReactTable
                data={tableData}
                columns={columns}
                defaultPageSize={10}
                // pageSizeOptions={[10, 20, 50]}
                previousText=" ❰❰ "
                nextText=" ❱❱ "
                pageText = ''
                ofText='/ '
                // filterable={true}
              />
            </div>
          </div>
        </div>
      </>

    );
  }
}

export default CouponDetails;
