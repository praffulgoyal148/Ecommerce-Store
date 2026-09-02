import React, {useEffect, useState} from 'react';
import styles from "./AdminProducts.module.css";
import api from "../../api";
import {useNavigate} from "react-router-dom";

const AdminProducts = () => {
    const [products,setProducts] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api
          .get("/admin/get-products")
          .then(({data}) => {
              setProducts(Array.isArray(data.products) ? data.products : []);
          })
          .catch((err) => {
            console.log(err);
            setError(err.response?.data?.message || "Unable to load your products.",);
          })
          .finally(() => {
            setLoading(false);
          })
    },[]);

    const formatPrice = (price) => {
         return new Intl.NumberFormat("en-IN", {
            style:"currency",
            currency:"INR",
            maximumFractionDigits: 2,
         }).format(Number(price) || 0);
    };

    if(loading) {
        return <div className={styles.status}>Loading products...</div>;
    }

    if(error) {
        return <div className={styles.status}>{error}</div>
    }

    if(products.length === 0) {
        return <div className={styles.status}>No products found.</div>;
    }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p>Product Management</p>
            <h1>My Products</h1>
          </div>

          <span>
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </header>

        <section className={styles.productGrid}>
          {products.map((product) => (
            <article className={styles.productCard} key={product._id}>
              <div className={styles.imageContainer}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <span>No image</span>
                )}
              </div>
              
              <button onClick={() => navigate(`/update-product/${product._id}`)}>
                Update
              </button>

              <div className={styles.productInfo}>
                <span className={styles.category}>
                  {product.category || "Product"}
                </span>

                <h2>{product.name}</h2>

                <p className={styles.description}>
                  {product.description || "No description available."}
                </p>

                <div className={styles.productFooter}>
                  <strong>{formatPrice(product.price)}</strong>

                  {product.rating !== undefined && product.rating !== null && (
                    <span className={styles.rating}>★ {product.rating}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default AdminProducts;