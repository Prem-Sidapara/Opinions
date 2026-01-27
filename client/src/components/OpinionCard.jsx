import React from 'react';
import { MessageSquare, Heart } from 'lucide-react';

const OpinionCard = ({ item, onClick, expanded = false }) => {
    return (
        <div
            onClick={onClick}
            className="card p-4 md:p-6"
            style={{
                cursor: onClick ? 'pointer' : 'default',
                background: '#0e1013',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '200px',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
        >
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
                        {item.topic}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {item.title && (
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        lineHeight: '1.3',
                        marginBottom: '0.75rem',
                        color: 'var(--text-primary)',
                    }}>
                        {item.title}
                    </h3>
                )}

                <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    display: expanded ? 'block' : '-webkit-box',
                    WebkitLineClamp: expanded ? 'none' : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: expanded ? 'visible' : 'hidden',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    whiteSpace: 'pre-wrap'
                }}>
                    {item.content}
                </p>
            </div>

            <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: !item.userId ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {!item.userId ? 'Anonymous' : '@' + (item.userId.username || 'user')}
                </span>

                <div className="flex items-center gap-4" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart size={16} /> <span style={{ fontSize: '0.8rem' }}>{item.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <MessageSquare size={16} /> <span style={{ fontSize: '0.8rem' }}>{item.commentsCount || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpinionCard;
