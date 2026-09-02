import React, { createContext, useContext, useState } from 'react';
import {useNavigate} from 'react-router-dom';

const authorisationContext = createContext({
    isAuthenticated: "",
    authenticate: function() {},
    token:null,
    user:null,
    cart: [],
    logout: function() {}, //These are mentioned here so that when I use this
    //context mere pass autoComplete mei options visible rahein
});

const AuthContext = ({children}) => {
    const navigate = useNavigate();
    /*
     isAuthenticated: boolean
     authenticate: function to login user and store user , token in localStorage
     token: get token
     user: get user details
     logout: Logout user and clear localStorage token and user data
    */

     const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")||null) || null
     );
     const [token,setToken] = useState(localStorage.getItem("token")||null);

     function authenticate(token,user = null) {
        localStorage.setItem("token", token); // backend se aaega yeh
        localStorage.setItem("user",JSON.stringify(user)); // backend se aaega user
        console.log(user);
        setToken(token);
        setUser(user);

        if(!token) {
            return navigate("/login", {
                replace : true,
            });
        }

        navigate("/dashboard", {
            replace: true,
        });
     }

     function setCart(cart) {
        const newUser = {
            ...user,
            cart
        };
        setUser(newUser);

        localStorage.setItem("user",JSON.stringify(newUser));
     }

     function logout() {
        localStorage.setItem("token","");
        localStorage.setItem("user","");

        setToken(null);
        setUser(null);

        navigate("/login",{
            replace: true
        });
     }

     return (
        <authorisationContext.Provider
         value={{
            authenticate,
            isAuthenticated: Boolean(localStorage.getItem("token")),
            user,
            cart: user?.cart || [],
            setCart,
            token,
            logout
         }}
        >
            {children}
        </authorisationContext.Provider>
     );
};

function useAuth() {
    const data = useContext(authorisationContext);

    return data;
}

export default AuthContext;
export { authorisationContext };
export { useAuth }