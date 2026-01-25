import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import { User, CheckSquare, Square, Send, MessageCircle } from 'lucide-react';
import { timeAgo } from '../utils/dateUtils';

// Extracted CommentItem to prevent re-mounting on state changes
const CommentItem = ({
    comment,
    depth = 0,
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,
    isReplyAnonymous,
    setIsReplyAnonymous,
    handlePost,
    loading
}) => {
    const isReplying = replyingTo === comment._id;
    const replyInputRef = useRef(null);

    // Auto-resize reply input
    useEffect(() => {
        if (isReplying && replyInputRef.current) {
            replyInputRef.current.style.height = 'auto';
            replyInputRef.current.style.height = replyInputRef.current.scrollHeight + 'px';
            replyInputRef.current.focus();
        }
    }, [replyContent, isReplying]);

    return (
        <div className={`flex flex-col ${depth > 0 ? 'ml-12 mt-4' : 'mb-6 border-b border-[rgba(255,255,255,0.05)] pb-6 last:border-0'}`}>
            <div className="flex gap-4 group">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 border border-[var(--border)] group-hover:border-[var(--text-secondary)] transition-colors">
                    {!comment.userId ? (
                        <User size={16} className="text-[var(--text-secondary)] opacity-50" />
                    ) : (
                        <span className="font-bold text-xs text-[var(--text-primary)]">
                            {(comment.userId.username || 'U')[0].toUpperCase()}
                        </span>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">
                            {!comment.userId ? 'Anonymous' : '@' + (comment.userId.username || 'user')}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]">•</span>
                        <span className="text-xs text-[var(--text-secondary)]">
                            {timeAgo(comment.createdAt)}
                        </span>
                    </div>

                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-2">{comment.content}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-colors uppercase tracking-wide"
                        >
                            <MessageCircle size={14} /> Reply
                        </button>
                    </div>

                    {/* Reply Input */}
                    {isReplying && (
                        <form onSubmit={(e) => handlePost(e, replyContent, comment._id, isReplyAnonymous)} className="mt-4 mb-4 animate-fade-in pl-4 border-l-2 border-[var(--border)]">
                            <div className="relative border-b border-[var(--border)] focus-within:border-white transition-colors">
                                <textarea
                                    ref={replyInputRef}
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Reply to ${!comment.userId ? 'Anonymous' : '@' + (comment.userId.username || 'user')}...`}
                                    className="w-full bg-transparent text-white placeholder-[var(--text-muted)] focus:outline-none resize-none py-2 text-sm"
                                    style={{ minHeight: '32px', maxHeight: '150px' }}
                                    rows={1}
                                />
                            </div>
                            <div className="flex justify-end items-center mt-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsReplyAnonymous(!isReplyAnonymous)}
                                    className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
                                >
                                    {isReplyAnonymous ? <CheckSquare size={14} className="text-[var(--accent)]" /> : <Square size={14} />}
                                    <span>Anonymous</span>
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setReplyingTo(null)}
                                        className="text-xs font-bold text-[var(--text-secondary)] hover:text-white"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !replyContent.trim()}
                                        className="px-4 py-1.5 rounded-full bg-[#3ea6ff] text-black font-bold text-xs hover:bg-[#65b8ff] disabled:opacity-50"
                                    >
                                        REPLY
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="flex flex-col">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            depth={depth + 1}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            isReplyAnonymous={isReplyAnonymous}
                            setIsReplyAnonymous={setIsReplyAnonymous}
                            handlePost={handlePost}
                            loading={loading}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentSection = ({ opinionId, comments, setComments }) => {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null); // ID of comment being replied to
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isReplyAnonymous, setIsReplyAnonymous] = useState(false);

    // Refs for auto-sizing inputs
    const mainInputRef = useRef(null);

    // Auto-resize main input
    useEffect(() => {
        if (mainInputRef.current) {
            mainInputRef.current.style.height = 'auto';
            mainInputRef.current.style.height = mainInputRef.current.scrollHeight + 'px';
        }
    }, [newComment]);

    const handlePost = async (e, content, parentId = null, anonymous = false) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await api.post('/comments', {
                content: content,
                opinionId,
                parentId,
                isAnonymous: anonymous
            });

            const commentsRes = await api.get(`/comments/${opinionId}`);
            setComments(commentsRes.data);

            if (parentId) {
                setReplyingTo(null);
                setReplyContent('');
                setIsReplyAnonymous(false);
            } else {
                setNewComment('');
                if (mainInputRef.current) mainInputRef.current.style.height = 'auto';
                setIsAnonymous(false);
            }
        } catch (err) {
            console.error("Error posting comment:", err);
        } finally {
            setLoading(false);
        }
    };

    // Helper to organize comments into a tree
    const buildCommentTree = (comments) => {
        const commentMap = {};
        const roots = [];

        // Deep copy comments to avoid mutating props or state in place if it causes issues, 
        // though map returns new dictionary. But the objects themselves are references.
        // Better to create shallow copies.
        const commentsCopy = comments.map(c => ({ ...c, replies: [] }));

        commentsCopy.forEach(comment => {
            commentMap[comment._id] = comment;
        });

        commentsCopy.forEach(comment => {
            if (comment.parentId) {
                if (commentMap[comment.parentId]) {
                    commentMap[comment.parentId].replies.push(comment);
                }
            } else {
                roots.push(comment);
            }
        });

        return roots;
    };

    const rootComments = buildCommentTree(comments);

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                {comments.length} Comments
            </h3>

            {/* Main Input - YouTube Style */}
            <form onSubmit={(e) => handlePost(e, newComment, null, isAnonymous)} className="mb-10 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 border border-[var(--border)]">
                    <User size={20} className="text-[var(--text-secondary)]" />
                </div>

                <div className="flex-1">
                    <div className="relative border-b border-[var(--border)] focus-within:border-white transition-colors">
                        <textarea
                            ref={mainInputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-transparent text-white placeholder-[var(--text-muted)] focus:outline-none resize-none py-2"
                            style={{ minHeight: '32px', maxHeight: '200px' }}
                            rows={1}
                        />
                    </div>

                    <div className={`flex items-center justify-end gap-4 mt-3 ${!newComment && 'hidden'}`}>
                        <button
                            type="button"
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                        >
                            {isAnonymous ? <CheckSquare size={18} className="text-[var(--accent)]" /> : <Square size={18} />}
                            <span>Anonymous</span>
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !newComment.trim()}
                            className="px-4 py-2 rounded-full bg-[#3ea6ff] text-black font-bold text-sm hover:bg-[#65b8ff] disabled:opacity-50"
                        >
                            Comment
                        </button>
                    </div>
                </div>
            </form>

            {/* Comment Tree */}
            <div className="rounded-xl p-4" style={{ backgroundColor: '#202020' }}>
                {rootComments.length === 0 ? (
                    <p className="text-[var(--text-secondary)] text-center py-4">No comments yet.</p>
                ) : (
                    rootComments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            isReplyAnonymous={isReplyAnonymous}
                            setIsReplyAnonymous={setIsReplyAnonymous}
                            handlePost={handlePost}
                            loading={loading}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
