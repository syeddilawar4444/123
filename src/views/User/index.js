import React, { useEffect, useState } from 'react'
import { db, auth, buyToken, patientImage } from "../../config/firebase";
import { where, collection, onSnapshot, query } from "firebase/firestore";
import LogoutBtn from "../../component/Logout-btn"
import { async } from '@firebase/util';
export default function User() {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([])
  const [render, setRender] = useState(false)
  const [companyId, setCompanyId] = useState("")
  const [company, setCompany] = useState("")
  const [totalTokens, setTotalTokens] = useState("")
  const [totalSold, settotalSold] = useState("")
  const [image, setImage] = useState(undefined)





  useEffect(() => {
    const q = query(collection(db, "Company"),where(`userId`, "!=", `${auth.currentUser.uid}`)
    );
    const companies = onSnapshot(q, (snapshot) => {
      setData([]);
      snapshot.docs.forEach((doc) => {
        setData((prev) => [...prev, { id: doc.id, data: doc.data() }]);
      });
      setRender(true);
    });
    return () => {
      companies();
    };
  }, []);
  const token = function (id, totalTokens, totalSoldToken, company) {
   
    setCompanyId(id)
    setTotalTokens(totalTokens)
    settotalSold(totalSoldToken)
    setCompany(company)

    // alert(e.target.value)

  }


  const buyTokenToFirebase = async function () {
    debugger
    if (companyId == "" || totalSold === "" || totalTokens == "" || company == "" || image == undefined) {
      alert("missing")

    } else {
     const url =  await patientImage(image)
      if (totalTokens <= totalSold) {
        alert("Currently Token Unavailable")
      } else {
        debugger
        await buyToken({ companyId, totalTokens, totalSold, company })
        alert("BUY TOKEN")
      }
    }

  }


  return (
    <>
    {/* bootstrap model */}
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
                Upload Patient Image
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
               
                <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
                <div className="button-container">
                  <button type="submit" onClick={buyTokenToFirebase}  >
                    Upload Image
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <div >
        <LogoutBtn name="User" />
        <div className="accordion accordion-flush" id="accordionFlushExample">
          {data.map((item, key,i) => {
            return (
              <div key={key} className="accordion-item">
                <h2 className="accordion-header" id={`flush-heading${key}`}>
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${key}`} aria-expanded="false" aria-controls={`flush-collapse${key}`}>
                    {item.data.company}
                  </button>
                </h2>
                <div id={`flush-collapse${key}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${key}`} data-bs-parent="#accordionFlushExample">
                  <div className="accordion-body text-light bg-dark d-flex justify-content-between flex-column">
                    <div className='d-flex justify-content-between mb-2'>
                      <span>Opening Time : {item.data.openingTime}</span>
                      <span>Closing Time : {item.data.closingTime}</span>
                    </div>

                    <div className='d-flex justify-content-between'>
                      <span>Total Tokens : {item.data.totalTokens}</span>
                      <span>Sold Tokens : {item.data.totalSoldToken}</span>
                    </div>


                    {item.data.activeToken >= 1 ?
                      <div className='d-flex justify-content-between'>

                        <span>Currently Serving : {item.data.activeToken}</span>
                        <span>Next Token In {item.data.each_token_time} Minutes</span>
                      </div>
                      :
                      <span></span>
                    }

                    {item.data.totalTokens == 0 || item.data.totalTokens == item.data.totalSoldToken ?
                      <p>Currently Token Unavailable</p>
                      :
                      // onClick={()=>buyTokenToFirebase(item.id,item.data.totalTokens,item.data.totalSoldToken,item.data.company)}
                      <button className="btn btn-primary fs-4 fw-bold my-3" data-bs-toggle="modal"
                        data-bs-target="#exampleModal1" onClick={() => token(item.id, item.data.totalTokens, item.data.totalSoldToken, item.data.company)} >BUY TOKEN</button>
                    }
                  </div>
                </div>
              </div>
            )
          })
          }
        </div>

        {/* <div>
          {userData.map((item)=>{
            return(
              <>
              </>
            )
          })}
        </div> */}
      </div>
    </>
  )
}
