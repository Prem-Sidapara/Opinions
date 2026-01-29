import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import OpinionCard from '../components/OpinionCard';
import CommentSection from '../components/CommentSection';
import { ArrowLeft } from 'lucide-react';

const OpinionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [opinion, setOpinion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/opinions/${id}`);
                setOpinion(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching details:", err);
                setError("Failed to load discussion");
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) return <div className="text-white text-center mt-10">Loading discussion...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
    if (!opinion) return <div className="text-white text-center mt-10">Opinion not found</div>;

    return (
        <div className="container max-w-2xl mx-auto px-4 py-6 pb-20">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-[var(--text-secondary)] hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Feed
            </button>

            <OpinionCard item={opinion} onClick={null} expanded={true} />

            <CommentSection opinionId={id} />
        </div>
    );
};

export default OpinionDetails;
