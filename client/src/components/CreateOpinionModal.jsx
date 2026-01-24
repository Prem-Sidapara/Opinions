import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateOpinionModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [isAnonymous, setIsAnonymous] = useState(false);

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

                <form className="flex flex-col gap-4">
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
                        <input
                            type="text"
                            placeholder="What's on your mind?"
                            className="input"
                            style={{ fontSize: '1.1rem', padding: '0.8rem 1rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
                        <select className="input" style={{ appearance: 'none' }}>
                            <option value="">Select a category</option>
                            <option value="technology">Technology</option>
                            <option value="politics">Politics</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="sports">Sports</option>
                            <option value="science">Science</option>
                            <option value="health">Health</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Content</label>
                        <textarea
                            placeholder="Express your thoughts..."
                            className="input"
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

                    <button className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.8rem', fontSize: '1rem' }}>
                        Post Opinion
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateOpinionModal;
