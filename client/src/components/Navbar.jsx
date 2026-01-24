import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo-fix.png';
import { Search, Menu, PenTool, User, LogOut } from 'lucide-react';
import CreateOpinionModal from './CreateOpinionModal';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search logic later
        console.log("Searching for:", searchQuery);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-[#202020]" style={{ height: 'var(--header-height)' }}>
                <div className="container h-full flex items-center justify-between gap-4">
                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center gap-1 shrink-0">
                        <img src={logo} alt="Opinions" className="h-[60px] w-auto" />
                        <span className="text-2xl font-bold text-white tracking-tighter">
                            OPINIONS
                        </span>
                    </Link>

                    {/* Center: Search Bar */}
                    <div className="flex-1 max-w-xl px-4">
                        <form onSubmit={handleSearch} className="relative flex items-center w-full">
                            <input
                                type="text"
                                placeholder="Search for opinions..."
                                className="w-full bg-[#000000] border border-[#333] rounded-full py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-3 text-[#FF6B35] hover:text-white transition-colors">
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex gap-3 items-center shrink-0">
                        {user ? (
                            <>
                                <button
                                    className="btn btn-primary py-2 px-4 text-sm"
                                    title="Write Opinion"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <PenTool size={16} className="mr-2" />
                                    <span>Post</span>
                                </button>
                                <div className="flex items-center gap-3 pl-4 ml-2 border-l border-[#333]">
                                    <span className="font-semibold text-sm text-white">{user.username}</span>
                                    <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg text-red-500 transition-colors" title="Logout">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-4 items-center">
                                <Link to="/login" className="text-[18px] text-white hover:text-[#FF6B35] transition-colors">
                                    Login
                                </Link>
                                <Link to="/register">
                                    <button className="btn btn-primary h-10 w-28 border border-none rounded-full px-5 text-[18px]">Sign up</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Empty Sub-Navbar */}
            <div className="h-10 w-full bg-black"></div>

            <CreateOpinionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Navbar;
