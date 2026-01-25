import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';

const CreateOpinionModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [isAnonymous, setIsAnonymous] = useState(false);
    const [title, setTitle] = useState(''); // Added missing state
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchTopics = async () => {
                try {
                    const res = await api.get('/topics');
                    setTopics(res.data);
                } catch (err) {
                    console.error("Failed to fetch topics", err);
                }
            };
            fetchTopics();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalCategory = category === 'new' ? customCategory : category;

            await api.post('/opinions', {
                title, // Though model might not use it yet, sending it anyway
                content,
                topic: finalCategory,
                isAnonymous
            });
            onClose();
            window.location.reload(); // Simple reload to refresh feed for now
        } catch (err) {
            console.error("Error creating opinion:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '600px',
                padding: '2rem',
                position: 'relative',
                border: '1px solid var(--border)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }} onClick={e => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    color: 'var(--text-secondary)'
                }}>
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Share Your Opinion</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
                        <input
                            type="text"
                            placeholder="What's on your mind?"
                            className="input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={{ fontSize: '1.1rem', padding: '0.8rem 1rem' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
                        <select
                            className="input"
                            style={{ appearance: 'none', marginBottom: category === 'new' ? '1rem' : '0' }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            {topics.map(t => (
                                <option key={t._id} value={t.name}>{t.name}</option>
                            ))}
                            <option value="new">+ Create New Category</option>
                        </select>

                        {category === 'new' && (
                            <input
                                type="text"
                                placeholder="Enter new category name"
                                className="input"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                style={{ fontSize: '1rem', padding: '0.8rem 1rem', marginTop: '0.5rem' }}
                                required
                            />
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Content</label>
                        <textarea
                            placeholder="Express your thoughts..."
                            className="input"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            style={{
                                minHeight: '150px',
                                resize: 'vertical',
                                lineHeight: '1.6'
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                            />
                            <span style={{ color: 'var(--text-primary)' }}>Hide my username (Post Anonymously)</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', padding: '0.8rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Posting...' : 'Post Opinion'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateOpinionModal;
