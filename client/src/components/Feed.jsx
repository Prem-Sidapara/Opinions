import React from 'react';
import { MessageSquare, Heart, Share2 } from 'lucide-react';

const Feed = () => {
    // Dummy data for text opinions
    const items = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        title: i % 2 === 0 ? "The future of AI is not what you think" : "Why remote work is here to stay",
        category: i % 3 === 0 ? "Technology" : (i % 3 === 1 ? "Work" : "Politics"),
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        author: i % 4 === 0 ? "Anonymous" : `User ${i + 1}`,
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 50),
        time: '2h ago',
    }));

    return (
        <div className="flex-1" style={{ padding: '2.5rem 0' }}>
            <div className="flex items-center justify-between mb-6">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Trending Opinions</h1>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem'
            }}>
                {items.map((item) => (
                    <div key={item.id} className="card" style={{
                        padding: '1.5rem',
                        cursor: 'pointer',
                        background: '#0e1013',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '200px',
                        color: 'white',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}>
                        <div className="p-2">
                            <div className="flex items-center justify-between mb-3">
                                <span style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    color: 'var(--accent)',
                                    fontWeight: '800',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    padding: '3px 8px',
                                    borderRadius: '12px'
                                }}>
                                    {item.category}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.time}</span>
                            </div>

                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                lineHeight: '1.3',
                                marginBottom: '0.75rem',
                                color: 'var(--text-primary)',
                            }}>
                                {item.title}
                            </h3>

                            <p style={{
                                fontSize: '0.95rem',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.5',
                                marginBottom: '1.5rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {item.content}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: item.author === 'Anonymous' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                {item.author === 'Anonymous' ? 'Anonymous' : '@' + item.author.replace(' ', '').toLowerCase()}
                            </span>

                            <div className="flex items-center gap-4" style={{ color: 'var(--text-secondary)' }}>
                                <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                    <Heart size={16} /> <span style={{ fontSize: '0.8rem' }}>{item.likes}</span>
                                </div>
                                <div className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                    <MessageSquare size={16} /> <span style={{ fontSize: '0.8rem' }}>{item.comments}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feed;
