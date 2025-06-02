import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';


const NotFoundPage = () => (
    <div className="p-10 text-center text-2xl min-h-screen flex flex-col justify-center items-center bg-custom-black text-white">
        <h1 className="text-6xl font-bold text-custom-orange mb-4">404</h1>
        <p className="text-2xl text-gray-300 mb-2">Oops! Page Not Found.</p>
        <p className="text-gray-500">The page you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/" className="mt-8 bg-custom-orange text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors">
            Go to Homepage
        </Link>
    </div>
);

// Protected Route Component: Only accessible if logged in
const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? children : <Navigate to="/login" replace />;
};

// Public Route Component: Only accessible if NOT logged in (e.g., login, signup, landing)
const PublicRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return !userInfo ? children : <Navigate to="/app" replace />; // Redirect to main app if already logged in
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<PublicRoute> <LandingPage /> </PublicRoute>} />

            <Route path="/login" element={<PublicRoute> <LoginPage /> </PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

            {/* Protected Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            {/* Add other protected routes like /app/favorites, /app/history here */}

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;