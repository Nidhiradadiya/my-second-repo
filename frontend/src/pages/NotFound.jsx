import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="error-code">404</div>
                <h1>Page Not Found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <div className="not-found-actions">
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
