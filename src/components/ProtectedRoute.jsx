import React from "react";
import {useAuth} from "../context/AuthContext";
import {Navigate,Outlet,useNavigate} from "react-router-dom";

const ProtectedRoute = () => {
    const {isAuthenticated} = useAuth();
    console.log(isAuthenticated);

    return (
        <>
          {isAuthenticated ? <Outlet/> : <Navigate to="/login" replace={true} />}
        </>
    );
};

export default ProtectedRoute;