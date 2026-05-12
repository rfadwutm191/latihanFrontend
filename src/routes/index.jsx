import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ProdukList from '../pages/ProdukList';
import POSPage from '../pages/POSPage';

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/produk" element={<ProdukList />} />
      <Route path="/pos" element={<POSPage/>} />

      {/* tambah route lain (order, profile, dll) */}
    </Routes>
  );
}

export default MainRoutes;