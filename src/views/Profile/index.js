// import React, { useState } from 'react'
import React, { useEffect, useState } from "react";
import "./company.css";
import { AddCompany, getAllCompany, db, auth, uploadImage,setTokensToDb } from "../../config/firebase";
import { where, collection, onSnapshot, query } from "firebase/firestore";

export default function Company() {
  const [name, setName] = useState("");
  const [since, setSince] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [image, setImage] = useState(undefined)
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [istoken,setIsToken] = useState("")
  const [IsEachTime,setIsEachTime] = useState("")
  const [isCompanyId,setIsCompanyId] = useState("")



  const [address, setAddress] = useState("");
  const [Isupdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "Company"),
      where(`userId`, "==", `${auth.currentUser.uid}`)
    );
    const companies = onSnapshot(q, (snapshot) => {
      setData([]);
      snapshot.docs.forEach((doc) => {
        setData((prev) => [...prev, { id: doc.id, data: doc.data() }]);
      });
      setIsUpdate(true);
    });
    return () => {
      companies();
    };
  }, []);

  async function AddCompanyToFirebase() {
    if (
      name === "" ||
      since === "" ||
      address === "" ||
      openingTime === "" ||
      closingTime === "" ||
      image == undefined
    ) {
      alert("Please Fill The Form");
    } else {
      const url = await uploadImage(image)
      AddCompany({ name, since, open, close, address, url });
      setSince("");
      setAddress("");
      setName("");
      setOpeningTime("");
      setClosingTime("");
      setShow(false);
    }
  }

  const onTimeChange = function (time) {
    let timeSplit = time.split(":"),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = "PM";
      hours -= 12;
    } else if (hours < 12) {
      meridian = "AM";
      if (hours === 0) {
        hours = 12;
      }
    } else {
      meridian = "PM";
    }
    return hours + ":" + minutes + " " + meridian;
  };
  let open = onTimeChange(openingTime);
  let close = onTimeChange(closingTime);

  // const fetch = async () => {
  //   const data = await getAllCompany();
  //   let temp = [...data];
  //   console.log("temp", temp);
  //   setData(temp);
  //   console.log("dd  ==", data);
  // };
  // useEffect(() => {
  //   fetch();
  // }, []);

  const userName = function (e) {
    setName(e.target.value);
  };
  const sinceAdd = function (e) {
    setSince(e.target.value);
  };
  const openTime = function (e) {
    setOpeningTime(e.target.value);
  };
  const closeTime = function (e) {
    setClosingTime(e.target.value);
  };
  const addressAdd = function (e) {
    setAddress(e.target.value);
  };
  const compnayImage = async function (e) {
    console.log("Upload images", e.target.files[0])
    setImage(e.target.files[0])
  }
  const tokenInput = function(e){
    setIsToken(e.target.value);
  }
  const eachTimeInput = function(e){
    setIsEachTime(e.target.value);
  }
  const setToken = function (e) {
    alert(e)
    setIsCompanyId(e)
  }
  const setTokenToFirebase = function(){

    setTokensToDb({isCompanyId,istoken,IsEachTime})
  }
  return (
    <>
      <div>
        {/* onClick={() => setShow(true)} */}
        <button data-bs-toggle="modal"
          data-bs-target="#exampleModal" >CREATE COMPANY +</button>
      </div>
      {data.map((item, key) => {
        return (
          <div key={key} className="show-company">
            <div className="company-header">
              <div className="compnay-name">
                Company Name :{item.data.company}
              </div>
              <div className="compnay-button">
                <button data-bs-toggle="modal"
                  data-bs-target="#exampleModal1" onClick={() => setToken(item.id)}>Add Token</button>
                <button>Delete</button>
                <button>Disable</button>
              </div>
            </div>
            <div className="company-footer">
              <span>All Tokens : {item.data.totalTokens} </span>
              <span>Each Token Time : {item.data.each_token_time} minutes</span>
              <span>Sold Tokens : {item.data.soldTo}</span>
            </div>
          </div>
        );
      })}

      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                ADD TOKEN
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="form-box">
                  {/* <h1 onClick={()=>console.log(data)}>REGISTED COMPANY </h1> */}

                  <div className="form-container">
                    <div className="form-controls">
                      
                      <input
                       type="number"
                        id="company-name"
                        name="company-name"
                        placeholder="No of Tokens Available For Today..."
                        value={istoken}
                        onChange={tokenInput}
                      />
                    </div>
                    <div className="form-controls">
                      <input
                      type="number"
                        id="company-name"
                        name="company-name"
                        placeholder="Each Token Time..."
                        value={IsEachTime}
                        onChange={eachTimeInput}
                      />
                    </div>
                    </div>
                  </div>
                  <div className="button-container">
                    <button type="submit" onClick={setTokenToFirebase}>
                      ADD TOKEN
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div> */}
          </div>
        </div>
      

      {/* {show &&
        <div className="container">
          <div className="form-box">
            <h1 onClick={()=>console.log(data)}>REGISTED COMPANY </h1>


            <div className="form-container">
              <div className="form-controls">
                <label htmlFor="company-name">Company Name</label>
                <input id="company-name" name="company-name" placeholder="Enter Company Name.." value={name} onChange={userName} />
              </div>
              <div className="form-controls">
                <label htmlFor="since">Since</label>
                <input type="number" id="since" name="since" placeholder="Since.." onChange={sinceAdd} value={since} />
              </div>
              <div className="form-controls">
                <label htmlFor="opening-time">Opening Time</label>
                <input type="time" id="opening-time" name="opening-time" value={openingTime} onChange={openTime} />
              </div>

              <div className="form-controls">
                <label htmlFor="closing-time">Closing Time</label>
                <input type="time" id="closing-time" name="closing-time" value={closingTime} onChange={closeTime} />
              </div>

              <div className="textarea-controls">
                <label htmlFor="address">Address</label>
                <textarea name="address" id="address" cols="30" rows="3" value={address} onChange={addressAdd} placeholder="Enter Company Address..."></textarea>
              </div>

              <div className="form-controls">
                <label htmlFor="images">Certificates Images</label>
                <input type="file" id="images" name="images" />
              </div>
            </div>
            <div className="button-container">
              <button type="submit" onClick={AddCompanyToFirebase}>ADD COMPANY</button>
            </div>

          </div>

        </div>
      } */}
      {/* <button>show</button> */}
      {/* <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button> */}
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                REGISTED COMPANY
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="form-box">
                  {/* <h1 onClick={()=>console.log(data)}>REGISTED COMPANY </h1> */}

                  <div className="form-container">
                    <div className="form-controls">
                      <label htmlFor="company-name">Company Name</label>
                      <input
                        id="company-name"
                        name="company-name"
                        placeholder="Enter Company Name.."
                        value={name}
                        onChange={userName}
                      />
                    </div>
                    <div className="form-controls">
                      <label htmlFor="since">Since</label>
                      <input
                        type="number"
                        id="since"
                        name="since"
                        placeholder="Since.."
                        onChange={sinceAdd}
                        value={since}
                      />
                    </div>
                    <div className="form-controls">
                      <label htmlFor="opening-time">Opening Time</label>
                      <input
                        type="time"
                        id="opening-time"
                        name="opening-time"
                        value={openingTime}
                        onChange={openTime}
                      />
                    </div>

                    <div className="form-controls">
                      <label htmlFor="closing-time">Closing Time</label>
                      <input
                        type="time"
                        id="closing-time"
                        name="closing-time"
                        value={closingTime}
                        onChange={closeTime}
                      />
                    </div>

                    <div className="textarea-controls">
                      <label htmlFor="address">Address</label>
                      <textarea
                        name="address"
                        id="address"
                        cols="30"
                        rows="3"
                        value={address}
                        onChange={addressAdd}
                        placeholder="Enter Company Address..."
                      ></textarea>
                    </div>

                    <div className="form-controls">
                      <label htmlFor="images">Certificates Images</label>
                      <input onChange={compnayImage} type="file" id="images" name="images" accept="image/*" multiple />
                    </div>
                  </div>
                  <div className="button-container">
                    <button type="submit" onClick={AddCompanyToFirebase}>
                      ADD COMPANY
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
