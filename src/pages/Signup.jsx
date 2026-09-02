import React from 'react';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../api';
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate();

    const [user,setUser] = useState({
        email: "",
        password:"",
        username:""
    });

    function onChangeHandler(key,ev) {
        setUser((prevUser) => {
            let newUser = {...prevUser};
            newUser[key] = ev.target.value;
            return newUser;
        });
    }

   async function signupHandler() {
     try {
        let {data} = await api.post("/users/signup",user);

        navigate("/login",{
            replace:true
        });
     } catch (error) {
        console.log(error);
     }
   }


  return (
    <div className="signup-container">
         <div className="signup-card">
               <h2 className="signup-title">Create Account</h2>
               
               <input type="text" className="signup-input" placeholder="Enter username" onChange={(e)=>onChangeHandler("username",e)} />
               <input type="email" className="signup-input" placeholder="Enter email" onChange={(e)=>onChangeHandler("email",e)}/>
               <input type="password" className="signup-input" placeholder="Enter password" onChange={(e)=>onChangeHandler("password",e)}/>
               <button className="signup-btn" onClick={signupHandler} >Signup</button>
         </div>
    </div>
  )
}

export default Signup