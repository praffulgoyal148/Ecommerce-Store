import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  const {authenticate,isAuthenticated} = useAuth();

  const [user,setUser] = useState({
    password: "",
    username: ""
  })


  function onChangeHandler(key,ev){
    setUser((prevUser) => {
        let newUser = {...prevUser};
        newUser[key] = ev.target.value;
        return newUser;
    });
  }

  async function loginHandler() {
    try {
        let {data} = await api.post("/users/login",user);
        console.log(data);
        authenticate(data.token,data.user);
    } catch (error) {
        console.log(error);
    }
  }



  return (
    <div className="login-container">
        <div className="login-card">
            <h2 className="login-title">Login</h2>

            <input type="text" className="login-input" placeholder="Enter username" onChange={(ev) => onChangeHandler("username",ev)} />
            <input type="password" className="login-input" placeholder="Enter password" onChange={(ev) => onChangeHandler("password",ev)} />

            <button className="login-btn" onClick={loginHandler}>Login</button>
        </div>
    </div>
  )
}

export default Login