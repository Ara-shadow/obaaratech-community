import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

interface NotFoundProps {
    title?: string;
    message?: string;
}

export default function NotFound({ title, message }: NotFoundProps) {
    return (
        <div className="static-page">
            <div className="static-page-container">
                <div className="not-found">
                    <div className="not-found-icon">📄</div>
                    <h1>{title || "Page Not Found"}</h1>
                    <p>
                        {message || "The page you're looking for is currently under construction or doesn't exist."}
                    </p>
                    <div className="not-found-actions">
                        <Link to="/" className="btn-primary">
                            <Home size={18} />
                            Back to Home
                        </Link>
                        <Link to="/marketplace" className="btn-secondary">
                            <Search size={18} />
                            Browse Marketplace
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}