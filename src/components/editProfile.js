import React, { useState, useEffect } from "react";
import SideNav from "./SideNav";
import axios from "axios";
// import { useHistory } from "react-router-dom";
// import newProfileimage from '';
// import ImageCrop from "./ImageCrop";
import Button from "@material-ui/core/Button";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import getCroppedImg from "../utils/cropImage";
import dataURLtoFile from "../utils/dataURLtoFile";
import { BASE_URL } from "../config/config";
import { createHashHistory } from "history";
import './editProfile.css'
import DefaultImage from "../img/userprofile/default.png"
import { useNavigate, } from "react-router-dom";
import{ToastContainer} from "react-bootstrap";
import Toast from 'react-bootstrap/Toast'
const imgUrl = 'https://tidelpark.pannaiyarbiriyani.com/data/uploads/adminProfile/';

function EditProfile() {
    const navigate = useNavigate();

  const inputRef = React.useRef();
  const triggerFileSelectPopup = () => inputRef.current.click();
  const [succesToast, setSuccesToast] = useState(false);

  const [admin_Id, setAdmin_Id] = useState(""); 


  const [admin_Name, setAdmin_Name] = useState("");
  const [admin_Email, setAdmin_Email] = useState("");
  const [admin_PhoneNumber, setAdmin_PhoneNumber] = useState("");
  const [admin_Role, setAdmin_Role] = useState("");

  const [Profileimage, setProfileimage] = useState(null);
  const [newProfileimage, setnewProfileimage] = useState(null);
  const [CroppedImagefile, setCroppedImagefile] = React.useState(null);
  const [selectedFile, setselectedFile] = useState("");
  const [newcropimage, setnewcropimage] = useState(null);
  
  // const toggleShow = () => setSuccesToast(!succesToast);


  useEffect(() => {
    if(localStorage.getItem("admin_is_loggedin")  == 'true'){
    var admin = JSON.parse(localStorage.getItem("admin_login_details"));
    setnewProfileimage(DefaultImage);
    // console.log(localvar);
    if (admin) {
        setAdmin_Name(admin.admin_name)
        setAdmin_Id(admin.id)
        setAdmin_Email(admin.admin_email)
        setAdmin_PhoneNumber(admin.admin_phno)
        setAdmin_Role(admin.admin_role)
        if(admin.admin_profile!= "null"){
          setProfileimage(admin.admin_profile)
        }else{
          setnewProfileimage(DefaultImage)
        }
    }
  }else{
    navigate("/login");}
  }, []);

  const saveprofile = (e) => {
    axios
      .post(BASE_URL+ "/updateAdminProfile", {
       'name': admin_Name,
       'admin_id': admin_Id,
       'phone': admin_PhoneNumber,
       'profile': Profileimage
     })
      .then((res) => {
        var data = res.data[0];
        console.log(res.data[0]);
        localStorage.setItem("admin_login_details", JSON.stringify(data));
        setSuccesToast(true)
      });
  };


  const [cropDisplay, setcropDisplay] = React.useState("none");
  const [image, setImage] = React.useState(null);
  const [croppedArea, setCroppedArea] = React.useState(null);
  const [crop, setCrop] = React.useState({ x: 10, y: 10 });
  const [zoom, setZoom] = React.useState(1);
  const onCropComplete = (CroppedAreaPercentage, CroppedareaPixels) => {
    setCroppedArea(CroppedareaPixels);
  };
  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      // console.log("hi")
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener("load", () => {
        setImage(reader.result);
        setcropDisplay("flex");
      });
    }
  };

  const cropImage = async () => {
    const canvas = await getCroppedImg(image, croppedArea);
    const canvasDataurl = canvas.toDataURL("image/png");

    canvas.toBlob((file) => {
      setnewcropimage(URL.createObjectURL(file));
    });

    setcropDisplay("none");
    let newimagename = "PNBI" + Date.now() + ".png";
    axios
      .post("https://tidelpark.pannaiyarbiriyani.com/api/uploadimage.php", {
        image: canvasDataurl,
        image_name: newimagename,
        directory:'adminProfile'
      })
      .then((res) => {
        console.log(res);
        setProfileimage(newimagename);
      });
    setProfileimage(newimagename);
  };

  const cropCancel = () => {
    setcropDisplay("none");
  };

  return (
    <>
      <SideNav />

      <div className="main_body">
     
      
        <div className="edit_profile_body">
          <div className="edit_profile_container">
          <div class="row position-relative" style={{paddingTop:"20px",paddingBottom:"20px"}}>
                <ToastContainer position='top-end'>
                  <Toast onClose={() => setSuccesToast(false)} show={succesToast} delay={1500} autohide bg='success'>
                      {/* <Toast.Header>
                        <img
                          src="holder.js/20x20?text=%20"
                          className="rounded me-2"
                          alt=""
                        />
                        <strong className="me-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                      </Toast.Header> */}
                      <Toast.Body className='text-center'>Profile Updated Successfully</Toast.Body>
                    </Toast>  
                </ToastContainer> 
              <div className="col-sm-12 col-lg-4">
                <div className="edit_profile_image_container ">
                
                  <img
                    className="edit_profile_image_square"
                    // style={{backgroundImage: "url(/img/userprofile/PNBI1636538658668.png)"}}
                    src={
                      Profileimage === "" || Profileimage === null
                        ? newProfileimage
                        : newcropimage
                        ? newcropimage
                        : `${imgUrl}${Profileimage}`
                    }
                  />
                
                  <div className="edit_Edit_camera_icon">
                    <label for="file-up" id="up-label">
                      <i
                        className="fas fa-camera"
                        onClick={triggerFileSelectPopup}
                      ></i>
                    </label>
                    <input
                      type="file"
                      name="sampleFile"
                      hidden
                      // onChange={onFileChange}
                      ref={inputRef}
                      value={null}
                      onChange={(e)=>{onSelectFile(e);e.target.value = null}}
                      accept=".png, .jpg, .jpeg"
                    />
                  </div>
                  <div className="row">
              <div className="col-12 pc-view-save-btn" style={{display:"flex",justifyContent:"center"}} >
                <button className="Union-5" onClick={saveprofile}>
                  Save
                </button>
              </div>
            </div>
                </div>
              </div>
              <div
                className="image_container_crop"
                style={{
                  display: cropDisplay,
                }}
              >
                <div
                  className="img_crop_container"
                  style={{
                    height: "100%",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <div
                    className="img_crop_container_cropper"
                    style={{
                      height: "70%",
                      // width: "70%",
                      position: "relative",
                      marginTop: "10px",
                    }}
                  >
                    {image ? (
                      <>
                        <Cropper
                          image={image}
                          crop={crop}
                          zoom={zoom}
                          aspect={1 }
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          cropSize={{ width: 200, height: 200 }}
                        />
                        {/* <img
                          src={croppedArea}
                          style={{ width: "300px", height: "300px" }}
                        /> */}
                      </>
                    ) : null}
                  </div>
                  <div style={{ height: "10%" }}>
                    <Slider
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e, zoom) => setZoom(zoom)}
                    />
                  </div>
                  <div className="img_crop_container_buttons">
                    <Button
                      style={{ marginRight: "20px" }}
                      variant="contained"
                      color="primary"
                      onClick={cropImage}
                    >
                      Upload
                      <input
                        type="file"
                        accept=".png, .jpg, .jpeg, .pdf,.docx"
                        hidden
                      />
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={cropCancel}
                    >
                      Cancel
                      <input
                        type="file"
                        accept=".png, .jpg, .jpeg, .pdf,.docx"
                        // ref={inputRef}
                        hidden
                      />
                    </Button>
                  </div>
                </div>
              </div>
              

              <div class="col-sm-12 col-lg-8">
                <div className="row">
                  <div className="col-sm-12 col-lg-10">
                    <div class="form-group has-float-label m-lg-5 my-5" >
                        <input class="form-control" id="name" type="text" value={admin_Name} onChange={(e)=>setAdmin_Name(e.target.value)}/>
                        <label for="name">Name</label>
                    </div>
                    <div class="form-group has-float-label m-lg-5 my-5" style={{PointerEvent:'none'}}>
                        <input class="form-control" id="email" type="email" value={admin_Email}   readOnly/>
                        <label for="email">E-mail</label>
                    </div>
                    <div class="form-group has-float-label m-lg-5 my-5">
                        <input class="form-control" id="phone" type="text" value={admin_PhoneNumber} onChange={(e)=>setAdmin_PhoneNumber(e.target.value)}/>
                        <label for="phone">Phone No</label>
                    </div>
                    <div class="form-group has-float-label m-lg-5 my-5" style={{PointerEvent:'none'}}>
                        <input class="form-control" id="role" type="text" value={admin_Role} readOnly/>
                        <label for="role">Role</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 mobile-view-save-btn position-relative" >
                <button className="Union-5" onClick={saveprofile}>
                  Save
                </button>
                <ToastContainer position='top-end' className='px-3'>
                  <Toast onClose={() => setSuccesToast(false)} show={succesToast} delay={1500} autohide bg='success'>
                      {/* <Toast.Header>
                        <img
                          src="holder.js/20x20?text=%20"
                          className="rounded me-2"
                          alt=""
                        />
                        <strong className="me-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                      </Toast.Header> */}
                      <Toast.Body className='text-center'>Profile Updated Successfully</Toast.Body>
                    </Toast>  
                </ToastContainer> 
              </div>
            </div>

          </div>
        </div>
      </div>
        
    </>
  );
}

export default EditProfile;
