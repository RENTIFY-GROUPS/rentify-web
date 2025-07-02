import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, propertyId, landlordId }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={amount} propertyId={propertyId} landlordId={landlordId} />
    </Elements>
  );
};

export default CheckoutForm;