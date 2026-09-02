import React from "react";
import "./ProductCard.css";
import api from "../api";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

const ProductCard = ({product}) => {
    const {imageUrl,name, description, category, price} = product;
    const {setCart} = useAuth();
    const navigate = useNavigate();

    async function addToCartHandler(id) {
        let {data} = await api.get(`/app/add-to-cart/${id}`);
        console.log(data.cart);
        setCart(data.cart);
    }

    function productHandler(id) {
        navigate(`/product-details/${id}`);
    }

    return (
        <div className="product-card">
            <span onClick={() => productHandler(product._id)}>
                <img src={imageUrl} alt={name} className="product-image" />
            </span>

            <div className = "product-content">
                <span className="product-category">{category}</span>

                <h2 className="product-name">{name}</h2>

                <p className="product-description">{description}</p>

                <div className="product-footer">
                    <span className="product-price">₹{price}</span>

                    <button className="add-cart-btn" onClick={() => addToCartHandler(product._id)}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;