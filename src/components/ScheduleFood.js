import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";

import SideNav from "./SideNav";
import "./Dashboard.css";
import "./adminDetail.scss";

import { BASE_URL } from "../config/config";
import axios from "axios";
import { Modal ,Button } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaArrowLeft, FaCameraRetro } from "react-icons/fa";



// import
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import getCroppedImg from "../utils/cropImage";
import ToggleButton from "react-toggle-button";

import Calendar from 'react-calendar';
import DatePicker from 'react-date-picker';
import MultiDatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon"


import 'react-calendar/dist/Calendar.css';
import "./Calendar.css";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";

import Select from 'react-select'
import makeAnimated from 'react-select/animated';

function ScheduleFood() {
  const [ticketAlldata, setTicketAlldata] = useState([]);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [errorTost, setErrorTost] = useState("");
  const [successTost, setSuccessTost] = useState("");
  const [message, setmessage] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showCropModel, setShowCropModel] = useState(false);
  const [showNextTicketModel, setshowNextTicketModel] = useState(false);
  const [showUpdateBasicsModel, setShowUpdateBasicsModel] = useState(false);
  const [state, setState] = useState({ ParentOn: false });

  const [slideImages, setSlideImages] = useState([])
  const [loader, setLoader] = useState(false);

  const [showDeletedTable,setShowDeletedTable] = useState(false);
  const [showDeleteConformModal,setShowDeleteConformModal] = useState(false) 
  const [deleteTicketId,setDeleteTicketId] = useState('')
  // Create Ticket
  const [ticketName, setTicketName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketFoodName, setTicketFoodName] = useState("");
  const [discountType, setDiscountType] = useState("No");
  // const [discountPrice, setdiscountPrice] = useState("");
  // Create Ticke
  const [dayTime, setDayTime] = useState("");
  const [updateTicketId, setUpdateTicketId] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  // NextTicketPage
  const [repeatTicket, setRepeatTicket] = useState("");
  const [repeatNoParticularDate, setrepeatNoParticularDate] = useState(new Date().toString());
  const [repeatYesParticularDateMonthly, setrepeatYesParticularDateMonthly] = useState(new Date().toString());
  const [repeatYesParticularDateYearly, setrepeatYesParticularDateYearly] = useState(new Date().toString());
  const [holidays, setHolidays] = useState([])
  const [repeatYesParticularDate, setrepeatYesParticularDate] = useState("");
  const [repeatby, setRepeatBy] = useState("");
  const [redeemtype, setRedeemtype] = useState("");
  const [redeemTime, setRedeemTime] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState("");
  const [quantity, setQuantity] = useState("No");
  const [quantityCount, setQuantityCount] = useState("");
  const [DeadlinePeriod, setDeadlinePeriod] = useState("");
  const [BookBefore, setBookBefore] = useState("");
  const [BookBeforeDuration, setBookBeforeDuration] = useState("");
  // NextTicketPage
  const [dbticketId, setticketId] = useState("");
  const [dbticketName, setticketName] = useState(24);

  const [imageSrc, setImageSrc] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropedImage, setCropedImage] = useState('https://appfood.co/foodordering/img/bg/defimage.jpg');
  const [croppedArea, setCroppedArea] = React.useState(null);
  const [ticketimage, setTicketimage] = useState();

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
    setCroppedArea(croppedAreaPixels);
  }, []);

  const cropImage = async () => {
    const canvas = await getCroppedImg(imageSrc, croppedArea, { width: 600, height: 450 });
    const canvasDataurl = canvas.toDataURL("image/png");

    canvas.toBlob((file) => {
      setCropedImage(URL.createObjectURL(file));
    });

    // setcropDisplay("none");
    setLoader(true)
    let newimagename = "PNBI_TICKET" + Date.now() + ".png";
    axios
      .post("https://pannaiyarbiriyani.com/api/profileImage/index.php", {
        image: canvasDataurl,
        image_name: newimagename,
      })
      .then((res) => {
        console.log(res);
        // setTicketimage(newimagename);
        let images = slideImages
        images.push(newimagename)
        setSlideImages(images)
        setLoader(false)
      });
    // let images = slideImages
    // images.push(newimagename)
    // setSlideImages(images)
    setTicketimage(newimagename);
    setShowCropModel(false)
  };

  useEffect(() => {
    getTicketData()
  }, []);

  const searchData = (e) => {
    const val = e.target.value;
    // const { data } = this.state;
    // console.log(val.toLowerCase());
    const temp = data.filter((value) => {
      return (
        value.ticketName.toLowerCase().includes(val.toLowerCase()) ||
        value.Day.toLowerCase().includes(val.toLowerCase()) ||
        value.IType.toLowerCase().includes(val.toLowerCase()) || 
        value.TicketId.toLowerCase().includes(val.toLowerCase())
      );
    });
    console.log(temp);
    setFilterData(temp);
  };

  const fileSelect = (event) => {
    // console.log(e.target)

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.addEventListener("load", () => {
      console.log(reader.result);
      setImageSrc(reader.result);
      // setcropDisplay("flex");
      setShowCropModel(true);
    });
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };


  // Api 
  const getTicketData = () => {
    let ticketData = [];
    let allData = [];
    axios.get(BASE_URL + "/tickets/all").then((res) => {
      res.data.data.basics.map((baseData, key) => {
        let ticket = {
          sno: ticketData.length + 1,
          ticketName: baseData.ticket_name,
          Day: "-",
          IType: baseData.item_type,
          RPrice: baseData.sale_price,
          SPrice: baseData.discount == 1 ? baseData.discount_price : "-",
          MealsTime: "-",
          InStock: "-",
          FoodName: baseData.item_name,
          TicketId: baseData.ticket_id,
          isPublish: false,
          updatedData: {},
          discount: baseData.discount,
          ticketImages: baseData.image != null ? JSON.parse(baseData.image) : '',
          Both: false
        }
        res.data.data.characteristics.map((charData, key) => {
          if (baseData.ticket_id == charData.ticket_id) {
            ticket['MealsTime'] = charData.meal_time
            ticket['Day'] = charData.is_repeat == 1 ? charData.repeat_by : "No Repeat"
            ticket['InStock'] = charData.is_limited == 1 ? charData.limited_quantity_count : 'Unlimited'
            ticket['isPublish'] = charData.is_published == 1 ? true : false
            ticket.updatedData = { baseData: baseData, charData: charData }
            ticket.Both = true
            ticket['deleted'] = charData.is_deleted 
          }
        });
          ticketData.push(ticket)
      });
      setData(ticketData);
      setFilterData(ticketData)
      setTicketAlldata(allData)
    });
  }

  const saveNewTicket = () => {

    if (ticketName != "" && discountType != "" && regularPrice != "" && ticketDescription != "" && ticketType != "" && ticketFoodName != "" && cropedImage != "") {
      const ticketData = {
        "ticketName": ticketName,
        "itemName": ticketFoodName,
        "about": ticketDescription,
        "image": JSON.stringify(slideImages),
        "itemType": ticketType,
        "salePrice": Number(regularPrice),
        "discount": discountType == "Yes" ? true : false,
        "discountPrice": discountType == "Yes" ? Number(salePrice) : null
      }
      addNewTicket(ticketData)
    } else {
      toast.error("All Field Data Requied", {
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

  const addNewTicket = (ticketData) => {
    axios
      .post(BASE_URL + "/tickets/addNewTicket", ticketData)
      .then((res) => {
        console.log(res);
        if (res.data.status == "200") {
          console.log(res.data.data)
          setticketId(res.data.data.ticketId);
          setticketName(res.data.data.ticketName)
          getTicketData()
          resetState()
          setShowModel(false)
          setshowNextTicketModel(true)
          // toast.success("Ticket Added Successfully", {
          //   position: "top-right",
          //   autoClose: 1500,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          // });
        }
        else {
          toast.error(res.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  }
  const saveNextTicketData = () => {

    const ticketData = {
      "ticketId": dbticketId,
      "isRepeat": repeatTicket == "Yes" ? true : false,
      "particularDay": repeatTicket == "Yes" ? null : repeatNoParticularDate,
      "repeatBy": repeatTicket == "Yes" ? repeatby : null,
      "weeklyDay": repeatTicket == "Yes" ? repeatWeekly : null,
      "monthlyDate": repeatTicket == "Yes" ? repeatYesParticularDateMonthly : null,
      "yearlyDate": repeatTicket == "Yes" ? repeatYesParticularDateYearly : null,
      "holidays": JSON.stringify(holidays),
      "redeemValidity": redeemtype,
      "deadlinePeriod": redeemtype == "Deadline" ? DeadlinePeriod : null,
      "mealTime": redeemTime,
      "bookBefore": BookBefore == "Yes" ? true : false,
      "beforeTime": BookBefore == "Yes" ? Number(BookBeforeDuration) : null,
      "isLimited": quantity == "limited" ? true : false,
      "limitedQuantityCount": quantity == "limited" ? Number(quantityCount) : null,
      "isPublish": false
    }
    axios
      .post(BASE_URL + "/tickets/addTicketCharacteristics", ticketData)
      .then((res) => {
        console.log(res);
        if (res.data.status == "200") {
          console.log(res.data.data)

          getTicketData()
          resetState()

          setshowNextTicketModel(false)
          toast.success("Ticket Added Successfully", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        else {
          toast.error(res.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  }

  const UpdateTicketData = () => {

    const ticketData = {
      "ticketId": dbticketId,
      "isRepeat": repeatTicket == "Yes" ? true : false,
      "particularDay": repeatTicket == "Yes" ? null : repeatNoParticularDate,
      "repeatBy": repeatTicket == "Yes" ? repeatby : null,
      "weeklyDay": repeatTicket == "Yes" ? repeatWeekly : null,
      "monthlyDate": repeatTicket == "Yes" ? repeatYesParticularDateMonthly : null,
      "yearlyDate": repeatTicket == "Yes" ? repeatYesParticularDateYearly : null,
      "holidays": JSON.stringify(holidays),
      "redeemValidity": redeemtype,
      "deadlinePeriod": redeemtype == "Deadline" ? DeadlinePeriod : null,
      "mealTime": redeemTime,
      "bookBefore": BookBefore == "Yes" ? true : false,
      "beforeTime": BookBefore == "Yes" ? Number(BookBeforeDuration) : null,
      "isLimited": quantity == "limited" ? true : false,
      "limitedQuantityCount": quantity == "limited" ? Number(quantityCount) : null,
      "isPublish": false
    }

    axios.put(BASE_URL + "/tickets/updateTicketCharacteristics",
      ticketData
    ).then((res) => {
      if (res.data.status == "200") {
        getTicketData()
        resetState()
        setShowUpdateModel(false)
        toast.success("Ticket updated Successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else {
        toast.error(res.data.message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
    //  setShowModel(false)
  }

  const showUpdate = (data) => {
    if (data.original.Both) {
      console.log("Edit", data)
      let value = data.original.updatedData.charData
      setticketId(data.original.TicketId)
      setRepeatTicket(value.is_repeat == 1 ? "Yes" : "No")
      setrepeatNoParticularDate(value.particular_day != "" ? new Date(value.particular_day) : '')
      setRepeatBy(value.repeat_by != "" ? value.repeat_by : '')
      setRepeatWeekly(value.weekly_day != "" ? value.weekly_day : '')
      setrepeatYesParticularDateMonthly(value.monthly_date != "" ? new Date(value.monthly_date) : '')
      setrepeatYesParticularDateYearly(value.yearly_date != "" ? new Date(value.yearly_date) : '')
      setRedeemtype(value.redeem_validity != "" ? value.redeem_validity : '')
      setDeadlinePeriod(value.deadline_period != "" ? value.deadline_period : '')
      setRedeemTime(value.meal_time != "" ? value.meal_time : '')
      setBookBefore(value.book_before == 1 ? "Yes" : "No")
      setBookBeforeDuration(value.before_time != "" ? value.before_time : '')
      setQuantity(value.is_limited == 1 ? "limited" : "unlimited")
      setQuantityCount(value.limited_quantity_count != "" ? value.limited_quantity_count : '')
      setShowUpdateModel(true)
    } else {
      console.log("Edit", data)
      setticketId(data.original.TicketId)
      setshowNextTicketModel(true)
    }
  }

  const showUpdateBasics = (ticketId) => {
    console.log("Edit", ticketId)
    // let value = data.original.updatedData.charData
    data.map(ticket => {
      console.log(ticket)
      if (ticket.TicketId == ticketId) {
        setTicketName(ticket.ticketName)
        setTicketFoodName(ticket.FoodName)
        setTicketType(ticket.IType)
        setTicketimage(ticket.ticketImages)
        setSlideImages(ticket.ticketImages)
        setDiscountType(ticket.discount == 1 ? 'Yes' : 'No')
        setTicketDescription(ticket.updatedData.baseData.about)
        setRegularPrice(ticket.RPrice)
        setSalePrice(ticket.SPrice)
        setShowUpdateBasicsModel(true)
        setshowNextTicketModel(false)
      }
    })
  }

  const saveUpdateTicketBasics = () => {

    if (ticketName != "" && discountType != "" && regularPrice != "" && ticketDescription != "" && ticketType != "" && ticketFoodName != "" && slideImages.length > 0) {
      const ticketData = {
        "ticketId": dbticketId,
        "ticketName": ticketName,
        "itemName": ticketFoodName,
        "about": ticketDescription,
        "image": JSON.stringify(slideImages),
        "itemType": ticketType,
        "salePrice": Number(regularPrice),
        "discount": discountType == "Yes" ? true : false,
        "discountPrice": discountType == "Yes" ? Number(salePrice) : null
      }

      axios
        .put(BASE_URL + "/tickets/updateTicketBasics", ticketData)
        .then((res) => {
          console.log(res);
          if (res.data.status == "200") {
            getTicketData()
            // resetState()
            setShowUpdateBasicsModel(false)

            // toast.success("Ticket Updated Successfully", {
            //   position: "top-right",
            //   autoClose: 1500,
            //   hideProgressBar: false,
            //   closeOnClick: true,
            //   pauseOnHover: true,
            //   draggable: true,
            //   progress: undefined,
            // });
          }
          else {
            toast.error(res.data.message, {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });

    } else {
      toast.error("All Field Data Requied", {
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

  const deleteSlideImage = (index) => {
    let images = [...slideImages]
    if (images.pop(index, 1)) {
      toast.success('Image Deleted, press continue to save', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setSlideImages(images)
    }

    // images
  }
  const deleteTicket = () => {
    const ticketId = deleteTicketId
    if(deleteTicketId){
      axios.delete(BASE_URL + "/tickets/deleteTicket/" + ticketId, {
        'ticketId': ticketId
      }).then((res) => {
        var data = res.data[0];
        setDeleteTicketId('')
        console.log(res)
        setShowDeleteConformModal(false)
        getTicketData()
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }).catch(err => {
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
      toast.error('Select correct deleting ticket', {
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

  const resetState = () => {

    setrepeatNoParticularDate('')
    setrepeatYesParticularDateMonthly('')
    setrepeatYesParticularDateYearly('')
    setRepeatBy('')
    setRedeemtype('')
    setRedeemTime('')
    setRepeatWeekly('')
    setQuantity('')
    setQuantityCount('')
    setDeadlinePeriod('')
    setBookBefore('')
    setBookBeforeDuration('')
    // NextTicketPage
    setUpdateTicketId('')
    setticketName('')
    setSlideImages([])
    setHolidays([])

  }

  const isPublish = (data) => {
    console.log(data.Both)
    if (data.Both) {
      axios.put("http://192.168.0.109:3003/tickets/publish/" + data.TicketId, {
        'publish': !data.isPublish
      }).then((res) => {
        if (res.data.status == "200") {
          getTicketData();
        } else {
          toast.error(res.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
    } else {
      toast.error('Ticket Not Completed', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const handleSetName = (value) => {
    if (value.length <= 20) {
      setTicketName(value)
    } else {
      toast.dismiss();
      toast.error('Ticket Name maximum 20 charecters', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  let  tableData= []
  let  deletedtableData = []
  filterData.map(data =>{
    if(data.deleted == 1){
      data.sno = deletedtableData.length + 1
      deletedtableData.push(data)
    }else{
      data.sno = tableData.length + 1
      tableData.push(data)
    }
  })

  const columns = [
    {
      Header: "Serial No",
      accessor: "sno",
    },
    {
      Header: "Ticket Id",
      accessor: "TicketId",
    },
    {
      Header: "Ticket Name",
      accessor: "ticketName",
    },
    {
      Header: "Food Name",
      accessor: "FoodName",
    },
    {
      Header: "Repeat",
      accessor: "Day",
    },
    {
      Header: "Meals Time",
      accessor: "MealsTime",
    },
    {
      Header: "Item Type",
      accessor: "IType",
    },
    {
      Header: "Stock Count",
      accessor: "InStock",
    },
    {
      Header: "Regular Price",
      accessor: "RPrice",
    },
    {
      Header: "Sale Price",
      accessor: "SPrice",
    },
    {
      Header: "Action",
      accessor: "TicketId",
      Cell: (data) => (
        <div className="d-flex w-100 justify-content-around">
          <FaTrashAlt
            onClick={() => {setDeleteTicketId(data.value);setShowDeleteConformModal(true)}}
            color="red"
            size={20}
            style={{ cursor: "pointer" }}
          />
          <FaEdit
            onClick={() => showUpdate(data)}
            size={20}
            color="#5773ff"
            style={{ cursor: "pointer" }}
          />
        </div>
      ),

    },
    {
      Header: "Publish",
      accessor: "isPublish",
      Cell: (data) => (
        <div className="d-flex w-100 justify-content-around" style={{ cursor: "pointer" }}>
          <ToggleButton
            value={data.value}
            onClick={() => { isPublish(data.original); console.log(data.original) }}
          />
        </div>
      ),

    },
  ];

  const deletedDataColumns = [
    {
      Header: "Serial No",
      accessor: "sno",
    },
    {
      Header: "Ticket Id",
      accessor: "TicketId",
    },
    {
      Header: "Ticket Name",
      accessor: "ticketName",
    },
    {
      Header: "Food Name",
      accessor: "FoodName",
    },
    {
      Header: "Repeat",
      accessor: "Day",
    },
    {
      Header: "Meals Time",
      accessor: "MealsTime",
    },
    {
      Header: "Item Type",
      accessor: "IType",
    },
    {
      Header: "Stock Count",
      accessor: "InStock",
    },
    {
      Header: "Regular Price",
      accessor: "RPrice",
    },
    {
      Header: "Sale Price",
      accessor: "SPrice",
    }
  ];

  const options = [
    { value: 'Sunday', label: 'Sunday' },
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' }
  ]


  const weeklyOptions = [
    { value: 1, label: `1st ${repeatWeekly}` },
    { value: 2, label: `2nd ${repeatWeekly}` },
    { value: 3, label: `3rd ${repeatWeekly}` },
    { value: 4, label: `4th ${repeatWeekly}` },
  ]

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'black',
      padding: 10,
      backgroundColor:'transparent',
      textAlign: 'start'
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor:'transparent',
      padding:5,
      borderWidth:'0.05em',
      borderColor:'#fff !important',
      boxShadow:'none'
    }),
    
    menu:(provided, state) => ({
      ...provided,
      zIndex:12222,
      width: '50%',
    }),
    menuList:(provided, state) => ({
      ...provided,
      backgroundColor:'#ffffff'
      
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    },
    valueContainer:(provided, state) => ({
      ...provided,
      justifyItems:'start'
    }),
  }

  const handleHolidaysDW = (selectedOptions) =>{
    let holiday = []
    selectedOptions.map(day =>{
      holiday.push(day.value)
    })
    setHolidays(holiday)
  }

  const handleHolidaysMY = (selectedOptions) =>{
    let holiday = []
    selectedOptions.map(option =>{
       holiday.push(option.toString())
    })
    setHolidays(holiday)
  }

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
                Search :{" "}
                <input
                  type="text"
                  onChange={(e) => {
                    searchData(e);
                  }}
                  placeholder="Search here"
                  className="input search-by"
                />
              </div>

              {/* <select name="cars" id="cars" className="input filter-by" onChange={(e)=>{this.filterSelected(e)}}>
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Redeemed">Redeemd</option>
                  <option value="Expired">Expired</option>
                </select> */}
                <div className="filter-btns">
                <input
                type="button"
                value={ showDeletedTable ? 'Hide Deleted Tickets' : 'Show Deleted Tickets'}
                onClick={() => {setShowDeletedTable(!showDeletedTable)}}
                className="input add-btn"
                style={{ width: "unset" }}
              />{"  "}{"  "}
              <input
                type="button"
                value="Add New Ticket"
                onClick={() => {
                  setTicketName("");
                  setSalePrice("");
                  setRegularPrice("");
                  setTicketDescription("");
                  setTicketType("");
                  setTicketFoodName("");
                  setDiscountType("No");
                  setrepeatNoParticularDate('')
                  setrepeatYesParticularDateMonthly('')
                  setrepeatYesParticularDateYearly('')
                  setRepeatBy('')
                  setRedeemtype('')
                  setRedeemTime('')
                  setRepeatWeekly('')
                  setQuantity('')
                  setQuantityCount('')
                  setDeadlinePeriod('')
                  setBookBefore('')
                  setBookBeforeDuration('')
                  // NextTicketPage
                  setUpdateTicketId('')
                  setticketName('')
                  setHolidays([])
                  setSlideImages([])
                  setShowModel(true)
                }}
                className="input add-btn"
                style={{ width: "unset" }}
              />
              </div>
            </div>

          { showDeletedTable ? 
            <ReactTable
            data={deletedtableData}
            columns={deletedDataColumns}
            defaultPageSize={10}
            // pageSizeOptions={[10, 20, 50]}
            previousText=" ❰❰ "
            nextText=" ❱❱ "
            pageText=""
            ofText="/ "
          // filterable={true}
          />:<ReactTable
              data={tableData}
              columns={columns}
              defaultPageSize={10}
              // pageSizeOptions={[10, 20, 50]}
              previousText=" ❰❰ "
              nextText=" ❱❱ "
              pageText=""
              ofText="/ "
            // filterable={true}
            />
            }
          </div>
        </div>
      </div>
      {/* Create ticket */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-admin"
        centered
        show={showModel}
        onHide={() => setShowModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add New Ticket
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center ">
          <div className="add-Adimin-form text-center m-4">
            <div className="form_input_field ">
              <div class="form-group input-group" style={{ marginTop: "20px" }}>
                <label class="has-float-label" style={{ width: "100%" }}>
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Enter Item Name"
                    value={ticketName} onChange={(e) => handleSetName(e.target.value)}
                  />
                  <span>Ticket Name</span>
                </label>
              </div>
              <div class="form-group input-group" style={{ marginTop: "20px" }}>
                <label class="has-float-label" style={{ width: "100%" }}>
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Enter Item Name"
                    value={ticketFoodName} onChange={(e) => setTicketFoodName(e.target.value)}
                  />
                  <span>Food Name</span>
                </label>
              </div>

              {/* <div class="form-group input-group" >
              <label class="has-float-label" style={{width:"100%"}}>
                  <span>Photo</span>
              </label>
            </div> */}

              <div className="cover-img">
                <label className="lable mb-2">Ticket Cover Image</label>
                <div className="cover-image-container">
                  <div className="upload-image">
                    <label htmlFor="fileToUpload" className="fileUpload">
                      <div
                        class="profile-pic"
                        style={{
                          backgroundImage:
                            `url(${cropedImage})`,
                        }}
                      >
                        {loader ? <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div> : <></>}
                        <span style={{ padding: "10px" }}>
                          {" "}
                          <FaCameraRetro style={{ fontSize: "20px" }} />{" "}
                        </span>
                        <span>Add Image</span>
                      </div>
                    </label>
                    <input
                      type="File"
                      name="fileToUpload"
                      id="fileToUpload"
                      onChange={(e) => fileSelect(e)}
                    />
                  </div>
                  {slideImages.length > 0 ?
                    <div className="slide-image">
                      <Carousel showThumbs={true}>
                        {slideImages.length > 0 ?
                          slideImages.map((image, key) => {
                            console.log(key, image)
                            return (
                              <div>
                                <img src={"https://pannaiyarbiriyani.com/user/demo/img/userprofile/" + image} />
                                {/* <p className="legend">Legend 1</p> */}
                                <div className="delete-image" onClick={() => deleteSlideImage(key)}><FaTrashAlt color="red" size={20} style={{ cursor: "pointer" }} /></div>
                              </div>)
                          }) : <></>
                        }

                      </Carousel>
                    </div> : <></>}
                </div>
              </div>

              <div class="form-group input-group">
                <label
                  class="form-group has-float-label"
                  style={{ width: "100%" }}
                >
                  <select class="form-control custom-select" value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
                    <option disabled selected value="">Select an Option</option>
                    <option value="veg">Veg</option>
                    <option value="nonveg">Non-Veg</option>
                  </select>
                  <span>Type</span>
                </label>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group ">
                    <label class="has-float-label" style={{ width: "100%" }}>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Enter Price"
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(e.target.value)}
                      />
                      <span>Regular Price</span>
                    </label>
                  </div>
                </div>

              </div>

              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group">
                    <label
                      class="form-group has-float-label"
                      style={{ width: "100%" }}
                    >
                      <select
                        class="form-control custom-select"
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>


                      </select>
                      <span>Discount Price</span>
                    </label>
                  </div>
                </div>
                {discountType == "Yes" ?
                  <div className="col-md-6">
                    <div class="form-group input-group col-md-6">
                      <label class="has-float-label" style={{ width: "100%" }}>
                        <input
                          class="form-control"
                          type="text"
                          placeholder="Enter Discount Price"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                        />
                        <span>Discount Price</span>
                      </label>
                    </div>
                  </div> : (
                    ""
                  )}
              </div>

              <div class="form-group input-group">
                <label class="has-float-label" style={{ width: "100%" }}>
                  <textarea
                    class="form-control"
                    type="text"
                    placeholder="Enter Discription"
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                  />
                  <span>About</span>
                </label>
              </div>
            </div>

            <button
              className="px-4 mt-5 rounded-pill w-25"
              size="sm"
              style={{ backgroundColor: '#5773ff', padding: '5px', border: 'none' }}
              onClick={() => saveNewTicket()}
            >
              continue
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Create ticket */}

      {/* Edit Ticket Basics */}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-admin"
        centered
        show={showUpdateBasicsModel}
        onHide={() => setShowUpdateBasicsModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Ticket
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center ">
          <div className="add-Adimin-form text-center m-4">
            <div className="form_input_field ">
              <div class="form-group input-group" style={{ marginTop: "20px" }}>
                <label class="has-float-label" style={{ width: "100%" }}>
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Enter Item Name"
                    value={ticketName} onChange={(e) => handleSetName(e.target.value)}
                  />
                  <span>Ticket Name</span>
                </label>
              </div>
              <div class="form-group input-group" style={{ marginTop: "20px" }}>
                <label class="has-float-label" style={{ width: "100%" }}>
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Enter Item Name"
                    value={ticketFoodName} onChange={(e) => setTicketFoodName(e.target.value)}
                  />
                  <span>Food Name</span>
                </label>
              </div>

              {/* <div class="form-group input-group" >
              <label class="has-float-label" style={{width:"100%"}}>
                  <span>Photo</span>
              </label>
            </div> */}

              <div className="cover-img">
                <label className="lable mb-2">Ticket Cover Image</label>
                <div className="cover-image-container">
                  <div className="upload-image">
                    <label htmlFor="fileToUpload" className="fileUpload">
                      <div
                        class="profile-pic"
                        style={{
                          backgroundImage:
                            `url(${cropedImage})`,
                        }}
                      >
                        {loader ? <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div> : <></>}
                        <span style={{ padding: "10px" }}>
                          {" "}
                          <FaCameraRetro style={{ fontSize: "20px" }} />{" "}
                        </span>
                        <span>Add Image</span>
                      </div>
                    </label>
                    <input
                      type="File"
                      name="fileToUpload"
                      id="fileToUpload"
                      onChange={(e) => fileSelect(e)}
                    />
                  </div>
                  {slideImages.length > 0 ?
                    <div className="slide-image">
                      <Carousel showThumbs={true}>
                        {slideImages.length > 0 ?
                          slideImages.map((image, key) => {
                            console.log(key, image)
                            return (
                              <div>
                                <img src={"https://pannaiyarbiriyani.com/user/demo/img/userprofile/" + image} />
                                {/* <p className="legend">Legend 1</p> */}
                                <div className="delete-image" onClick={() => deleteSlideImage(key)}><FaTrashAlt color="red" size={20} style={{ cursor: "pointer" }} /></div>
                              </div>)
                          }) : <></>
                        }

                      </Carousel>
                    </div> : <></>}
                </div>
              </div>

              <div class="form-group input-group">
                <label
                  class="form-group has-float-label"
                  style={{ width: "100%" }}
                >
                  <select class="form-control custom-select" value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
                    <option disabled selected value="">Select an Option</option>
                    <option value="veg">Veg</option>
                    <option value="nonveg">Non-Veg</option>
                  </select>
                  <span>Type</span>
                </label>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group ">
                    <label class="has-float-label" style={{ width: "100%" }}>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Enter Price"
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(e.target.value)}
                      />
                      <span>Regular Price</span>
                    </label>
                  </div>
                </div>

              </div>

              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group">
                    <label
                      class="form-group has-float-label"
                      style={{ width: "100%" }}
                    >
                      <select
                        class="form-control custom-select"
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>


                      </select>
                      <span>Discount Price</span>
                    </label>
                  </div>
                </div>
                {discountType == "Yes" ?
                  <div className="col-md-6">
                    <div class="form-group input-group col-md-6">
                      <label class="has-float-label" style={{ width: "100%" }}>
                        <input
                          class="form-control"
                          type="text"
                          placeholder="Enter Discount Price"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                        />
                        <span>Discount Price</span>
                      </label>
                    </div>
                  </div> : (
                    ""
                  )}
              </div>

              <div class="form-group input-group">
                <label class="has-float-label" style={{ width: "100%" }}>
                  <textarea
                    class="form-control"
                    type="text"
                    placeholder="Enter Discription"
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                  />
                  <span>About</span>
                </label>
              </div>
            </div>

            <button
              className="px-4 mt-5 rounded-pill w-25"
              size="sm"
              style={{ backgroundColor: '#5773ff', padding: '5px', border: 'none' }}
              onClick={() => saveUpdateTicketBasics()}
            >
              continue
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Ticket Basics */}

      {/* Edit Profile */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-admin"
        centered
        show={showUpdateModel}
        onHide={() => setShowUpdateModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Ticket
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center ">
          <button className="px-2 rounded-pill " size="sm" style={{ backgroundColor: 'transparent', width: '100px', color: '#5773ff', padding: '5px', border: 'none', cursor: "pointer", fontSize: '20px', fontWeight: 'bold' }} onClick={() => showUpdateBasics(dbticketId)}>
            <FaArrowLeft /> Back
          </button>
          <form onSubmit={() => UpdateTicketData()} className="add-Adimin-form text-center  m-4">
            <div className="form_input_field ">
              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group">
                    <label
                      class="form-group has-float-label"
                      style={{ width: "100%" }}
                    >
                      <select required
                        class="form-control custom-select"
                        value={repeatTicket}
                        onChange={(e) => { setRepeatTicket(e.target.value); setRepeatBy(""); setRepeatWeekly(''); setrepeatYesParticularDateMonthly(''); setRepeatBy(""); setrepeatYesParticularDateYearly(''); setrepeatNoParticularDate(''); setRedeemtype('') }}
                      >
                        <option disabled selected value="">Select an Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>

                      </select>
                      <span>Repeat</span>
                    </label>
                  </div>
                </div>
                {repeatTicket == "No" ? (
                  <div className="col-md-6">
                    <div class="form-group input-group col-md-6">
                      <label class="has-float-label" style={{ width: "100%" }}>
                        {/* <input
                          class="form-control"
                          type="date"
                          placeholder="Count"
                          value={repeatNoParticularDate}
                          onChange={(e) => setrepeatNoParticularDate(e.target.value)}
                        /> */}
                        <DatePicker format={'dd / MM / yyyy'} dayPlaceholder='DD' monthPlaceholder='MM' yearPlaceholder='YYYY'  /* minDate={new Date()} */ onChange={(value) => setrepeatNoParticularDate(new Date(value).toString())} value={repeatNoParticularDate != '' ? new Date(repeatNoParticularDate) : new Date()} />
                        <span>Date</span>
                      </label>
                    </div>
                  </div>
                ) : repeatTicket == "Yes" ? (
                  <div className="col-md-6">
                    <div class="form-group input-group">
                      <label
                        class="form-group has-float-label"
                        style={{ width: "100%" }}
                      >
                        <select required
                          class="form-control custom-select"
                          value={repeatby}
                          onChange={(e) => { setRepeatBy(e.target.value); setRepeatWeekly(''); setrepeatYesParticularDateMonthly(''); setrepeatYesParticularDateYearly('') }}
                        >
                          <option disabled selected value="">
                            Select an Option
                          </option>
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Yearly">Yearly</option>

                        </select>
                        <span>Repaet by</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* const weekDays = ['monday','tuesday','wednesday','thursday','friday','saturday'] */}
              {repeatby == "Daily" ?
                <div class="form-group input-group">
                  <label
                    class="form-group has-float-label"
                    style={{ width: "100%" }}
                  >
                    <Select styles={customStyles} options={options} isMulti={true} onChange={value => handleHolidaysDW(value)}/>
                    <span>Holidays</span>
                  </label>
                </div> : <></>}
              {repeatby == "Weekly" ?
                <div class="form-group input-group">
                  <label
                    class="form-group has-float-label"
                    style={{ width: "100%" }}
                  >
                    <select class="form-control custom-select" value={repeatWeekly} onChange={(e) => setRepeatWeekly(e.target.value)} required>
                      <option disabled selected value="">Select an Option</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    <span>Week Days</span>
                  </label>
                </div> : <></>}
                {repeatby == "Weekly" && repeatWeekly ?
                <div class="form-group input-group">
                  <label
                    class="form-group has-float-label"
                    style={{ width: "100%" }}
                  >
                    <Select styles={customStyles} options={weeklyOptions} isMulti={true} onChange={value => handleHolidaysDW(value)}/>
                    <span>Holidays Weekly</span>
                  </label>
                </div> : <></>}
                
              {(repeatby == "Monthly") ?
                <div class="form-group input-group">
                  <label class="has-float-label" style={{ width: "100%" }}>
                    <DatePicker format={'dd / MM / yyyy'} dayPlaceholder='DD' monthPlaceholder='MM' yearPlaceholder='YYYY'  /* minDate={new Date()} */ onChange={(value) => setrepeatYesParticularDateMonthly(new Date(value).toString())} value={repeatYesParticularDateMonthly != '' ? new Date(repeatYesParticularDateMonthly) : new Date()} />
                    <span>Date</span>
                  </label>
                </div> : <></>}
                {(repeatby == "Monthly") ?
                <div class="form-group input-group">
                  <label class="has-float-label" style={{ width: "100%" }}>
              
                    <MultiDatePicker class="form-control" placeholder="Select Months"  editable onlyMonthPicker  format="M" hideYear   buttons={false}  render={<InputIcon/>} multiple  onChange={(value) => {handleHolidaysMY(value); console.log(value)}} value=''  arrow={false}/>
                    <span>Holidays Monthly</span>
                  </label>
                </div> : <></>}
              {(repeatby == "Yearly") ?
                <div class="form-group input-group">
                  <label class="has-float-label" style={{ width: "100%" }}>
                    <DatePicker format={'dd / MM / yyyy'} dayPlaceholder='DD' monthPlaceholder='MM' yearPlaceholder='YYYY'  /* minDate={new Date()} */ onChange={value => setrepeatYesParticularDateYearly(new Date(value).toString())} value={repeatYesParticularDateYearly != '' ? new Date(repeatYesParticularDateYearly) : new Date()} />
                    <span>Date</span>
                  </label>
                </div> : <></>}
                {(repeatby == "Yearly") ?
                <div class="form-group input-group">
                  <label class="has-float-label" style={{ width: "100%" }}>
                    <MultiDatePicker class="form-control" editable onlyYearPicker placeholder="Select Months" render={<InputIcon/>} multiple  onChange={(value) => {handleHolidaysMY(value)}} value=''  arrow={false}/>
                    <span>Holidays Yearly</span>
                  </label>
                </div> : <></>}


              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group">
                    <label
                      class="form-group has-float-label"
                      style={{ width: "100%" }}
                    >
                      <select required
                        class="form-control custom-select"
                        value={redeemtype}
                        onChange={(e) => { setRedeemtype(e.target.value); setDeadlinePeriod(''); setRedeemTime(''); setBookBefore(); setBookBeforeDuration('') }}
                      >
                        <option disabled selected value="">Select an Option</option>
                        <option disabled={repeatTicket == "No" ? true : false} value="Anytime">Anytime</option>
                        <option disabled={repeatTicket == "No" ? true : false} value="Deadline">Deadline</option>
                        <option value="Meal Time">Meal Time</option>
                      </select>
                      <span>Redeem Validity</span>
                    </label>
                  </div>
                </div>

                {redeemtype == "Deadline" ?
                  <div className="col-md-6">
                    <div class="form-group input-group">
                      <label
                        class="form-group has-float-label"
                        style={{ width: "100%" }}
                      >
                        <select required
                          class="form-control custom-select"
                          value={DeadlinePeriod}
                          onChange={(e) => setDeadlinePeriod(e.target.value)}
                        >
                          <option disabled selected value="">
                            Select an Option
                          </option>
                          <option value="15">15 Days</option>
                          <option value="30">1 Month</option>
                          <option value="90">3 Months</option>
                          <option value="180">6 Months</option>
                        </select>
                        <span>Deadline (Period)</span>
                      </label>
                    </div>
                  </div>
                  // <></>
                  : redeemtype == "Meal Time" ? (
                    <div className="col-md-6">
                      <div class="form-group input-group">
                        <label
                          class="form-group has-float-label"
                          style={{ width: "100%" }}
                        >
                          <select required
                            class="form-control custom-select"
                            value={redeemTime}
                            onChange={(e) => setRedeemTime(e.target.value)}
                          >
                            <option disabled selected value="">
                              Select an Option
                            </option>
                            <option value="Breakfast">Breakfast, (7am-11am)</option>
                            <option value="Morning Snacks">Morning Snacks, (11am-1pm)</option>
                            <option value="Lunch">Lunch,(12pm-4pm)</option>
                            <option value="Evening Snacks">Evening Snacks, (4pm-7pm)</option>
                            <option value="Dinner">Dinner, (7pm-11pm)</option>
                            <option value="Late Night">Late Night (11pm-7am)</option>
                            {/* <option value="Any Day">Any Day</option> */}
                            <option value="Full Day">Particular Day (24 hrs)</option>
                          </select>
                          <span>Meal Time</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
              </div>
              {redeemtype == "Anytime" || redeemtype == "Deadline" ? <></> :
                <div className="row">
                  <div className="col-md-6">
                    <div class="form-group input-group">
                      <label
                        class="form-group has-float-label"
                        style={{ width: "100%" }}
                      >
                        <select required
                          class="form-control custom-select"
                          value={BookBefore} onChange={(e) => { setBookBefore(e.target.value); setBookBeforeDuration('') }}
                        >
                          <option disabled selected value="">
                            Select an Option
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <span>Book Before</span>
                      </label>
                    </div>
                  </div>

                  {BookBefore == "Yes" ? (
                    <div className="col-md-6">
                      <div class="form-group input-group col-md-6">
                        <label class="has-float-label" style={{ width: "100%" }}>
                          <select required
                            class="form-control custom-select"
                            value={BookBeforeDuration} onChange={(e) => setBookBeforeDuration(e.target.value)}
                          >
                            <option disabled selected value="">
                              Select an Option
                            </option>
                            <option value="0">0 Hrs</option>
                            <option value="1">1 Hrs</option>
                            <option value="3">3 Hrs</option>
                            <option value="6">6 Hrs</option>
                            <option value="9">9 Hrs</option>
                            <option value="12">12 Hrs</option>
                            <option value="24">24 Hrs</option>
                            <option value="48">48 Hrs</option>

                          </select>
                          <span>Select Book Before Time</span>

                        </label>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>}
              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group">
                    <label
                      class="form-group has-float-label"
                      style={{ width: "100%" }}
                    >
                      <select required
                        class="form-control custom-select"
                        value={quantity} onChange={(e) => { setQuantity(e.target.value); setQuantityCount('') }}
                      >
                        <option disabled selected value="">
                          Select an Option
                        </option>
                        <option value="limited">Limited</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                      <span>Quantity (No of tickets) </span>
                    </label>
                  </div>
                </div>
                {quantity == "limited" ? (
                  <div className="col-md-6">
                    <div class="form-group input-group col-md-6">
                      <label class="has-float-label" style={{ width: "100%" }}>
                        <input
                          class="form-control"
                          type="text"
                          placeholder="Count"
                          value={quantityCount}
                          onChange={(e) => setQuantityCount(e.target.value)}
                        />
                        <span>Count</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <button
              type="submit"
              className="px-4 mt-5 rounded-pill w-25"
              size="sm"
              style={{ backgroundColor: '#5773ff', padding: '5px', border: 'none', cursor: "pointer" }}

            >
              Save
            </button>
          </form>
        </Modal.Body>
      </Modal>
      {/* Edit Profile */}


      {/* Crop Image */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-admin"
        centered
        show={showCropModel}
        onHide={() => setShowCropModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Crop Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center px-4 align-items-center">
          <div className="crop-box">
            <div className="crop-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="controls">
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </div>
          </div>
          <button
            className="px-4 mb-3 rounded-pill w-25"
            size="sm"
            style={{ backgroundColor: '#5773ff', padding: '5px', border: 'none' }}
            onClick={() => cropImage()}
          >
            Uplaod
          </button>
        </Modal.Body>
      </Modal>
      {/* Crop Image */}

      {/* Ticket Characteristics */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-admin"
        centered
        show={showNextTicketModel}
        onHide={() => setshowNextTicketModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Ticket Characteristics
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center ">
          <button className="px-2 rounded-pill " size="sm" style={{ backgroundColor: 'transparent', width: '100px', color: '#5773ff', padding: '5px', border: 'none', cursor: "pointer", fontSize: '20px', fontWeight: 'bold' }} onClick={() => showUpdateBasics(dbticketId)}>
            <FaArrowLeft /> Back
          </button>
          <form onSubmit={() => saveNextTicketData()} className="add-Adimin-form text-center m-4">
            <div className="form_input_field ">
              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group">
                    <label
                      class="form-group has-float-label"
                      style={{ width: "100%" }}
                    >
                      <select
                        class="form-control custom-select"
                        value={repeatTicket}
                        onChange={(e) => { setRepeatTicket(e.target.value); setRepeatBy(""); setRepeatWeekly(''); setrepeatYesParticularDateMonthly(''); setRepeatBy(""); setrepeatYesParticularDateYearly(''); setRedeemtype('') }}
                      >
                        <option disabled selected value="">Select an Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>

                      </select>
                      <span>Repeat</span>
                    </label>
                  </div>
                </div>
                {repeatTicket == "No" ? (
                  <div className="col-md-6">
                    <div class="form-group input-group col-md-6">
                      <label class="has-float-label" style={{ width: "100%" }}>
                        {/* <input
                          class="form-control"
                          type="date"
                          placeholder="Count"
                          pattern="\d{4}-\d{2}-\d{2}"
                          value={repeatNoParticularDate}
                          onChange={(e) => setrepeatNoParticularDate(e.target.value)}
                        /> */}
                        <DatePicker format={'dd / MM / yyyy'} dayPlaceholder='DD' monthPlaceholder='MM' yearPlaceholder='YYYY'  /* minDate={new Date()} */ onChange={(value) => { setrepeatNoParticularDate(new Date(value).toString()) }} value={repeatNoParticularDate != '' ? new Date(repeatNoParticularDate) : new Date()} />
                        <span>Date</span>
                      </label>
                    </div>
                  </div>
                ) : repeatTicket == "Yes" ? (
                  <div className="col-md-6">
                    <div class="form-group input-group">
                      <label
                        class="form-group has-float-label"
                        style={{ width: "100%" }}
                      >
                        <select required
                          class="form-control custom-select"
                          value={repeatby}
                          onChange={(e) => { setRepeatBy(e.target.value); setRepeatWeekly(''); setrepeatYesParticularDateMonthly(''); setrepeatYesParticularDateYearly('') }}
                        >
                          <option disabled selected value="">
                            Select an Option
                          </option>
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Yearly">Yearly</option>

                        </select>
                        <span>Repaet by</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              
              {repeatby == "Daily" ?
                <div class="form-group input-group">
                  <label
                    class="form-group has-float-label"
                    style={{ width: "100%" }}
                  >
                    <Select styles={customStyles} options={options} isMulti={true} onChange={value => handleHolidaysDW(value)}/>
                    <span>Holidays</span>
                  </label>
                </div> : <></>}
              {repeatby == "Weekly" ?
                <div class="form-group input-group">
                  <label
                    class="form-group has-float-label"
                    style={{ width: "100%" }}
                  >
                    <select class="form-control custom-select" value={repeatWeekly} onChange={(e) => setRepeatWeekly(e.target.value)} required>
                      <option disabled selected value="">Select an Option</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    <span>Week Days</span>
                  </label>
                </div> : <></>}
                {repeatby == "Weekly" && repeatWeekly ?
                <div class="form-group input-group">
                  <label
                    class="form-group has-float-label"
                    style={{ width: "100%" }}
                  >
                    <Select styles={customStyles} options={weeklyOptions} isMulti={true} onChange={value => handleHolidaysDW(value)}/>
                    <span>Holidays Weekly</span>
                  </label>
                </div> : <></>}
              {(repeatby == "Monthly") ?
                <div class="form-group input-group">
                  <label class="has-float-label" style={{ width: "100%" }}>
                    {/* <input
                      class="form-control"
                      type="date"
                      placeholder="Count"
                      pattern="\d{4}-\d{2}-\d{2}"
                      value={repeatYesParticularDateMonthly}
                      onChange={(e) => setrepeatYesParticularDateMonthly(e.target.value)}
                    /> */}
                    <DatePicker format={'dd / MM / yyyy'} dayPlaceholder='DD' monthPlaceholder='MM' yearPlaceholder='YYYY'  /* minDate={new Date()} */ onChange={value => setrepeatYesParticularDateMonthly(new Date(value).toString())} value={repeatYesParticularDateMonthly != '' ? new Date(repeatYesParticularDateMonthly) : new Date()} />
                    <span>Date</span>
                  </label>
                </div> : <></>}
                {(repeatby == "Monthly") ?
                <div class="form-group input-group">
                  <label class="has-float-label" style={{ width: "100%" }}>
              
                    <MultiDatePicker class="form-control"  editable onlyMonthPicker render={<InputIcon/>} multiple  onChange={(value) => {handleHolidaysMY(value)}} value=''  arrow={false}/>
                    <span>Holidays Monthly</span>
                  </label>
                </div> : <></>}
              {(repeatby == "Yearly") ?
                <div class="form-group input-group">
                  <label class="has-float-label" style={{ width: "100%" }}>
                    
                    <DatePicker format={'dd / MM / yyyy'} dayPlaceholder='DD' monthPlaceholder='MM' yearPlaceholder='YYYY'  /* minDate={new Date()} */ onChange={value => setrepeatYesParticularDateYearly(new Date(value).toString())} value={repeatYesParticularDateYearly != '' ? new Date(repeatYesParticularDateYearly) : new Date()} />
                    <span>Date</span>
                  </label>
                </div> : <></>}
                {(repeatby == "Yearly") ?
                <div class="form-group input-group">
                  <label class="has-float-label" style={{ width: "100%" }}>
                    <MultiDatePicker class="form-control" editable onlyYearPicker render={<InputIcon/>} multiple  onChange={(value) => {handleHolidaysMY(value)}} value=''  arrow={false}/>
                    <span>Holidays Yearly</span>
                  </label>
                </div> : <></>}


              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group">
                    <label
                      class="form-group has-float-label"
                      style={{ width: "100%" }}
                    >
                      <select required
                        class="form-control custom-select"
                        value={redeemtype}
                        onChange={(e) => { setRedeemtype(e.target.value); setDeadlinePeriod(''); setRedeemTime(''); setBookBefore(''); setBookBeforeDuration('') }}                      >
                        <option disabled selected value="">Select an Option</option>
                        <option disabled={repeatTicket == "No" ? true : false} value="Anytime">Anytime</option>
                        <option disabled={repeatTicket == "No" ? true : false} value="Deadline">Deadline</option>
                        <option value="Meal Time">Meal Time</option>
                      </select>
                      <span>Redeem Validity</span>
                    </label>
                  </div>
                </div>

                {redeemtype == "Deadline" ?
                  <div className="col-md-6">
                    <div class="form-group input-group">
                      <label
                        class="form-group has-float-label"
                        style={{ width: "100%" }}
                      >
                        <select
                          required
                          class="form-control custom-select"
                          value={DeadlinePeriod}
                          onChange={(e) => setDeadlinePeriod(e.target.value)}
                        >
                          <option disabled selected value="">
                            Select an Option
                          </option>
                          <option value="15">15 Days</option>
                          <option value="30">1 Month</option>
                          <option value="90">3 Months</option>
                          <option value="180">6 Months</option>
                        </select>
                        <span>Deadline (Period)</span>
                      </label>
                    </div>
                  </div>
                  // <></>
                  : redeemtype == "Meal Time" ? (
                    <div className="col-md-6">
                      <div class="form-group input-group">
                        <label
                          class="form-group has-float-label"
                          style={{ width: "100%" }}
                        >
                          <select required
                            class="form-control custom-select"
                            value={redeemTime}
                            onChange={(e) => setRedeemTime(e.target.value)}
                          >
                            <option disabled selected value="">
                              Select an Option
                            </option>
                            <option value="Breakfast">Breakfast, (7am-11am)</option>
                            <option value="Morning Snacks">Morning Snacks, (11am-1pm)</option>
                            <option value="Lunch">Lunch,(12pm-4pm)</option>
                            <option value="Evening Snacks">Evening Snacks, (4pm-7pm)</option>
                            <option value="Dinner">Dinner, (7pm-11pm)</option>
                            <option value="Late Night">Late Night (11pm-7am)</option>
                            {/* <option value="Any Day">Any Day</option> */}
                            <option value="Full Day">Particular Day (24 hrs)</option>
                          </select>
                          <span>Meal Time</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
              </div>
              {redeemtype == "Anytime" || redeemtype == "Deadline" ? <></> :
                <div className="row">
                  <div className="col-md-6">
                    <div class="form-group input-group">
                      <label
                        class="form-group has-float-label"
                        style={{ width: "100%" }}
                      >
                        <select required
                          class="form-control custom-select"
                          value={BookBefore} onChange={(e) => { setBookBefore(e.target.value); setBookBeforeDuration('') }}
                        >
                          <option disabled selected value="">
                            Select an Option
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <span>Book Before</span>
                      </label>
                    </div>
                  </div>

                  {BookBefore == "Yes" ? (
                    <div className="col-md-6">
                      <div class="form-group input-group col-md-6">
                        <label class="has-float-label" style={{ width: "100%" }}>
                          <select required
                            class="form-control custom-select"
                            value={BookBeforeDuration} onChange={(e) => setBookBeforeDuration(e.target.value)}
                          >
                            <option disabled selected value="">
                              Select an Option
                            </option>
                            <option value="0">0 Hrs</option>
                            <option value="1">1 Hrs</option>
                            <option value="3">3 Hrs</option>
                            <option value="6">6 Hrs</option>
                            <option value="9">9 Hrs</option>
                            <option value="12">12 Hrs</option>
                            <option value="24">24 Hrs</option>
                            <option value="48">48 Hrs</option>

                          </select>
                          <span>Select Book Before Time</span>

                        </label>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>}
              <div className="row">
                <div className="col-md-6">
                  <div class="form-group input-group">
                    <label
                      class="form-group has-float-label"
                      style={{ width: "100%" }}
                    >
                      <select
                        class="form-control custom-select"
                        value={quantity} onChange={(e) => { setQuantity(e.target.value); setQuantityCount('') }}
                      >
                        <option value="unlimited">Unlimited</option>
                        <option value="limited">Limited</option>

                      </select>
                      <span>Quantity (No of tickets) </span>
                    </label>
                  </div>
                </div>
                {quantity == "limited" ? (
                  <div className="col-md-6">
                    <div class="form-group input-group col-md-6">
                      <label class="has-float-label" style={{ width: "100%" }}>
                        <input required
                          class="form-control"
                          type="text"
                          placeholder="Count"
                          onChange={(e) => setQuantityCount(e.target.value)}
                        />
                        <span>Count</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <button type="submit" className="px-4 mt-5 rounded-pill w-25" size="sm" style={{ backgroundColor: '#5773ff', padding: '5px', border: 'none', cursor: "pointer" }}>
              Save
            </button>
          </form>
        </Modal.Body>
      </Modal>
      {/* Ticket Characteristics */}
      <Modal show={showDeleteConformModal} onHide={() => setShowDeleteConformModal(false)} className='add-admin'>
        <Modal.Header closeButton style={{borderBottom:'none'}}>
        </Modal.Header>
        <Modal.Body style={{color:'#fff',fontSize:'20px'}}>Are You Sure    to Delete this Ticket</Modal.Body>
        <Modal.Footer style={{borderTop:'none'}}>
          <Button variant="secondary btn-sm" onClick={() => setShowDeleteConformModal(false)}>
            Close
          </Button>
          <Button variant="primary btn-sm" onClick={() => deleteTicket()}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ScheduleFood;
