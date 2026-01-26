import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import OpinionCard from '../components/OpinionCard';
import { User, Mail, Calendar, MessageSquare } from 'lucide-react';

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [myOpinions, setMyOpinions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        const fetchMyOpinions = async () => {
            if (!user) return;
            try {
                const res = await api.get('/opinions', { params: { userId: user._id } });
                setMyOpinions(res.data);
            } catch (err) {
                console.error("Failed to fetch my opinions", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyOpinions();
    }, [user, authLoading, navigate]);

    if (authLoading || loading) return <div className="text-white text-center mt-20">Loading profile...</div>;
    if (!user) return null; // Should redirect

    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-20 py-8 min-h-screen">
            {/* Profile Header */}
            <div className="glass-card mb-8 flex flex-col md:flex-row items-center gap-8 p-8">
                <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#E50914] to-[#800] flex items-center justify-center text-4xl font-bold text-white shadow-lg border-4 border-[#202020]">
                        {user.username ? user.username.charAt(0).toUpperCase() : <User />}
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{user.username}</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400 mt-2">
                        <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center p-4 bg-[#252525] rounded-xl min-w-[150px]">
                    <span className="text-3xl font-bold text-[#E50914]">{myOpinions.length}</span>
                    <span className="text-sm text-gray-400 uppercase tracking-widest mt-1">Opinions</span>
                </div>
            </div>

            {/* My Opinions Feed */}
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="text-[#E50914]" />
                My Opinions
            </h2>

            {myOpinions.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-[#151515] rounded-xl border border-[#333] border-dashed">
                    <p className="text-lg mb-2">You haven't posted any opinions yet.</p>
                    <p className="text-sm">Share your thoughts with the world!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myOpinions.map(opinion => (
                        <OpinionCard key={opinion._id} item={opinion} onClick={() => navigate(`/opinion/${opinion._id}`)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
