import React, { useEffect, useState } from 'react';
import api from "../api";
import ProductCard from "../components/ProductCard";
import "./Dashboard.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        const { data } = await api.get("/app/get-products");
        console.log(data.products);
        const allCategories = new Set();
        data.products.map((p) => {
          allCategories.add(p.category);
        });

        setCategories(["all", ...allCategories]);
        console.log(allCategories);
        setProducts(data.products);
      } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }
    getProducts();
  }, []);

  async function categoryHandler(c) {
    try {
      setLoading(true);
      if (c == "all") {
        let { data } = await api.get(`/app/get-products`);
        setProducts(data.products);
      } else {
        let { data } = await api.get(`/app/get-products/${c}`);
        setProducts(data.products);
        //setProducts(data.products);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text">Loading...</p>
        </div>
      ) : (
        <div className="dashboard">
          <div className="categories">
            {categories.map((c) => (
              <div key={c} onClick={() => categoryHandler(c)} className="category-chip">{c}</div>
            ))}
          </div>

          <div className="products-container">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </>
  );
};

export default Dashboard