import React, { useState, useEffect } from "react";
import "./datePicker.scss";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { createHashHistory } from "history";
// import { apibaseURL } from "../apiBaseURL";
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { Button } from "react-bootstrap";
const history = createHashHistory();

function DatePicker({AllDates,onClickDate}) {
    const [data, setData] = useState([])
    var AllDates = AllDates;
   
return (
        <>
            <div class="container-fluid timeline-container">
                <div class="row">
                    <div class="col-sm-1 d-none d-sm-block">
                        <div class="row">
                            <div class="col-12 prev-btn">
                                <span class="fa fa-angle-left"></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-sm-10">
                        <div>
                            <div class="row timeline-list">
                                {AllDates.length > 0 ? AllDates.map((data, key) => {
                                    return (
                                        <button disabled={data.holiday == true ? true:false} class={`col-3 col-sm-2 col-lg-1 timeline-item ${ key == 0 ?'active' : ''}`  } id={data.holiday == true ? "holiday":''} onClick={()=>onClickDate(data,key)}>
                                            <div class="timeline-date">
                                                <span class="d-block"><strong>{data.day.slice(0, 3)}</strong></span>
                                                {/* <span class="d-block">{data.date}{" "}{data.month}</span> */}
                                                <span class="d-block date-span">{data.date}</span>
                                            </div>
                                        </button>)
                                    // console.log(data)
                                }) : <></>}
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-1 d-none d-sm-block">
                        <div class="row">
                            <div class="col-12 next-btn">
                                <span class="fa fa-angle-right"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DatePicker;
