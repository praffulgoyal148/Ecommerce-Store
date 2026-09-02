import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import styles from "./AddProduct.module.css";

const initialProduct = {
  name: "",
  price: "",
  description: "",
  imageUrl: "",
  category: "",
};

const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState(initialProduct);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));

    setApiError("");
    setSuccessMessage("");

    if (name === "imageUrl") {
      setImageError(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!product.name.trim()) {
      newErrors.name = "Product name is required.";
    } else if (product.name.trim().length < 2) {
      newErrors.name = "Product name must contain at least 2 characters.";
    }

    if (product.price === "") {
      newErrors.price = "Product price is required.";
    } else if (Number(product.price) <= 0) {
      newErrors.price = "Price must be greater than ₹0.";
    }


    if (product.imageUrl.trim()) {
      try {
        new URL(product.imageUrl);
      } catch {
        newErrors.imageUrl = "Enter a valid image URL.";
      }
    }

    if (!product.category.trim()) {
      newErrors.category = "Product category is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const productData = {
      name: product.name.trim(),
      price: Number(product.price),
      description: product.description.trim(),
      imageUrl: product.imageUrl.trim(),
      category: product.category.trim().toLowerCase(),
    };

   
    try {
      setSubmitting(true);
      setApiError("");
      setSuccessMessage("");

      const { data } = await api.post("/admin/add-product", productData);

      setSuccessMessage(data.message || "Product has been added successfully.");

      setProduct(initialProduct);
      setImageError(false);

      // Navigate after successful creation when your API returns the product.
      if (data.product?._id) {
        setTimeout(() => {
          navigate(`/dashboard`);
        }, 800);
      }
    } catch (error) {
      console.error("Unable to add product:", error);

      setApiError(
        error.response?.data?.message ||
          "Unable to add the product. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setProduct(initialProduct);
    setErrors({});
    setApiError("");
    setSuccessMessage("");
    setImageError(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.formSection}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>Product Management</span>
            <h1>Add New Product</h1>
            <p>Enter the product information below to add it to your store.</p>
          </header>

          {apiError && (
            <div className={styles.errorMessage} role="alert">
              {apiError}
            </div>
          )}

          {successMessage && (
            <div className={styles.successMessage} role="status">
              {successMessage}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGrid}>
              <div className={styles.fullField}>
                <label htmlFor="name">
                  Product Name <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="For example, Smart Fitness Watch"
                  className={errors.name ? styles.invalidInput : ""}
                  disabled={submitting}
                />

                {errors.name && (
                  <small className={styles.fieldError}>{errors.name}</small>
                )}
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
                    placeholder="1499"
                    className={errors.price ? styles.invalidInput : ""}
                    disabled={submitting}
                  />
                </div>

                {errors.price && (
                  <small className={styles.fieldError}>{errors.price}</small>
                )}
              </div>



              <div className={styles.fullField}>
                <label htmlFor="category">
                  Category <span>*</span>
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={product.category}
                  onChange={handleChange}
                  placeholder="For example, Electronics"
                  className={errors.category ? styles.invalidInput : ""}
                  disabled={submitting}
                />

                {errors.category && (
                  <small className={styles.fieldError}>{errors.category}</small>
                )}
              </div>

              <div className={styles.fullField}>
                <label htmlFor="imageUrl">Product Image URL</label>

                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={product.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className={errors.imageUrl ? styles.invalidInput : ""}
                  disabled={submitting}
                />

                {errors.imageUrl ? (
                  <small className={styles.fieldError}>{errors.imageUrl}</small>
                ) : (
                  <small className={styles.helperText}>
                    Add a publicly accessible image URL.
                  </small>
                )}
              </div>

              <div className={styles.fullField}>
                <div className={styles.labelRow}>
                  <label htmlFor="description">Description</label>

                  <span>{product.description.length}/500</span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  maxLength="500"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Describe the product, its features and benefits..."
                  disabled={submitting}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                disabled={submitting}
              >
                Reset
              </button>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className={styles.spinner} />
                    Adding Product...
                  </>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </section>

        <aside className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <span>Live Preview</span>
            <p>This is how your product may appear.</p>
          </div>

          <div className={styles.previewCard}>
            <div className={styles.imagePreview}>
              {product.imageUrl && !imageError ? (
                <img
                  src={product.imageUrl}
                  alt={product.name || "Product preview"}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="2" />
                    <path d="m3 17 5-5 4 4 3-3 6 6" />
                  </svg>

                  <span>
                    {imageError ? "Unable to load image" : "Image preview"}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.previewContent}>
              <span className={styles.previewCategory}>
                {product.category || "Category"}
              </span>

              <h2>{product.name || "Product Name"}</h2>

              <p className={styles.previewDescription}>
                {product.description ||
                  "The product description will appear here."}
              </p>

              <div className={styles.previewFooter}>
                <strong>
                  ₹
                  {Number(product.price || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>

               
              </div>
            </div>
          </div>

          <div className={styles.infoBox}>
            <strong>Admin ID</strong>
            <p>
              The admin ID should be assigned by your backend using the
              authenticated user. It should not be entered manually.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default AddProduct;