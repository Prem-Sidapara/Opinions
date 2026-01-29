import React, { useState } from 'react';
import { User, MessageSquare, ChevronDown, ChevronUp, Reply } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CommentItem = ({ comment, depth = 0, onReply, replies, getAvatarColor, parentAuthor }) => {
    const { user } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(true);

    const isAnonymous = !comment.userId.username || comment.userId.username === 'Anonymous';
    const authorName = isAnonymous ? 'Anonymous' : comment.userId.username;
    const authorId = comment.userId._id;

    // Parent Info
    const parentName = parentAuthor ? (parentAuthor.username === 'Anonymous' || !parentAuthor.username ? 'Anonymous' : parentAuthor.username) : null;
    const parentId = parentAuthor ? parentAuthor._id : null;
    const parentColor = parentId ? getAvatarColor(parentId) : null; // Use same hash logic for parent color

    // Determine user color (consistent for both Anon and Public based on ID)
    const userColor = getAvatarColor(authorId);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        onReply(comment._id, replyContent);
        setReplyContent('');
        setIsReplying(false);
        setShowReplies(true);
    };

    const indentation = depth * 20;

    const canReply = depth < 2;

    return (
        <div className={`flex flex-col mb-4 ${depth > 0 ? 'ml-3 md:ml-6 border-l-2 border-gray-700 pl-3 md:pl-4' : ''}`}>
            {/* Header / Content */}
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}
                    style={{ backgroundColor: userColor }}
                >
                    {isAnonymous ? (
                        <User size={16} />
                    ) : (
                        authorName.charAt(0).toUpperCase()
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="bg-[#1a1d21] rounded-2xl px-4 py-2 inline-block max-w-full break-words border border-[var(--border)]">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                                className="font-semibold text-sm text-gray-200 truncate max-w-[150px]"
                            >
                                {authorName}
                            </span>

                            {/* Reply Indicator (Minimal Dot) */}
                            {parentColor && (
                                <div
                                    className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
                                    style={{ backgroundColor: parentColor }}
                                    title={`Replying to @${parentName}`}
                                />
                            )}

                            <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm break-words whitespace-pre-wrap">{comment.content}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-1 ml-2">
                        {canReply && user && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="text-xs text-gray-500 hover:text-blue-500 font-medium flex items-center gap-1"
                            >
                                <Reply size={12} /> Reply
                            </button>
                        )}
                    </div>

                    {/* Reply Input */}
                    {isReplying && (
                        <form onSubmit={handleReplySubmit} className="mt-3 flex gap-2">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Reply to ${authorName}...`}
                                className="flex-1 bg-[#1a1d21] border border-[var(--border)] text-white rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setIsReplying(false)}
                                className="text-gray-500 hover:text-gray-300 px-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!replyContent.trim()}
                                className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                Reply
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Replies */}
            {replies && replies.length > 0 && (
                <div className="mt-3">
                    {/* Toggle replies button if desired, currently always shown or optional */}
                    {/* 
                    <button 
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-xs text-blue-500 flex items-center gap-1 ml-11 mb-2 hover:underline"
                    >
                        {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {showReplies ? 'Hide replies' : `Show ${replies.length} replies`}
                    </button>
                    */}

                    {showReplies && (
                        <div className="flex flex-col">
                            {replies.map(reply => (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    depth={depth + 1}
                                    onReply={onReply}
                                    replies={reply.replies} // Hierarchical structure passed down
                                    getAvatarColor={getAvatarColor}
                                    parentAuthor={comment.userId} // Pass current author as parent to children
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
