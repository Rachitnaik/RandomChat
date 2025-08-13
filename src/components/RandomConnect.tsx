import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createRandomChatSession } from "../services/chatService"; // the file containing above logic

const RandomConnect: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [partnerId, setPartnerId] = useState<string | null>(null);

    const handleRandomConnect = async () => {
        if (!user) return;
        setError(null);
        setLoading(true);
        try {
            const { sessionId, participantId } = await createRandomChatSession(user.uid);
            setSessionId(sessionId);
            setPartnerId(participantId);
            // Here you can navigate to chat UI with the sessionId
            // For example: navigate(`/chat/${sessionId}`)
        } catch (err) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleRandomConnect} disabled={loading}>
                {loading ? "Connecting..." : "Random Connect"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {sessionId && !loading && (
                <div>
                    <p>Connected to user: {partnerId}</p>
                    <p>Session ID: {sessionId}</p>
                    {/* Render chat UI or redirect here */}
                </div>
            )}
        </div>
    );
};

export default RandomConnect;
