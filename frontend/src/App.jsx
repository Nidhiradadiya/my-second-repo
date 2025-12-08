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
import { authAPI } from './services/api';

// Configure message globally
message.config({
    top: 24,
    duration: 3,
    maxCount: 3,
});

// Protected Route Component
function ProtectedRoute({ children }) {
    const user = authAPI.getCurrentUser();
    return user ? children : <Navigate to="/login" replace />;
}

function App() {
    return (
        <ThemeProvider>
            <AntApp>
                <Router>
                    <Routes>
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
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AntApp>
        </ThemeProvider >
    );
}

export default App;
