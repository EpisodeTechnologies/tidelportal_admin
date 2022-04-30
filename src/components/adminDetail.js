import React, { Component } from "react";
import SideNav from "./SideNav";
import "./Dashboard.css";
import "./adminDetail.scss";
import { BASE_URL } from "../config/config";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

// import { IoTrashBinOutline } from "react-icons/io5";
import { FaEdit,FaTrashAlt } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// import

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

class AdminDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      filterData: [],
      message: "",
      showModel:false,
      admin_Name:'',
      admin_Email:'',
      admin_PhoneNumber:'',
      admin_Role:'',
      updateModel:false,
      updateAdminId:''
    };
  }

  componentDidMount = () => {

    let logedInAdmin = localStorage.getItem('admin_login_details')
    logedInAdmin = JSON.parse(logedInAdmin)
    
   this.getAdminAll()

  }; 

  getAdminAll=()=>{
    let adminData=[];
    let logedInAdmin = localStorage.getItem('admin_login_details')
    logedInAdmin = JSON.parse(logedInAdmin)

    axios.get(BASE_URL + "/getAdminAll").then((res) => {
    //   let data = res.data;
      res.data.map((result,key)=> {
          console.log(result)
          if(result.id != logedInAdmin.id){
            let admin = {
              sno : key+1,
              id:result.id,
              name:result.admin_name,
              role:result.admin_role,
              email:result.admin_email,
              phone:result.admin_phno,
              status:result.status
          }
          adminData.push(admin)
          }
        
      })
      this.setState({data:adminData,filterData:adminData})
    });
  }

  getAdminSingle = (adminId) =>{
    axios.get(BASE_URL + "/getAdmin"+`/${adminId}`).then((res) => {
      //   let data = res.data;
      // console.log(res.data[0])
      const admin = res.data[0]
      this.setState({
        admin_Name:admin.admin_name,
        admin_Email:admin.admin_email,
        admin_PhoneNumber:admin.admin_phno,
        admin_Role:admin.admin_role,
        updateModel:true,
        updateAdminId:adminId
      })
      });
  }

   handleCloseModel = () => {
       this.setState({showModel:false})
   }

   handleShowModel = () => {
    this.setState({showModel:true})
   }

   addNewAdmin = () =>{
     const {admin_Name,admin_Email,admin_PhoneNumber,admin_Role} = this.state
     if(admin_Name && admin_Email && admin_PhoneNumber && admin_Role){
      axios.post(BASE_URL+ "/addNewAdmin", {
        'name': admin_Name,
        'email': admin_Email,
        'phone': admin_PhoneNumber,
        'role': admin_Role
      }).then((res) => {
         console.log(res)
         this.getAdminAll()
         this.setState({admin_Name:'',admin_Email:'',admin_PhoneNumber:'',admin_Role:'',showModel:false})
         toast.success(res.data.message, {
           position: "top-right",
           autoClose: 3000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
       }).catch(err =>{
         toast.error('Error', {
           position: "top-right",
           autoClose: 3000,
           hideProgressBar: false, 
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
       })
     }else{
      toast.error('All Fields Required', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
     }
   }

   deleteAdmin = (adminId)=>{
    axios.post(BASE_URL+ "/deleteAdmin", {
      'id': adminId
    }).then((res) => {
       var data = res.data[0];
       console.log(res)
       this.getAdminAll()
       toast.success(res.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
     }).catch(err =>{
      toast.error('Error', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
     })
   }

   updateAdmin = () =>{
    const {admin_Name,admin_Email,admin_PhoneNumber,admin_Role,updateAdminId} = this.state
    console.log(admin_Name,admin_Email,admin_PhoneNumber,admin_Role)

    if(admin_Name && admin_Email && admin_PhoneNumber && admin_Role){
      axios.post(BASE_URL+ "/updateAdmin", {
        'id': updateAdminId,
        'name': admin_Name,
        'email': admin_Email,
        'phone': admin_PhoneNumber,
        'role': admin_Role
      }).then((res) => {
         console.log(res)
         this.getAdminAll()
         this.setState({admin_Name:'',admin_Email:'',admin_PhoneNumber:'',admin_Role:'',updateAdminId:'',updateModel:false})
         toast.success(res.data.message, {
           position: "top-right",
           autoClose: 1500,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
       }).catch(err =>{
         toast.error('Error', {
           position: "top-right",
           autoClose: 1500,
           hideProgressBar: false, 
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
       })
    }else{
      toast.error('All Fields Required', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
   }

  searchData = (e) =>{
		const val = e.target.value;
		const { data } = this.state;
		const temp = data.filter((value) => {
      return(value.role.toLowerCase().includes(val.toLowerCase())|| 
            value.name.toLowerCase().includes(val.toLowerCase()) || 
            value.email.toLowerCase().includes(val.toLowerCase())|| 
            value.status.toLowerCase().includes(val.toLowerCase())||
            value.phone.toString().toLowerCase().includes(val.toLowerCase()))
		});

		this.setState({ filterData: temp });
	}

//   filterSelected = (filterby)  => {
// 		const val = filterby.target.value ;
// 		const { data } = this.state;
    
// 		if (val == "All") {
// 			this.setState({ filterData: data });
// 		} else {
      
// 			let temp = data.filter((admin) => { 
//         console.log(admin.tktStatus == val)
//         if(admin.tktStatus == val){
//           return admin
//         }
//         // return (admin.tktStatus === val)
//       });
// 			this.setState({ filterData: temp });
// 		}

// 	}

  render() {
    // console.log(this.state);
    const tableData = this.state.filterData

    const columns = [
      {
        Header: "Serial No",
        accessor: "sno",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Role",
        accessor: "role",
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
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Action",
        accessor: "id",
        Cell: (data) => (<div className="d-flex w-100 justify-content-around"><FaTrashAlt style={{cursor:'pointer'}} onClick={()=>this.deleteAdmin(data.value)} color='red'  size={20}/> <FaEdit onClick={()=>this.getAdminSingle(data.value)} size={20} color='#5773ff' style={{cursor:'pointer'}}/></div>)
      
      }
     
    ];

    return (
      <>
       <ToastContainer />
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
                <input type='button'  value='Add New Role' onClick={()=>this.setState({showModel:true})} className='input add-btn' style={{width:'unset'}}/>
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

        <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className='add-admin'
        centered
        show={this.state.showModel}
        onHide={()=>this.setState({showModel:false})}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Ne Admin Role
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center ">
        <div className="add-Adimin-form text-center m-4">
        <div className="form_input_field ">
            <div class="form-group input-group" style={{marginTop:"20px"}}>
              <label class="has-float-label" style={{width:"100%"}}>
                  <input class="form-control" type="text"  placeholder="Enter Name"    value={this.state.admin_Name} onChange={(e)=>this.setState({admin_Name:e.target.value})}/>
                  <span>Name</span>
              </label>
            </div>
            <div class="form-group input-group" style={{marginTop:"40px"}}>
              <label class="has-float-label" style={{width:"100%"}}>
                  <input class="form-control" type="text"  placeholder="Enter Email"    value={this.state.admin_Email}   onChange={(e)=>this.setState({admin_Email:e.target.value})}/>
                  <span>E-mail</span>
              </label>
            </div>
            <div class="form-group input-group" style={{marginTop:"40px"}}>
              <label class="has-float-label" style={{width:"100%"}}>
                  <input class="form-control" type="text"  placeholder="Enter Phone Number"    value={this.state.admin_PhoneNumber} onChange={(e)=>this.setState({admin_PhoneNumber:e.target.value})}/>
                  <span>Phone No</span>
              </label>
            </div>
            <div class="form-group input-group" style={{marginTop:"40px"}}>
                <label class="form-group has-float-label" style={{width:"100%"}}>
                    <select class="form-control custom-select" value={this.state.admin_Role} onChange={(e)=>this.setState({admin_Role:e.target.value})}>
                        <option disabled selected value="">Select an Option</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                    </select>
                    <span>Role</span>
                </label>
            </div>
            {/* <div class="form-group has-float-label m-lg-5 my-5" >
                <input class="form-control" id="name" type="text" value={this.state.admin_Name} onChange={(e)=>this.setState({admin_Name:e.target.value})}/>
                <label for="name">Name</label>
            </div>
            <div class="form-group has-float-label m-lg-5 my-5">
                <input class="form-control" id="email" type="email" value={this.state.admin_Email}   onChange={(e)=>this.setState({admin_Email:e.target.value})}/>
                <label for="email">E-mail</label>
            </div>
            <div class="form-group has-float-label m-lg-5 my-5">
                <input class="form-control" id="phone" type="text" value={this.state.admin_PhoneNumber} onChange={(e)=>this.setState({admin_PhoneNumber:e.target.value})}/>
                <label for="phone">Phone No</label>
            </div>
            <div class="form-group has-float-label m-lg-5 my-5">
                <input class="form-control" id="role" type="text" value={this.state.admin_Role} onChange={(e)=>this.setState({admin_Role:e.target.value})}/>
                <label for="role">Role</label>
            </div> */}
         </div>
         <Button className="px-4 mt-5 rounded-pill w-25" size="sm" onClick={()=>this.addNewAdmin()}>Submit</Button>
        </div>
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className='add-admin'
        centered
        show={this.state.updateModel}
        onHide={()=>this.setState({updateModel:false})}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Admin Role
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center ">
        <div className="add-Adimin-form text-center m-4">
        <div className="form_input_field ">
            <div class="form-group input-group" style={{marginTop:"20px"}}>
              <label class="has-float-label" style={{width:"100%"}}>
                  <input class="form-control" type="text"  placeholder="Enter Name"    value={this.state.admin_Name} onChange={(e)=>this.setState({admin_Name:e.target.value})}/>
                  <span>Name</span>
              </label>
            </div>
            <div class="form-group input-group" style={{marginTop:"40px"}}>
              <label class="has-float-label" style={{width:"100%"}}>
                  <input class="form-control" type="text"  placeholder="Enter Email"    value={this.state.admin_Email}   onChange={(e)=>this.setState({admin_Email:e.target.value})}/>
                  <span>E-mail</span>
              </label>
            </div>
            <div class="form-group input-group" style={{marginTop:"40px"}}>
              <label class="has-float-label" style={{width:"100%"}}>
                  <input class="form-control" type="text"  placeholder="Enter Phone Number"    value={this.state.admin_PhoneNumber} onChange={(e)=>this.setState({admin_PhoneNumber:e.target.value})}/>
                  <span>Phone No</span>
              </label>
            </div>
            <div class="form-group input-group" style={{marginTop:"40px"}}>
                <label class="form-group has-float-label" style={{width:"100%"}}>
                    <select class="form-control custom-select" placeholder="Select Role" value={this.state.admin_Role} onChange={(e)=>this.setState({admin_Role:e.target.value})}>
                        <option disabled selected value="">Select an Option</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                    </select>
                    <span>Role</span>
                </label>
            </div>
         </div>
         <Button className="px-4 mt-5 rounded-pill w-25" size="sm" onClick={()=>this.updateAdmin()}>Submit</Button>
        </div>
        </Modal.Body>
      </Modal>
      </>
    );
  }
}

export default AdminDetail;
