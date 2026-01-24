import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
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
            <nav style={{
                height: 'var(--header-height)',
                backgroundColor: '#202020',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div className="container flex items-center justify-between h-full gap-4">
                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none', flexShrink: 0 }}>
                        <img src={logo} alt="Opinions" style={{ height: '32px', width: 'auto' }} />
                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                            OPINIONS
                        </span>
                    </Link>

                    {/* Center: Search Bar */}
                    <div className="flex-1 max-w-2xl px-4">
                        <form onSubmit={handleSearch} className="relative flex items-center w-full">
                            <input
                                type="text"
                                placeholder="Search for opinions..."
                                className="input"
                                style={{
                                    paddingRight: '2.5rem',
                                    backgroundColor: '#121212',
                                    border: '1px solid #333'
                                }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-3" style={{ color: 'var(--text-secondary)' }}>
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex gap-3 items-center flex-shrink-0">
                        {user ? (
                            <>
                                <button
                                    className="btn btn-primary"
                                    title="Write Opinion"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <PenTool size={18} style={{ marginRight: '0.5rem' }} />
                                    <span>Post</span>
                                </button>
                                <div className="flex items-center gap-2" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>{user.username}</span>
                                    <button onClick={handleLogout} className="btn btn-danger" title="Logout" style={{ padding: '0.4rem' }}>
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" style={{ textDecoration: 'none' }}>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: '600', marginRight: '1rem', cursor: 'pointer' }}>Login</span>
                                </Link>
                                <Link to="/register">
                                    <button className="btn btn-primary">Sign up for free</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Empty Sub-Navbar */}
            <div style={{
                height: '40px',
                backgroundColor: '#000000',
                width: '100%'
            }}></div>

            <CreateOpinionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Navbar;
