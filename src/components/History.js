import React, { Component } from "react";
import SideNav from "./SideNav";
import "./Dashboard.css";
import { BASE_URL } from "../config/config";
import axios from "axios";

// import

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ticketData: [],
      userData: [],
      data: [],
      fiteredData: [],
      errorTost: false,
      successTost: false,
      message: "",
    };
  }

  componentDidMount = () => {
    let userData;
    let ticketData;
    axios.get(BASE_URL +`/tickets/getAllBookingWithChars/all`).then((res) => { 
      ticketData = res.data.data
      this.setState({ ticketData: res.data.data });
      axios.post(BASE_URL + "/totalUsers").then((res) => {
        let data = res.data.result;
        userData = data
        this.setState({ userData: data });
        let tableData = []
        userData.map((user)=>{
         ticketData.map((ticket,key) =>{
           let tiketStatus;
          
           if (ticket.booking_status == 'active') {
            tiketStatus = 'Active'
          } else if(ticket.booking_status == 'redeemed'){
            tiketStatus = 'Redeemed'
          }
          else if(ticket.booking_status == 'expired'){
            tiketStatus = 'Expired'
          }

           if (user.Id === Number(ticket.user_id)) {
             let data = {
               sno: key + 1,
               tktId: ticket.booking_id,
               name: user.User_Name,
               phone: user.User_Phonenumber,
               email: user.User_Email,
               tktStatus: tiketStatus,
               redeemed:ticket.redeemed_time,
               purchased: new Date(ticket.create_at).toLocaleDateString(),
               companyName : user.User_Company_Name ,
               employmentId : user.User_Company_Id
             }
             tableData.push(data)
           }
         })
        })
        this.setState({data : tableData})
        this.setState({fiteredData : tableData})
      });
    });
  };


  searchData = (e) =>{
		const val = e.target.value;
		const { data } = this.state;
		// console.log(val.toLowerCase());
		const temp = data.filter((value) => {
      console.log(value)
      return(value.tktId.toLowerCase().includes(val.toLowerCase())
      || 
       value.name.toLowerCase().includes(val.toLowerCase()) 
       || 
      value.email.toLowerCase().includes(val.toLowerCase())
       || 
      value.phone.toString().toLowerCase().includes(val.toLowerCase())
      ||
      value.tktStatus.toLowerCase().includes(val.toLowerCase())
       ||
      ( value.companyName != null ? value.companyName.toLowerCase().includes(val.toLowerCase()) : '') 
      ||
      (value.employmentId != null ?  value.employmentId.toLowerCase().includes(val.toLowerCase())  : '' ))
		});
		// console.log(temp);

		this.setState({ fiteredData: temp });

	}

  filterSelected = (filterby)  => {
		const val = filterby.target.value ;
		const { data } = this.state;
    
		if (val == "All") {
			this.setState({ fiteredData: data });
		} else {
      
			let temp = data.filter((ticket) => { 
        console.log(ticket.tktStatus == val)
        if(ticket.tktStatus == val){
          return ticket
        }
        // return (ticket.tktStatus === val)
      });
			this.setState({ fiteredData: temp });
		}

	}

  render() {
    // console.log(this.state);
    const { ticketData , userData } = this.state;
    const tableData = this.state.fiteredData

    // const data = [
    //   {
    //     sno: 1,
    //     tktId: "PB0420",
    //     name: "kavin",
    //     phone: "",
    //     email: "",
    //     tktStatus: "Active",
    //     redeemed: "",
    //     purchased: "",
    //   },
    //   {
    //     sno: 1,
    //     tktId: "PB0420",
    //     name: "kavin",
    //     phone: "",
    //     email: "",
    //     tktStatus: "Active",
    //     redeemed: "",
    //     purchased: "",
    //   },
    //   {
    //     sno: 1,
    //     tktId: "PB0420",
    //     name: "ravin",
    //     phone: "",
    //     email: "",
    //     tktStatus: "Active",
    //     redeemed: "",
    //     purchased: "",
    //   },
    //   {
    //     sno: 1,
    //     tktId: "PB0420",
    //     name: "pavin",
    //     phone: "",
    //     email: "",
    //     tktStatus: "Active",
    //     redeemed: "",
    //     purchased: "",
    //   },
    // ];
    const columns = [
      {
        Header: "Serial No",
        accessor: "sno",
      },
      {
        Header: "Ticket Id",
        accessor: "tktId",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone No",
        accessor: "phone",
      },
      {
        Header: "Company Name",
        accessor: "companyName",
      },
      {
        Header: "Employment Id",
        accessor: "employmentId",
      },
      {
        Header: "Ticket Status",
        accessor: "tktStatus",
        getProps: (state, rowInfo, column) => {
          return {
              style: {
                  color: rowInfo && rowInfo.row.tktStatus == 'Active' ? 'blue' : ( rowInfo && rowInfo.row.tktStatus == 'Redeemed' ? 'green' : 'red'),
              },
          };
      }
      },
      {
        Header: "Purchased On",
        accessor: "purchased",
      },
      {
        Header: "Redeemed On",
        accessor: "redeemed",
      },
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
              
                <select name="cars" id="cars" className="input filter-by" onChange={(e)=>{this.filterSelected(e)}}>
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Redeemed">Redeemd</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <ReactTable
                data={tableData}
                columns={columns}
                defaultPageSize={10}
                pageSizeOptions={[10, 20, 50]}
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

export default History;
