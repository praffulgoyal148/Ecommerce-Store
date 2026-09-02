import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaShoppingCart} from "react-icons/fa";
import { authorisationContext,useAuth } from "../context/AuthContext";
import "./Navbar.css";
import api from "../api";

const Navbar = () => {
    const {logout, isAuthenticated} = useContext(authorisationContext);
    const navigate = useNavigate();
    const {cart} = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/dashboard">MyApp</Link>
            </div>

            {isAuthenticated && (
                <span>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/cart">Cart</Link>
                </span>
            )}

            <span>
                {/* Only for Admins */}
                <Link to="/add-new-product">Add New Product</Link>
                <Link to="/view-admin-products">View Your Products</Link>
            </span>

            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                       <Link className="cart-link" to="/cart">
                          <div className="cart-container">
                            <FaShoppingCart className="cart-icon" />
                              {cart.length > 0 ? (
                                <span className="cart-count">{cart.length}</span>
                              ):(
                                ""
                              )}
                          </div>
                       </Link>

                       <button className="logout-btn" onClick={logout}>
                         Logout
                       </button>
                    </>
                ):(
                <>
                   <Link className="nav-link" to="/login">
                     Login
                   </Link>

                   <Link className="nav-link signup-link" to="/signup">
                      Signup
                   </Link>
                </>
            )}
            </div>
        </nav>
    );
};

export default Navbar;