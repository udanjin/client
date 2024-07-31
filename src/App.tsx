import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/public/home";
// import UploadProduct from "./pages/admin/product/UploadProduct";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import Order from "./pages/admin/Order";
import Transaction from "./pages/admin/Transaction";
import Product from "./pages/admin/product";
import Cart from "./pages/public/Cart";
import Status from "./pages/public/payment/Status";
import SplitBill from "./pages/public/SplitBill";
import CardDetails from "./pages/public/home/CardDetails";
import Payment from "./pages/public/payment";
import AdminCart from "./pages/admin/Cart/index";
import ProtectedRoutes from "./Components/ProtectedRoutes";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/:tableId" element={<Home />} />
          <Route path="/:tableId/details/:id" element={<CardDetails />} />
          <Route path="/:tableId/cart" element={<Cart />} />
          <Route path="/:tableId/split" element={<SplitBill />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/order-status" element={<Status />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/admin/home" element={<Dashboard />} />
            <Route path="/admin/products" element={<Product />} />
            <Route path="/admin/transactions" element={<Transaction />} />
            <Route path="/admin/cart" element={<AdminCart />} />
            <Route path="/admin/order" element={<Order />} />
          </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
