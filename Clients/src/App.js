import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './components/Chatbot';
import Joyride from 'react-joyride';

const Home = lazy(() => import('./pages/Home'));
const Listings = lazy(() => import('./pages/Listings'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const LandlordDashboard = lazy(() => import('./pages/landlords/Dashboard'));
const TenantDashboard = lazy(() => import('./pages/tenants/Dashboard'));
const PaymentHistory = lazy(() => import('./pages/tenants/PaymentHistory'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const SavedSearches = lazy(() => import('./pages/SavedSearches'));
const Chat = lazy(() => import('./components/messaging/Chat'));

function App() {
  const [runTour, setRunTour] = useState(false);
  const [steps, setSteps] = useState([
    {
      target: '.navbar',
      content: 'This is the navigation bar where you can find links to different sections of the application.',
    },
    {
      target: '.listings-link',
      content: 'Click here to view all available property listings.',
    },
    {
      target: '.login-link',
      content: 'Log in to your account or register if you are a new user.',
    },
    {
      target: '.chat-link',
      content: 'Access your direct messages here to communicate with other users.',
    },
  ]);

  useEffect(() => {
    // Placeholder for Push Notification permission request
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // Here you would typically subscribe the user to push notifications
          // using a PushManager and send the subscription to your backend.
        } else {
          console.warn('Notification permission denied.');
        }
      });
    }

    // Check if the user has seen the tour before
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRunTour(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      setRunTour(false);
    }
  };

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
            <Route path="/tenant/payment-history" element={<PaymentHistory />} />
            <Route path="/saved-searches" element={<SavedSearches />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Chatbot />
      <Joyride
        run={runTour}
        steps={steps}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
    </Router>
  );
}

export default App;
