# Rentify

Rentify is a full-stack web application designed to facilitate property rentals, connecting landlords, tenants, and roommates through a comprehensive platform. The project consists of a React-based frontend and a Node.js/Express backend, providing features such as property listings, user authentication, messaging, payments, reviews, and more.

---

## Project Structure

- **clients/**  
  The frontend React application. Contains all UI components, pages, context providers, and utilities.  
  Key folders and files:  
  - `src/components/` - Reusable UI components (e.g., Carousel, Chatbot, PropertyCard)  
  - `src/pages/` - Application pages (e.g., Home, Listings, PropertyDetails, Account, AdminDashboard)  
  - `src/context/` - React context providers (e.g., ThemeContext)  
  - `src/utils/` - Utility functions (e.g., API calls, authentication helpers)  
  - `public/` - Static assets and HTML template  
  - `package.json` - Frontend dependencies and scripts  

- **server/**  
  The backend Node.js/Express API server. Handles data models, routes, middleware, and utilities.  
  Key folders and files:  
  - `models/` - Mongoose models for entities like User, Property, Review, Conversation, Payment, etc.  
  - `routes/` - Express route handlers for different API endpoints (e.g., auth, properties, payments, reviews)  
  - `middleware/` - Custom middleware for authentication, file uploads, etc.  
  - `utils/` - Helper utilities (e.g., email, encryption, SMS)  
  - `server.js` - Entry point for the backend server  
  - `package.json` - Backend dependencies and scripts  

---

## Technologies Used

- Frontend: React, Tailwind CSS, React Router, Context API  
- Backend: Node.js, Express, MongoDB (via Mongoose)  
- Authentication: JWT-based auth middleware  
- File Uploads: Cloudinary integration  
- Payment Processing: Payment routes (likely integrated with payment gateways)  
- Messaging: Real-time chat components and conversation models  
- Other: Email and SMS utilities for notifications  

---

## Installation

### Prerequisites

- Node.js (v14 or higher recommended)  
- npm or yarn  
- MongoDB instance (local or cloud)  
- Cloudinary account (for image uploads)  
- Payment gateway credentials (if applicable)  

### Setup Backend

1. Navigate to the `server` directory:  
   ```bash
   cd server
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Create a `.env` file in the `server` directory and add necessary environment variables (e.g., database URI, JWT secret, Cloudinary keys).  
4. Start the backend server:  
   ```bash
   npm start
   ```  
   The backend server will typically run on `http://localhost:5000` (confirm in `server.js`).  

### Setup Frontend

1. Navigate to the `clients` directory:  
   ```bash
   cd clients
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Start the frontend development server:  
   ```bash
   npm start
   ```  
   The frontend will typically run on `http://localhost:3000`.  

---

## Running the Project

- Start the backend server first (`server` directory).  
- Then start the frontend development server (`clients` directory).  
- Access the application via the frontend URL (usually `http://localhost:3000`).  

---

## Features

- User authentication and authorization (login, registration, two-factor auth)  
- Property listings with detailed views and search functionality  
- Messaging system for conversations between users  
- Payment processing and history tracking  
- Reviews and ratings for properties and users  
- Roommate matching and questionnaires  
- Admin dashboard for managing users, properties, and content  
- Responsive UI with various interactive components (carousel, modals, chatbots)  
- Notifications via email and SMS  

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.  
2. Create a new branch for your feature or bugfix.  
3. Make your changes and commit with clear messages.  
4. Push your branch and open a pull request.  

Please ensure your code follows the existing style and includes appropriate tests where applicable.

---

## License

Add your project license here.

---

This README provides an overview and instructions to get started with the Rentify project. For detailed documentation, please refer to individual module READMEs or comments within the codebase.
