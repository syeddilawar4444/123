import React,{useEffect,useState} from 'react'
import {db, auth } from "../../config/firebase";
import { where,collection, onSnapshot, query } from "firebase/firestore";
export default function User() {
  const [data, setData] = useState([]);
  const [Isupdate, setIsUpdate] = useState(false)
  useEffect(() => {
    const companies =
      onSnapshot(collection(db, "Company"), (snapshot) => {
        setData([]);
        snapshot.docs.forEach((doc) => {
          setData((prev) => [...prev, { id: doc.id, data: doc.data() }]);
        });
      });
    return () => {
      setIsUpdate(true)
      companies()
    }
  }, [])
  return (
    <div >
      <div className="accordion accordion-flush" id="accordionFlushExample">
        {data.map((item)=>{

          return(
            <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingOne">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            {item.data.company}
            </button>
          </h2>
          <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
            <div className="accordion-body text-light bg-dark d-flex justify-content-between">
              <span>Opening Time : {item.data.openingTime}</span>
              <span>Closing Time : {item.data.closingTime}</span>
            </div>
          </div>
        </div>
          )
        })
        }
        
      </div>
    </div>
  )
}