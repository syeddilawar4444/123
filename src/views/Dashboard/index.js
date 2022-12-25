import React, { useEffect, useState } from 'react'
// import Company from "../../component/Company"
import { logout, getUserInfo} from '../../config/firebase'
import LogoutBtn from "../../component/Logout-btn"

import "../../Css/dashboard.css"
import { getAllCompany } from '../../config/firebase'
import Profile from '../Profile'
import { Link, useNavigate} from 'react-router-dom';


export default function Dashboard() {
  const navigate = useNavigate()
  const [button,setButton] = useState(false)
  const [userInfomation,setUserinfomation] = useState()
  useEffect(()=>{
    // getAllCompany()
    getUserDetailFirebase()
    console.log(userInfomation)
  },[])

async function getUserDetailFirebase(){
  const userInfo = await getUserInfo()
  setUserinfomation(userInfo)

}


const company = () => {
  navigate('/profile')
 
  
}
const inUser = ()=>{
navigate("/user")
}
  return (


<>
    {/* <div className='logout'>
      <h1>Dashboard</h1>
      <button className='logout' onClick={logout}>Logout</button>
    </div> */}
    <LogoutBtn name="Dashboard" />
    <div className='main'>
      <h2>
      Welcome To {userInfomation?.displayName}
      </h2>
      <span>Are You Company</span>
    
      <button onClick={company}>Company</button>

      <span>Are you finding/waiting for tokens?</span>
      <button onClick={inUser}>Individual user</button>
    {/* { button && <Company />} */}
    </div>
</>
  )

}
