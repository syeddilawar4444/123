// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react';
import Login from "./views/Login"
import Router from './config/router';
// import Offbult from './reusable-component/Offbult';


function App() {
  // const [bulb,setBulb] = useState("Off")
  return (
    <div className="App">
      {/* <Login /> */}
      <Router />
   


{/*      
    <Offbult bulb={bulb} />
      <button onClick={()=>setBulb("On")}>Switch On</button>
      <button onClick={()=>setBulb("Off")}>Switch Off</button>
      <button onClick={()=>setBulb("BreakBulb")}>Break The Bulb</button> */}

    </div>
  );
}
export default App;
