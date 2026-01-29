import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare } from 'lucide-react';
import CommentItem from './CommentItem';

const CommentSection = ({ opinionId }) => {
    const { user, token } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComments();
    }, [opinionId]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/${opinionId}`);
            setComments(structureComments(res.data));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // Transform flat list to tree
    const structureComments = (flatComments) => {
        const commentMap = {};
        const roots = [];

        // First pass: create map and initialize replies array
        flatComments.forEach(c => {
            commentMap[c._id] = { ...c, replies: [] };
        });

        // Second pass: link children to parents
        flatComments.forEach(c => {
            if (c.parentId) {
                if (commentMap[c.parentId]) {
                    commentMap[c.parentId].replies.push(commentMap[c._id]);
                } else {
                    // Parent might be missing or deleted, treat as root or orphan (here root logic safer)
                    // But if our logic is strictly Top->Reply->Reply, orphans shouldn't happen ideally
                    // Fallback to root if parent missing
                    roots.push(commentMap[c._id]);
                }
            } else {
                roots.push(commentMap[c._id]);
            }
        });

        return roots;
    };

    const getAvatarColor = (id) => {
        // Simple hash to color
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/comments`,
                { content: newComment, opinionId, isAnonymous },
                { headers: { 'x-auth-token': token } }
            );

            // Re-fetch to accept simple linear insert and then sort
            // Or manually append. Re-fetch is safer for consistency.
            fetchComments();
            setNewComment('');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error posting comment');
        }
    };

    const handleReply = async (parentId, content) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/comments`,
                { content, opinionId, parentId, isAnonymous }, // User choice for anon persists in replies? Or prompt? Assuming user pref stays or defaults to public. 
                // Let's assume replies inherit the current user's anonymous toggle state at the top creates confusion. 
                // For simplicity, replies use the SAME isAnonymous toggle state as the main input for now, 
                // OR we should let them choose.
                // Best UX: Reply usually mimics the main state unless specified. 
                // We'll use the main `isAnonymous` state for replies too for now.
                { headers: { 'x-auth-token': token } }
            );
            fetchComments();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error replying');
        }
    };

    return (
        <div className="bg-[#0e1013] rounded-2xl p-4 md:p-6 shadow-sm border border-[var(--border)] mt-6 max-w-full overflow-hidden text-white">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-500" />
                Comments
            </h3>

            {/* Add Comment Input */}
            {user ? (
                <div className="mb-8 flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isAnonymous ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'}`}>
                        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <form onSubmit={handleAddComment} className="flex-1">
                        <div className="relative">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full bg-[#1a1d21] border border-[var(--border)] text-white rounded-xl p-4 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[100px] resize-none placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <label className="flex items-center cursor-pointer relative">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-2 text-xs font-medium text-gray-400">Post anonymously</span>
                            </label>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                    </form>
                </div>
            ) : (
                <div className="bg-[#1a1d21] rounded-xl p-6 text-center mb-8 border border-[var(--border)]">
                    <p className="text-gray-400 text-sm">Please log in to participate in the discussion.</p>
                </div>
            )}

            {/* Comment List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map(comment => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            depth={0}
                            onReply={handleReply}
                            replies={comment.replies}
                            getAvatarColor={getAvatarColor}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No comments yet. Be the first to verify!</p>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
