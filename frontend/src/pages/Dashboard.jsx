import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authAPI.getMe();
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // If failed, try to get from localStorage
                setUser(authAPI.getCurrentUser());
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await authAPI.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <button onClick={handleLogout} className="btn btn-logout">
                    Logout
                </button>
            </div>

            <div className="dashboard-content">
                <div className="welcome-card card">
                    <h2 className="welcome-title">Welcome, {user?.name}! 🎉</h2>
                    <p className="welcome-text">
                        You have successfully logged in to your account.
                    </p>
                    <div className="user-info">
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user?.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">User ID:</span>
                            <span className="info-value">{user?._id}</span>
                        </div>
                    </div>
                </div>

                <div className="features-grid">
                    <div className="feature-card card">
                        <div className="feature-icon">🚀</div>
                        <h3 className="feature-title">Fast & Secure</h3>
                        <p className="feature-description">
                            JWT-based authentication ensures your data is secure and access is fast.
                        </p>
                    </div>

                    <div className="feature-card card">
                        <div className="feature-icon">⚡</div>
                        <h3 className="feature-title">Modern Stack</h3>
                        <p className="feature-description">
                            Built with React, Express, and MongoDB for a modern experience.
                        </p>
                    </div>

                    <div className="feature-card card">
                        <div className="feature-icon">☁️</div>
                        <h3 className="feature-title">Cloud Ready</h3>
                        <p className="feature-description">
                            Deployable on Vercel with serverless architecture.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
