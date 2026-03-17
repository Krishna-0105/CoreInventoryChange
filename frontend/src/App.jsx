import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import Analytics from "./pages/Analytics"
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Receipts from './pages/Receipts'
import Deliveries from './pages/Deliveries'
import Transfers from './pages/Transfers'
import Adjustments from './pages/Adjustments'
import ReceiptDetails from './pages/ReceiptDetails'
import DeliveryDetails from './pages/DeliveryDetails' 
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from "./pages/ResetPassword"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position='top-right' />

        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path='/products'
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path='/receipts'
            element={
              <ProtectedRoute>
                <Layout>
                  <Receipts />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path='/receipts/:id'
            element={
              <ProtectedRoute>
                <Layout>
                  <ReceiptDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path='/deliveries'
            element={
              <ProtectedRoute>
                <Layout>
                  <Deliveries />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path='/deliveries/:id'
            element={
              <ProtectedRoute>
                <Layout>
                  <DeliveryDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path='/transfers'
            element={
              <ProtectedRoute>
                <Layout>
                  <Transfers />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path='/adjustments'
            element={
              <ProtectedRoute>
                <Layout>
                  <Adjustments />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ✅ Analytics Route (FIXED) */}
          <Route
            path='/analytics'
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App