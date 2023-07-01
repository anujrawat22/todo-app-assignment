import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import Navbar from "../components/Navbar";

function Signup() {
  const [token,setToken ] = useState('')

  useEffect(()=>{
   setToken(JSON.parse(localStorage.getItem("token")))
  },[])
  return (
    <>
    { token ? <UserNavbar/> : <Navbar/>}
      <div>signup</div>
    </>
  );
}

export default Signup;
