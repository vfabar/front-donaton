import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout (Template)
import MainLayout from './components/templates/MainLayout';

// Páginas
import Home from './pages/Home';
import Products from './pages/Products'; // En este caso serían las causas o campañas
import ProductDetail from './pages/ProductDetail';
import MoreInfo from './pages/MoreInfo';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile.jsx';
import CheckoutPayment from './pages/CheckoutPayment';
// Estilos globales
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

function App() {
  return (
    /* Usamos el Template MainLayout para que el Navbar 
       y el Footer aparezcan automáticamente en todas las páginas */
    <MainLayout>
      <div className="diagonal-bg"></div>
      <Routes>
        {/* Inicio: Landing page de la fundación */}
        <Route path="/" element={<Home />} />
        
        {/* Proyectos de donación (Causas) */}
        <Route path="/Products" element={<Products />} />
        <Route path="/Products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout-payment" element={<CheckoutPayment />} />  
        {/* Contacto y error */}
        <Route path="/MoreInfo" element={<MoreInfo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;