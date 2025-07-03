import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './components/Chatbot';
import Joyride from 'react-joyride';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LiveChatWidget from './components/LiveChatWidget';
import FeedbackWidget from './components/FeedbackWidget';

const Home = lazy(() => import('./pages/Home'));
const Listings = lazy(() => import('./pages/Listings'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const LandlordDashboard = lazy(() => import('./pages/landlords/Dashboard'));
const TenantDashboard = lazy(() => import('./pages/tenants/Dashboard'));
const PaymentHistory = lazy(() => import('./pages/tenants/PaymentHistory'));
const RentCalculator = lazy(() => import('./pages/tenants/RentCalculator'));
const MovingChecklist = lazy(() => import('./pages/tenants/MovingChecklist'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const SavedSearches = lazy(() => import('./pages/SavedSearches'));
const Chat = lazy(() => import('./components/messaging/Chat'));
const TwoFactorAuth = lazy(() => import('./pages/auth/TwoFactorAuth'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

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
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <Navbar />
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
                <Route path="/tenant/rent-calculator" element={<RentCalculator />} />
                <Route path="/tenant/moving-checklist" element={<MovingChecklist />} />
                <Route path="/tenant/roommate-questionnaire" element={<RoommateQuestionnaire />} />
                <Route path="/tenant/roommate-matches" element={<RoommateMatches />} />
                <Route path="/saved-searches" element={<SavedSearches />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/shared-wishlist/:userId" element={<SharedWishlist />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/forum" element={<ForumList />} />
                <Route path="/forum/:id" element={<ForumPostDetail />} />
                <Route path="/settings/2fa" element={<TwoFactorAuth />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <Chatbot />
          <LiveChatWidget />
          <FeedbackWidget />
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
        </ThemeProvider>
      </I18nextProvider>
    </Router>
  );
}

export default App;
