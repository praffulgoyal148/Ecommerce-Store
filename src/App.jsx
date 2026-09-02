import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import AdminProducts from "./pages/admin/AdminProducts";
import UpdateProduct from "./pages/admin/UpdateProduct";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        {/* <Route path="/logout" element={<Login />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
        <Route path="/view-admin-products" element={<AdminProducts />} />

        {/* 
              Yeh neeche wale sab <Outlet /> ke through 
              access honge inside ProtectedRoute......
        */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-new-product" element={<AddProduct />} />
          <Route path="/product-details/:id" element={<ProductPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;