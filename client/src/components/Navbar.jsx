import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo-fix.png';
import { Search, Menu, PenTool, User, LogOut, LayoutList, LayoutGrid, ChevronDown } from 'lucide-react';
import CreateOpinionModal from './CreateOpinionModal';
import api from '../utils/api';

const Navbar = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [viewMode, setViewMode] = useState(searchParams.get('view') || 'blog');

    const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Sync state with URL changes (e.g. back button)
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
        setViewMode(searchParams.get('view') || 'blog');
    }, [searchParams]);

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
        const params = new URLSearchParams(searchParams);
        if (searchQuery.trim()) {
            params.set('search', searchQuery.trim());
        } else {
            params.delete('search');
        }
        // When searching, we usually want to reset to page 1 or clear other filters if needed
        // For now, let's keep it simple
        setSearchParams(params);
        navigate(`/?${params.toString()}`);
    };

    const updateViewMode = (mode) => {
        setViewMode(mode);
        const params = new URLSearchParams(searchParams);
        params.set('view', mode);
        setSearchParams(params);
        setIsViewMenuOpen(false);
        if (window.location.pathname !== '/') {
            navigate(`/?${params.toString()}`);
        }
    };

    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [topics, setTopics] = useState([]);
    const categoryRef = useRef(null);

    // Fetch topics on mount
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await api.get('/topics');
                // Deduplicate topics
                const uniqueTopics = Array.from(new Map(res.data.map(item => [item.name, item])).values());
                setTopics(uniqueTopics);
            } catch (err) {
                console.error("Failed to fetch topics", err);
                // Fallback
                setTopics([
                    { _id: '1', name: 'Technology' },
                    { _id: '2', name: 'Politics' },
                    { _id: '3', name: 'Sports' }
                ]);
            }
        };
        fetchTopics();
    }, []);

    // Close categories dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoriesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCategoryClick = (category) => {
        const params = new URLSearchParams(searchParams);
        if (category === 'All') {
            params.delete('topic');
        } else {
            params.set('topic', category);
        }
        setSearchParams(params);
        setIsCategoriesOpen(false);
        if (window.location.pathname !== '/') {
            navigate(`/?${params.toString()}`);
        }
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-[#202020] h-[60px] flex-none">
                <div className="container h-full flex items-center justify-between gap-2 md:gap-4">
                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center gap-1 shrink-0">
                        <img src={logo} alt="Opinions" className="h-[40px] md:h-[60px] w-auto" />
                        <span className="text-xl md:text-2xl font-bold text-white tracking-tighter hidden md:block">
                            OPINIONS
                        </span>
                    </Link>

                    {/* Center: Search Bar & View Toggle */}
                    <div className="flex-1 max-w-2xl px-2 md:px-4 flex items-center gap-2">
                        <form onSubmit={handleSearch} className="relative flex items-center flex-1">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-[#000000] border border-[#333] rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-3 text-[#FF6B35] hover:text-white transition-colors">
                                <Search size={18} />
                            </button>
                        </form>

                        {/* View Dropdown - Hidden on very small screens if needed, or kept compact */}
                        <div id='view-dropdown' className="relative hidden md:block" ref={dropdownRef}>
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
                                        onClick={() => updateViewMode('blog')}
                                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#202020] transition-colors ${viewMode === 'blog' ? 'text-[#FF6B35]' : 'text-white'}`}
                                    >
                                        <LayoutList size={16} />
                                        <span>Blog Style</span>
                                    </button>
                                    <button
                                        onClick={() => updateViewMode('youtube')}
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
                    <div className="flex gap-2 min-w-0 md:gap-3 items-center shrink-0">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div> // Skeleton
                        ) : user ? (
                            <>
                                <div className="flex items-center gap-3 pl-2 md:pl-4 md:ml-2 md:border-l border-[#333]">
                                    <Link to="/profile" className="text-white hover:text-[#FF6B35] transition-colors" title="Profile">
                                        <User size={20} />
                                    </Link>
                                    <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg text-red-500 transition-colors hidden md:block" title="Logout">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-2 md:gap-4 items-center">
                                <Link to="/login" className="text-sm md:text-[18px] text-white hover:text-[#FF6B35] transition-colors">
                                    Login
                                </Link>
                                <Link to="/register">
                                    <button className="btn btn-primary h-8 md:h-10 w-auto md:w-28 border border-none rounded-full px-3 md:px-5 text-sm md:text-[18px]">Sign up</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="h-10 w-full bg-[#111111] flex-none">
                <div className="container h-full flex items-center justify-between overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-4 md:gap-8 h-full whitespace-nowrap px-1">
                        {['Trending', 'Hot Topics'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase().replace(' ', '-')}`}
                                className="flex items-center text-sm md:text-lg font-medium text-white hover:text-[#FF6B35] transition-colors h-full border-b-2 border-transparent hover:border-[#FF6B35]"
                            >
                                {item}
                            </Link>
                        ))}

                        {/* Categories Dropdown */}
                        <div className="relative h-full flex items-center" ref={categoryRef}>
                            <button
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className={`flex items-center gap-1 text-sm md:text-lg font-medium transition-colors h-full border-b-2 ${isCategoriesOpen ? 'text-[#FF6B35] border-[#FF6B35]' : 'text-white border-transparent hover:text-[#FF6B35] hover:border-[#FF6B35]'}`}
                            >
                                Categories
                                <ChevronDown size={14} className={`transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCategoriesOpen && (
                                <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                                    <button
                                        onClick={() => handleCategoryClick('All')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#252525] transition-colors"
                                    >
                                        All Categories
                                    </button>
                                    <button
                                        onClick={() => handleCategoryClick('Unpopular Opinion')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#252525] transition-colors"
                                    >
                                        Unpopular Opinion
                                    </button>
                                    {topics.filter(t => t.name !== 'Unpopular Opinion').map(topic => (
                                        <button
                                            key={topic._id}
                                            onClick={() => handleCategoryClick(topic.name)}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#252525] transition-colors"
                                        >
                                            {topic.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {['Polls', 'Debates', 'Communities', 'Ask'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className="flex items-center text-sm md:text-lg font-medium text-white hover:text-[#FF6B35] transition-colors h-full border-b-2 border-transparent hover:border-[#FF6B35]"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {user && (
                        <button
                            className="btn btn-primary py-1 px-3 md:px-4 text-sm md:text-lg h-7 ml-4 shrink-0"
                            title="Write Opinion"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <PenTool size={14} className="mr-1 md:mr-2" />
                            <span>Post</span>
                        </button>
                    )}
                </div>
            </div>

            {isModalOpen && <CreateOpinionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default Navbar;
