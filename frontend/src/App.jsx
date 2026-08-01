import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Review from './pages/Review';
import History from './pages/History';
import Profile from './pages/Profile';
import ExplainCode from './pages/ExplainCode';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard Pages */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/review" element={<Review />} />
                      <Route path="/explain-code" element={<ExplainCode />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Profile />} />
                      {/* Catch-all fallback */}
                      <Route path="*" element={<Dashboard />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
