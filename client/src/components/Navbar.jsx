import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, LayoutDashboard, Calendar } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 px-6 py-4 glass-card mx-4 mt-4 bg-opacity-20 backdrop-blur-md">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/50">
                        <Calendar className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
                        CampusBoard
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <LayoutDashboard size={18} />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
                        >
                            <LogIn size={18} />
                            <span>Club Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
