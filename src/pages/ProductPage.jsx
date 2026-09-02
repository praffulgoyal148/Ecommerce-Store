import React, { useEffect, useState } from 'react'
import styles from "./ProductPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const ProductPage = () => {
  const { id } = useParams();
  const { loading, setLoading } = useState(true);
  const [product, setProduct] = useState({});
  const { setCart } = useAuth();
  const navigate = useNavigate();

  async function addToCartHandler(id) {
    let { data } = await api.get(`/app/add-to-cart/${id}`);
    console.log(data.cart);
    setCart(data.cart);
  }

  useEffect(() => {
    async function getProductDetails() {
      const { data } = await api.get(`/app/get-product/${id}`);
      return data.product;
    }

    getProductDetails()
      .then((fetchedProduct) => {
        setProduct(fetchedProduct);
      })
      .catch((err) => {
        console.err("Unable to fetch product:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);


  return (
    <>
      {loading ? (
        <div>...Loading</div>
      ) : (
        <div className={styles.container}>
          <div className={styles.card}>
            {/* Product Image */}
            <div className={styles.image}>
              <img src={product.imageUrl} alt={product.name} />
            </div>

            {/* Product Information */}
            <div className={styles.info}>
              <span className={styles.container}>
                {product.category}
              </span>

              <h1 className={styles.title}>{product.name}</h1>

              <h2 className={styles.price}>${product.price}</h2>

              <p className={styles.description}>{product.description}</p>

              <div className={styles.details}>
                <p>
                  <strong>Product ID:</strong> {product._id}
                </p>
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                {/* <p>
                      <strong>Admin Id:</strong> {product.adminId}
                     </p> */}
              </div>
              <button className={styles.cartBtn} onClick={() => addToCartHandler(product._id)}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage