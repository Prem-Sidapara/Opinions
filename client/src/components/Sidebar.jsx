import React from 'react';
import { Filter, Star, Clock, Flame } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside style={{
            width: '240px',
            flexShrink: 0,
            height: 'calc(100vh - var(--header-height))',
            position: 'sticky',
            top: 'var(--header-height)',
            overflowY: 'auto',
            padding: '1.5rem 0',
            borderRight: '1px solid var(--border)'
        }} className="hidden-mobile">

            <div className="mb-6 px-4">
                <h3 style={{
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    marginBottom: '1rem',
                    fontWeight: '700',
                    letterSpacing: '1px'
                }}>
                    Sort By
                </h3>
                <ul className="flex flex-col gap-2">
                    <li className="sidebar-item active">
                        <Flame size={18} /> <span>Trending</span>
                    </li>
                    <li className="sidebar-item">
                        <Clock size={18} /> <span>Newest</span>
                    </li>
                    <li className="sidebar-item">
                        <Star size={18} /> <span>Top Rated</span>
                    </li>
                </ul>
            </div>

            <div className="px-4">
                <h3 style={{
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    marginBottom: '1rem',
                    fontWeight: '700',
                    letterSpacing: '1px'
                }}>
                    Categories
                </h3>
                <div className="flex flex-col gap-2">
                    {['Technology', 'Politics', 'Entertainment', 'Sports', 'Science', 'Health'].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                            <input type="checkbox" className="accent-red-600" />
                            <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <style>{`
                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 0.75rem;
                    border-radius: var(--radius);
                    cursor: pointer;
                    color: var(--text-secondary);
                    transition: all 0.2s;
                    font-weight: 500;
                }
                .sidebar-item:hover {
                    background-color: var(--bg-tertiary);
                    color: var(--text-primary);
                }
                .sidebar-item.active {
                    background-color: rgba(229, 9, 20, 0.1);
                    color: var(--accent);
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;
