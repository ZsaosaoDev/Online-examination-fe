import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    return (
        <nav className="custom-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">C</span>
                    <span className="logo-text">Clyvasync</span>
                </Link>

                <div className="navbar-links">
                    {token ? (
                        <>
                            <Link to="/dashboard" className="nav-link">
                                <motion.span whileHover={{ color: '#2563eb' }}>Dashboard</motion.span>
                            </Link>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout} 
                                className="nav-btn btn-logout"
                            >
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                <motion.span whileHover={{ color: '#2563eb' }}>Login</motion.span>
                            </Link>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link to="/register" className="nav-btn btn-register">Get Started</Link>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
