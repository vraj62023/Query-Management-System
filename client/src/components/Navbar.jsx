import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react"; // 1. Added useState
import AuthContext from "../context/AuthContext"; 
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // 2. State for Mobile Menu
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsOpen(false); // Close menu on logout
        navigate("/");
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    {/* LEFT SIDE: LOGO */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                            {/* Adjusted size to h-12 w-12 so it fits in the h-16 navbar without overflowing */}
                            <div className="h-12 w-12 flex items-center justify-center">
                                <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                            </div>
                            <span className="text-xl font-bold text-slate-800 tracking-tight">
                                Query<span className="text-blue-600">Flow</span>
                            </span>
                        </Link>
                    </div>

                    {/* RIGHT SIDE: DESKTOP BUTTONS (Hidden on Mobile) */}
                    {/* Added 'hidden md:flex' -> This hides it on small screens */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-slate-500 font-medium">
                                    Hello, {user.name}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="text-slate-600 hover:text-red-600 font-medium text-sm transition-colors"
                                >
                                    Logout
                                </button>
                                <Link 
                                    to="/dashboard"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login"
                                    className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link 
                                    to="/register"
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* NEW: MOBILE HAMBURGER BUTTON (Visible only on Mobile) */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-blue-600 focus:outline-none p-2"
                        >
                            {isOpen ? (
                                // X Icon
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                // Hamburger Icon
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* NEW: MOBILE MENU DROPDOWN */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-sm text-slate-500 font-medium border-b border-gray-100 mb-2">
                                    Signed in as: <span className="font-bold text-slate-900">{user.name}</span>
                                </div>
                                <Link 
                                    to="/dashboard" 
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    Log In
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;