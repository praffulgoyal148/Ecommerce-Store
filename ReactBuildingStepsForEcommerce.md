React Frontend for JWT-Based MERN E-Commerce App
A complete React frontend for an e-commerce application with:

User signup and login
JWT authentication
Protected user routes
Protected admin routes
Product listing
Category-based product filtering
Product details
Add to cart
User profile
Admin product management
Logout functionality
The backend is assumed to be running correctly at:

http://localhost:4444
1. Project Structure
src/
├── components/
│   ├── AdminRoute.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── admin/
│   │   ├── AddProduct.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── EditProduct.jsx
│   ├── Cart.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── ProductDetails.jsx
│   ├── Products.jsx
│   └── Signup.jsx
├── api.js
├── App.jsx
├── main.jsx
└── styles.css
2. Axios Configuration
Create src/api.js.

import axios from "axios";

const api = axios.create({
  baseURL:
    "http://localhost:4444",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
What This File Does
Sets the backend base URL.
Sends JSON data by default.
Adds the JWT token to protected requests.
5. Authentication Context
Create src/context/AuthContext.jsx.

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(getStoredUser);

  const authenticate = (jwtToken, userData) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(jwtToken);
    setUser(userData);
  };

  const updateUser = (userData) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      authenticate,
      updateUser,
      logout,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
Lazy State Initialization
const [user, setUser] = useState(getStoredUser);
getStoredUser is passed without calling it. React uses it as a lazy initializer and calls it while creating the initial state.

6. Protected User Route
Create src/components/ProtectedRoute.jsx.

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
The replace prop prevents the blocked page from remaining in browser history.

7. Protected Admin Route
Create src/components/AdminRoute.jsx.

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const {
    isAuthenticated,
    isAdmin,
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;
Frontend admin protection improves navigation. The backend middleware remains responsible for actual security.

8. Navigation Bar
Create src/components/Navbar.jsx.

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <nav className="navbar">
      <Link
        to="/products"
        className="brand"
      >
        ShopApp
      </Link>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/products">
              Products
            </Link>

            <Link to="/cart">
              Cart
            </Link>

            <Link to="/dashboard">
              Profile
            </Link>

            {isAdmin && (
              <Link to="/admin">
                Admin
              </Link>
            )}

            <span className="nav-user">
              {user?.username}
            </span>

            <button
              type="button"
              className="nav-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/signup">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
9. Product Card
Create src/components/ProductCard.jsx.

import { Link } from "react-router-dom";

function ProductCard({
  product,
  onAddToCart,
}) {
  return (
    <article className="product-card">
      <img
        src={
          product.imageUrl ||
          "https://placehold.co/400x250?text=Product"
        }
        alt={product.name}
        className="product-image"
      />

      <div className="product-card-body">
        <p className="product-category">
          {product.category || "General"}
        </p>

        <h3>{product.name}</h3>

        <p className="product-price">
          ₹{product.price}
        </p>

        {product.rating !== undefined && (
          <p>Rating: {product.rating}</p>
        )}

        <div className="product-actions">
          <Link
            to={`/products/${product._id}`}
            className="link-button"
          >
            View
          </Link>

          <button
            type="button"
            onClick={() =>
              onAddToCart(product._id)
            }
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
10. Login Page
Create src/pages/Login.jsx.

import { useState } from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "../api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    authenticate,
    isAuthenticated,
  } = useAuth();

  const [formData, setFormData] =
    useState({
      username: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/users/login",
        formData
      );

      const {
        token,
        user,
      } = response.data;

      if (!token || !user) {
        throw new Error(
          "Token or user data was not received."
        );
      }

      authenticate(token, user);

      const redirectPath =
        location.state?.from?.pathname ||
        "/dashboard";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Login</h1>

        <p className="muted">
          Login to continue.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          New user?{" "}
          <Link to="/signup">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
11. Signup Page
Create src/pages/Signup.jsx.

import { useState } from "react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import api from "../api";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();

  const { isAuthenticated } =
    useAuth();

  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        address: formData.address,
      });

      navigate("/login", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Create Account</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="signup-username">
              Username
            </label>

            <input
              id="signup-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="signup-address">
              Address
            </label>

            <textarea
              id="signup-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="input-group">
            <label htmlFor="signup-password">
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Signup"}
          </button>
        </form>

        <p className="auth-switch">
          Already registered?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
12. User Dashboard
Create src/pages/Dashboard.jsx.

import {
  useEffect,
  useState,
} from "react";

import api from "../api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const {
    user,
    updateUser,
  } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(
          "/app/get-user-details"
        );

        const userData =
          response.data.user ||
          response.data;

        updateUser(userData);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load user details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <p className="page-message">
        Loading profile...
      </p>
    );
  }

  return (
    <main className="page-container">
      <section className="panel">
        <p className="eyebrow">
          User Profile
        </p>

        <h1>
          Welcome, {user?.username}
        </h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="profile-grid">
          <div>
            <strong>Username</strong>
            <p>{user?.username || "-"}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{user?.email || "-"}</p>
          </div>

          <div>
            <strong>Role</strong>
            <p>{user?.role || "user"}</p>
          </div>

          <div>
            <strong>Address</strong>
            <p>{user?.address || "-"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
13. Products Page
Create src/pages/Products.jsx.

import {
  useEffect,
  useState,
} from "react";

import api from "../api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] =
    useState([]);

  const [category, setCategory] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadProducts = async (
    selectedCategory = ""
  ) => {
    setLoading(true);
    setError("");

    try {
      const endpoint = selectedCategory
        ? `/app/get-products/${selectedCategory}`
        : "/app/get-products";

      const response =
        await api.get(endpoint);

      const productData =
        response.data.products ||
        response.data;

      setProducts(
        Array.isArray(productData)
          ? productData
          : []
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCategorySubmit = (
    event
  ) => {
    event.preventDefault();

    loadProducts(
      category.trim().toLowerCase()
    );
  };

  const handleAddToCart = async (
    productId
  ) => {
    try {
      await api.get(
        `/app/add-to-cart/${productId}`
      );

      window.alert(
        "Product added to cart."
      );
    } catch (requestError) {
      window.alert(
        requestError.response?.data?.message ||
          "Unable to add product."
      );
    }
  };

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">
            Store
          </p>

          <h1>Products</h1>
        </div>

        <form
          className="category-form"
          onSubmit={handleCategorySubmit}
        >
          <input
            type="text"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            placeholder="Category"
          />

          <button type="submit">
            Filter
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setCategory("");
              loadProducts();
            }}
          >
            Clear
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <section className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={
                handleAddToCart
              }
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default Products;
14. Product Details Page
Create src/pages/ProductDetails.jsx.

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(
          `/app/get-product/${id}`
        );

        setProduct(
          response.data.product ||
            response.data
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.get(
        `/app/add-to-cart/${id}`
      );

      window.alert(
        "Product added to cart."
      );
    } catch (requestError) {
      window.alert(
        requestError.response?.data?.message ||
          "Unable to add product."
      );
    }
  };

  if (loading) {
    return (
      <p className="page-message">
        Loading product...
      </p>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="error-message">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="product-details">
        <img
          src={
            product?.imageUrl ||
            "https://placehold.co/600x400?text=Product"
          }
          alt={product?.name}
        />

        <div>
          <p className="product-category">
            {product?.category ||
              "General"}
          </p>

          <h1>{product?.name}</h1>

          <p className="product-price">
            ₹{product?.price}
          </p>

          <p>
            {product?.description ||
              "No description available."}
          </p>

          {product?.rating !== undefined && (
            <p>
              Rating: {product.rating}
            </p>
          )}

          <div className="product-actions">
            <button
              type="button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <Link
              to="/products"
              className="link-button secondary-link"
            >
              Back
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
15. Cart Page
Create src/pages/Cart.jsx.

import {
  useEffect,
  useState,
} from "react";

import api from "../api";

function Cart() {
  const [cart, setCart] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get(
          "/app/get-cart"
        );

        const cartData =
          response.data.cart ||
          response.data;

        setCart(
          Array.isArray(cartData)
            ? cartData
            : []
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load cart."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <p className="page-message">
        Loading cart...
      </p>
    );
  }

  return (
    <main className="page-container">
      <h1>Your Cart</h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <section className="cart-list">
          {cart.map((item) => (
            <article
              key={
                item._id ||
                item.productId?._id ||
                item.productId
              }
              className="cart-item"
            >
              <div>
                <h3>
                  {item.name ||
                    item.productId?.name}
                </h3>

                <p>
                  Quantity:{" "}
                  {item.quantity || 1}
                </p>

                {item.productId?.price !==
                  undefined && (
                  <p>
                    Price: ₹
                    {item.productId.price}
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Cart;
16. Admin Dashboard
Create src/pages/admin/AdminDashboard.jsx.

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../api";

function AdminDashboard() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get(
        "/admin/get-products"
      );

      const productData =
        response.data.products ||
        response.data;

      setProducts(
        Array.isArray(productData)
          ? productData
          : []
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load admin products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (
    productId
  ) => {
    const confirmed =
      window.confirm(
        "Delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.get(
        `/admin/delete-product/${productId}`
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product._id !== productId
        )
      );
    } catch (requestError) {
      window.alert(
        requestError.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">
            Admin Area
          </p>

          <h1>Manage Products</h1>
        </div>

        <Link
          to="/admin/add-product"
          className="link-button"
        >
          Add Product
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products uploaded.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>
                    {product.category ||
                      "-"}
                  </td>
                  <td>₹{product.price}</td>
                  <td>
                    {product.rating ??
                      "-"}
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/edit-product/${product._id}`}
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AdminDashboard;
17. Add Product Page
Create src/pages/admin/AddProduct.jsx.

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../api";

const initialFormData = {
  name: "",
  price: "",
  description: "",
  imageUrl: "",
  rating: "",
  category: "",
};

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(initialFormData);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post(
        "/admin/add-product",
        {
          ...formData,
          price: Number(formData.price),
          rating: formData.rating
            ? Number(formData.rating)
            : undefined,
          category:
            formData.category.toLowerCase(),
        }
      );

      navigate("/admin", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <section className="form-panel">
        <h1>Add Product</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">
              Product Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="price">
              Price
            </label>

            <input
              id="price"
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="category">
              Category
            </label>

            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="rating">
              Rating
            </label>

            <input
              id="rating"
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="imageUrl">
              Image URL
            </label>

            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Product"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AddProduct;
18. Edit Product Page
Create src/pages/admin/EditProduct.jsx.

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      price: "",
      description: "",
      imageUrl: "",
      rating: "",
      category: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(
          `/admin/get-product/${id}`
        );

        const product =
          response.data.product ||
          response.data;

        setFormData({
          name: product.name || "",
          price: product.price || "",
          description:
            product.description || "",
          imageUrl:
            product.imageUrl || "",
          rating: product.rating || "",
          category:
            product.category || "",
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await api.post(
        "/admin/update-product",
        {
          id,
          ...formData,
          price: Number(formData.price),
          rating: formData.rating
            ? Number(formData.rating)
            : undefined,
          category:
            formData.category.toLowerCase(),
        }
      );

      navigate("/admin", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="page-message">
        Loading product...
      </p>
    );
  }

  return (
    <main className="page-container">
      <section className="form-panel">
        <h1>Edit Product</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="edit-name">
              Product Name
            </label>

            <input
              id="edit-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="edit-price">
              Price
            </label>

            <input
              id="edit-price"
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="edit-category">
              Category
            </label>

            <input
              id="edit-category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="edit-rating">
              Rating
            </label>

            <input
              id="edit-rating"
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="edit-image">
              Image URL
            </label>

            <input
              id="edit-image"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="edit-description">
              Description
            </label>

            <textarea
              id="edit-description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Product"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default EditProduct;
19. Not Found Page
Create src/pages/NotFound.jsx.

import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page-container">
      <section className="panel">
        <h1>404</h1>

        <p>Page not found.</p>

        <Link
          to="/products"
          className="link-button"
        >
          Go to Products
        </Link>
      </section>
    </main>
  );
}

export default NotFound;
20. Application Routes
Create src/App.jsx.

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import AddProduct from "./pages/admin/AddProduct";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EditProduct from "./pages/admin/EditProduct";

import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Signup from "./pages/Signup";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/products"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />
        </Route>

        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/add-product"
            element={<AddProduct />}
          />

          <Route
            path="/admin/edit-product/:id"
            element={<EditProduct />}
          />
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  );
}

export default App;
In this setup, /products is protected because the backend mounts product routes under /app with authentication middleware.

21. Application Entry Point
Create src/main.jsx.

import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
22. Styling
Create src/styles.css.

* {
  box-sizing: border-box;
}

:root {
  font-family: Inter, Arial, sans-serif;
  color: #1f2937;
  background: #f3f4f6;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
textarea {
  font: inherit;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 11px 16px;
  color: white;
  background: #2563eb;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #1d4ed8;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

a {
  color: #2563eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.navbar {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 5%;
  background: #111827;
}

.brand {
  color: white;
  font-size: 22px;
  font-weight: 800;
}

.brand:hover {
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-links a {
  color: #e5e7eb;
}

.nav-user {
  color: #9ca3af;
}

.nav-button {
  padding: 8px 13px;
  background: #dc2626;
}

.auth-page {
  min-height: calc(100vh - 68px);
  display: grid;
  place-items: center;
  padding: 24px;
}

.auth-card,
.panel,
.form-panel {
  width: 100%;
  max-width: 480px;
  padding: 32px;
  background: white;
  border-radius: 14px;
  box-shadow:
    0 12px 35px
    rgba(0, 0, 0, 0.08);
}

.panel {
  max-width: 760px;
}

.form-panel {
  max-width: 650px;
}

.page-container {
  width: min(1180px, 92%);
  margin: 0 auto;
  padding: 40px 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.page-message {
  padding: 40px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 6px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.muted {
  color: #6b7280;
}

.input-group {
  margin-bottom: 18px;
}

.input-group label {
  display: block;
  margin-bottom: 7px;
  font-size: 14px;
  font-weight: 700;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: #2563eb;
}

.auth-card form > button,
.form-panel form > button {
  width: 100%;
}

.auth-switch {
  margin: 22px 0 0;
  text-align: center;
}

.error-message {
  margin-bottom: 18px;
  padding: 12px 14px;
  color: #991b1b;
  background: #fee2e2;
  border-radius: 8px;
}

.product-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(240px, 1fr));
  gap: 22px;
}

.product-card {
  overflow: hidden;
  background: white;
  border-radius: 13px;
  box-shadow:
    0 8px 24px
    rgba(0, 0, 0, 0.07);
}

.product-image {
  width: 100%;
  height: 210px;
  object-fit: cover;
}

.product-card-body {
  padding: 18px;
}

.product-category {
  margin: 0 0 6px;
  color: #6b7280;
  font-size: 13px;
  text-transform: capitalize;
}

.product-price {
  font-size: 20px;
  font-weight: 800;
}

.product-actions,
.table-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 16px;
  color: white;
  background: #2563eb;
  border-radius: 8px;
}

.link-button:hover {
  background: #1d4ed8;
  text-decoration: none;
}

.secondary-link,
.secondary-button {
  color: #1f2937;
  background: #e5e7eb;
}

.secondary-link:hover,
.secondary-button:hover:not(:disabled) {
  background: #d1d5db;
}

.category-form {
  display: flex;
  gap: 8px;
}

.category-form input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
  padding: 28px;
  background: white;
  border-radius: 14px;
}

.product-details img {
  width: 100%;
  max-height: 480px;
  object-fit: cover;
  border-radius: 10px;
}

.cart-list {
  display: grid;
  gap: 14px;
}

.cart-item {
  padding: 18px;
  background: white;
  border-radius: 10px;
}

.profile-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.profile-grid > div {
  padding: 18px;
  background: #f9fafb;
  border-radius: 10px;
}

.table-wrapper {
  overflow-x: auto;
  background: white;
  border-radius: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

th {
  background: #f9fafb;
}

.danger-button {
  padding: 7px 10px;
  background: #dc2626;
}

@media (max-width: 760px) {
  .navbar,
  .page-header,
  .nav-links,
  .category-form {
    align-items: stretch;
    flex-direction: column;
  }

  .nav-links {
    gap: 12px;
  }

  .product-details {
    grid-template-columns: 1fr;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }
}
23. API Routes Used by the Frontend
Public Routes
Method	Endpoint	Purpose
POST	/users/signup	Create user account
POST	/users/login	Login and receive JWT
Protected User Routes
Method	Endpoint	Purpose
GET	/app/get-products	Get all products
GET	/app/get-products/:category	Get products by category
GET	/app/get-product/:id	Get one product
GET	/app/add-to-cart/:id	Add product to cart
GET	/app/get-cart	Get logged-in user's cart
GET	/app/get-user-details	Get logged-in user details
Protected Admin Routes
Method	Endpoint	Purpose
POST	/admin/add-product	Add a new product
GET	/admin/delete-product/:id	Delete a product
POST	/admin/update-product	Update a product
GET	/admin/get-products	Get admin products
GET	/admin/get-product/:id	Get one admin product
POST	/admin/add-seed-data	Add seed products
24. Expected Login Response
The frontend expects the login API to return:

{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "_id": "USER_ID",
    "username": "kartik",
    "email": "kartik@example.com",
    "role": "user",
    "address": "Delhi"
  }
}
For an admin account:

{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "_id": "ADMIN_ID",
    "username": "admin",
    "role": "admin"
  }
}
25. Authentication Flow
User submits login form
        ↓
POST /users/login
        ↓
Backend returns JWT and user data
        ↓
React stores token and user in localStorage
        ↓
Axios interceptor adds the token to requests
        ↓
Protected backend middleware verifies the token
        ↓
Requested user or admin controller executes
26. Run the Frontend
npm run dev
Open:

http://localhost:5173
27. Important Notes
The JWT token is automatically added to protected requests.
ProtectedRoute checks whether the frontend has a token.
AdminRoute checks whether the stored user has the admin role.
Backend middleware must still verify the JWT and admin role.
The current backend uses GET for add-to-cart and delete-product, so the frontend follows those routes.
For a production project, secure HttpOnly cookies are generally safer than storing JWT tokens in localStorage.