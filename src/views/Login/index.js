import { async } from '@firebase/util'
import React from 'react'
// import "../../App.css"
import "./login.css"
import {loginFacebookHandler,addUserToFirebase} from "../../config/firebase"

export default function login() {
 async function login (){
    const info = await loginFacebookHandler()
    debugger
    console.log("login data ===>",info)
    if(info !== undefined){
      addUserToFirebase(info)
    }
  }

  return (
    <>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
    </div>
    <form>
            <h3>Login To Q App</h3>
            
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="Email or Phone" id="username"/>
            
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" id="password"/>
            
            <button>Log In</button>
            <div className="social">
                <div className="go"><img src="https://www.olx.com.pk/assets/iconGoogleLogin_noinline.633b1f5afb5219bedca01d2367642a28.svg" alt=""/>  Google</div>
                <div onClick={login} className="fb"><img src="https://www.olx.com.pk/assets/iconFacebookLogin_noinline.70f71af03bbf63ca01a044ff5c5eb342.svg" alt=""/>  Facebook</div>
         </div>
    </form>
    
    

      {/* <h1>Q Application</h1>
    <button onClick={login}>Login With Facebook</button> */}
 
    
    </>
    



  )
}
