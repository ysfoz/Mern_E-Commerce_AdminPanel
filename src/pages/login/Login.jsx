import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux"
import { login } from "../../helper/requestMethods"


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()


  const handleClick = (e)=>{
    e.preventDefault()
    login(dispatch,{username,password})

  }

  return (
    <div style={{height:"100vh", display:"flex",alignItems:"center",justifyContent:'center',flexDirection:"column"}}>
      <input type="text" placeholder="username" onChange={(e)=>setUsername(e.target.value)} style={{padding:10,marginBottom:27, width:window.screen.width * 0.3}}/>
      <input type="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)}style={{padding:10, marginBottom:27,width:window.screen.width * 0.3}}/>
      <button onClick={handleClick} style={{padding:10, width:"100px"}}>Login</button>
    </div>
  );
};

export default Login;
