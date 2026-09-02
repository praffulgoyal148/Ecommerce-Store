import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styles from "./UpdateProduct.module.css";
import api from "../../api";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/app/get-product/${id}`)
      .then(({ data }) => {
        const fetchedProduct = data.product;

        setProduct({
          name: fetchedProduct?.name || "",
          price: fetchedProduct?.price || "",
          description: fetchedProduct?.description || "",
          imageUrl: fetchedProduct?.imageUrl || "",
        });
      })
      .catch((err) => {
        console.error(err);

        setError(
          err.response?.data?.message || "Unable to load product details.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!product.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!product.price || Number(product.price) <= 0) {
      setError("Enter a valid product price.");
      return;
    }

    const updatedProduct = {
      id,
      name: product.name.trim(),
      price: Number(product.price),
      description: product.description.trim(),
      imageUrl: product.imageUrl.trim(),
    };

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const { data } = await api.post(
        `/admin/update-product`,
        updatedProduct,
      );

      setMessage(data.message || "Product updated successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update the product. Please try again.",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className={styles.status}>Loading product...</div>;
  }

  if (error && !product.name) {
    return <div className={styles.status}>{error}</div>;
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <span>Product Management</span>
          <h1>Update Product</h1>
          <p>Edit the product information and save your changes.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="productId">Product ID</label>

            <input id="productId" type="text" value={id} disabled />
          </div>

          <div className={styles.field}>
            <label htmlFor="name">
              Product Name <span>*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              disabled={updating}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="price">
              Price <span>*</span>
            </label>

            <div className={styles.priceInput}>
              <span>₹</span>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter product price"
                disabled={updating}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="imageUrl">Image URL</label>

            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={product.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
              disabled={updating}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
              disabled={updating}
            />
          </div>

          {product.imageUrl && (
            <div className={styles.preview}>
              <p>Image Preview</p>

              <img
                src={product.imageUrl}
                alt={product.name || "Product preview"}
              />
            </div>
          )}

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className={styles.successMessage} role="status">
              {message}
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate("/admin/products")}
              disabled={updating}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.updateButton}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default UpdateProduct;