import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import './assets/css/App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Register from './pages/Register';
import FoodMap from './pages/FoodMap';
import FoodDetail from './pages/FoodDetail';
import Contact from './pages/Contact';

// Protected Pages
import DonorDashboard from './pages/donor/Dashboard';
import DonorProfile from './pages/donor/Profile';
import DonorFoodForm from './pages/donor/FoodForm';
import DonorDonations from './pages/donor/Donations';
import DonorRatings from './pages/donor/Ratings';

import NgoDashboard from './pages/ngo/Dashboard';
import NgoProfile from './pages/ngo/Profile';
import NgoPickups from './pages/ngo/Pickups';
import NgoDonations from './pages/ngo/Donations';

// Protected Route Components
import PrivateRoute from './components/routing/PrivateRoute';
import DonorRoute from './components/routing/DonorRoute';
import NgoRoute from './components/routing/NgoRoute';

// Error Page
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Header />
          <main className="app-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/food-map" element={<FoodMap />} />
              <Route path="/food/:id" element={<FoodDetail />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Donor Protected Routes */}
              <Route path="/donor/dashboard" element={
                <DonorRoute>
                  <DonorDashboard />
                </DonorRoute>
              } />
              <Route path="/donor/profile" element={
                <DonorRoute>
                  <DonorProfile />
                </DonorRoute>
              } />
              <Route path="/donor/food/add" element={
                <DonorRoute>
                  <DonorFoodForm />
                </DonorRoute>
              } />
              <Route path="/donor/food/edit/:id" element={
                <DonorRoute>
                  <DonorFoodForm />
                </DonorRoute>
              } />
              <Route path="/donor/donations" element={
                <DonorRoute>
                  <DonorDonations />
                </DonorRoute>
              } />
              <Route path="/donor/ratings" element={
                <DonorRoute>
                  <DonorRatings />
                </DonorRoute>
              } />
              
              {/* NGO Protected Routes */}
              <Route path="/ngo/dashboard" element={
                <NgoRoute>
                  <NgoDashboard />
                </NgoRoute>
              } />
              <Route path="/ngo/profile" element={
                <NgoRoute>
                  <NgoProfile />
                </NgoRoute>
              } />
              <Route path="/ngo/pickups" element={
                <NgoRoute>
                  <NgoPickups />
                </NgoRoute>
              } />
              <Route path="/ngo/donations" element={
                <NgoRoute>
                  <NgoDonations />
                </NgoRoute>
              } />
              
              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;