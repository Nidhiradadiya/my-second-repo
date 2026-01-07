import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntApp, message } from 'antd';
import { ThemeProvider } from './contexts/ThemeProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CompanySettings from './pages/company/CompanySettings';
import CustomerList from './pages/customers/CustomerList';
import CustomerLedger from './pages/customers/CustomerLedger';
import ProductList from './pages/products/ProductList';
import BillForm from './pages/bills/BillForm';
import BillList from './pages/bills/BillList';
import BillView from './pages/bills/BillView';
import PaymentList from './pages/payments/PaymentList';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import About from './pages/About'; // Import About
import Services from './pages/Services'; // Import Services
import Contact from './pages/Contact'; // Import Contact
import { authAPI } from './services/api';

// Configure message globally
message.config({
    top: 24,
    duration: 3,
    maxCount: 3,
});

import SystemLayout from './components/SystemLayout';

// Protected Route Component
function ProtectedRoute({ children }) {
    const user = authAPI.getCurrentUser();
    return user ? (
        <SystemLayout>
            {children}
        </SystemLayout>
    ) : <Navigate to="/login" replace />;
}

function App() {
    return (
        <ThemeProvider>
            <AntApp>
                <Router>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/contact" element={<Contact />} /> {/* Add Contact Route */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings/company"
                            element={
                                <ProtectedRoute>
                                    <CompanySettings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/customers"
                            element={
                                <ProtectedRoute>
                                    <CustomerList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/customers/:id/ledger"
                            element={
                                <ProtectedRoute>
                                    <CustomerLedger />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/products"
                            element={
                                <ProtectedRoute>
                                    <ProductList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bills"
                            element={
                                <ProtectedRoute>
                                    <BillList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bills/new"
                            element={
                                <ProtectedRoute>
                                    <BillForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bills/:id"
                            element={
                                <ProtectedRoute>
                                    <BillView />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/payments"
                            element={
                                <ProtectedRoute>
                                    <PaymentList />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AntApp>
        </ThemeProvider >
    );
}

export default App;
