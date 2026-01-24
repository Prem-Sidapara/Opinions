import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo-fix.png';
import { Search, Menu, PenTool, User, LogOut, LayoutList, LayoutGrid, ChevronDown } from 'lucide-react';
import CreateOpinionModal from './CreateOpinionModal';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('blog'); // 'blog' or 'youtube'
    const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        let timer;
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                timer = setTimeout(() => {
                    setIsViewMenuOpen(false);
                }, 300);
            }
            else {
                clearTimeout(timer);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(timer);
        };
    }, []);

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

                    {/* Center: Search Bar & View Toggle */}
                    <div className="flex-1 max-w-2xl px-4 flex items-center gap-2">
                        <form onSubmit={handleSearch} className="relative flex items-center flex-1">
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

                        {/* View Dropdown */}
                        <div id='view-dropdown' className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                                className="flex items-center gap-1 bg-transparent px-3 py-2 text-white"
                            >
                                {viewMode === 'blog' ? <LayoutList size={18} /> : <LayoutGrid size={18} />}
                                <ChevronDown size={16} id='view-dropdown-arrow' strokeWidth={3} className={`hover:text-[#FF6B35] transition-transform ${isViewMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isViewMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-40 bg-[#313131] border border-[#333] rounded-xl shadow-xl overflow-hidden z-50 ">
                                    <button
                                        onClick={() => { setViewMode('blog'); setIsViewMenuOpen(false); }}
                                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#202020] transition-colors ${viewMode === 'blog' ? 'text-[#FF6B35]' : 'text-white'}`}
                                    >
                                        <LayoutList size={16} />
                                        <span>Blog Style</span>
                                    </button>
                                    <button
                                        onClick={() => { setViewMode('youtube'); setIsViewMenuOpen(false); }}
                                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#202020] transition-colors ${viewMode === 'youtube' ? 'text-[#FF6B35]' : 'text-white'}`}
                                    >
                                        <LayoutGrid size={16} />
                                        <span>Youtube Style</span>
                                    </button>
                                </div>
                            )}
                        </div>
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
