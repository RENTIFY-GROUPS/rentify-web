import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const Listings = lazy(() => import('./pages/Listings'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const LandlordDashboard = lazy(() => import('./pages/landlords/Dashboard'));
const TenantDashboard = lazy(() => import('./pages/tenants/Dashboard'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));

function App() {
  return (
    <Router>
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/landlord" element={<LandlordDashboard />} />
            <Route path="/tenant" element={<TenantDashboard />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
