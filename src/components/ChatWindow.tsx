import React, { useEffect, useState, useRef } from "react";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { ref, set } from "firebase/database";
import { dbFirestore, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

interface ChatWindowProps {
    session: {
        id: string;
        participants: string[];
    };
    onChatEnd: () => void; // callback to notify App.tsx when chat ends
}

interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: any;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ session, onChatEnd }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    /** --------------------------
     * Listen for messages in this session
     * -------------------------- */
    useEffect(() => {
        const messagesRef = collection(
            dbFirestore,
            "chatSessions",
            session.id,
            "messages"
        );

        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Message, "id">),
            }));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [session.id]);

    /** --------------------------
     * Auto scroll to latest message
     * -------------------------- */
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    /** --------------------------
     * Send a new message
     * -------------------------- */
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await addDoc(
                collection(dbFirestore, "chatSessions", session.id, "messages"),
                {
                    text: newMessage,
                    senderId: user.uid,
                    createdAt: serverTimestamp(),
                }
            );
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    const endChat = async () => {
        console.log("Ending chat session:", session.id);
        try {
            // Reset all participants' presence to 'online' in Realtime Database
            const updates = session.participants.map((uid) =>
                set(ref(db, `status/${uid}`), {
                    state: "online",
                    lastChanged: Date.now(),
                })
            );
            await Promise.all(updates);

            // Delete the session document
            await deleteDoc(doc(dbFirestore, "chatSessions", session.id));

            // Notify parent component that chat ended
            onChatEnd();
            console.log("Chat session ended successfully.");
        } catch (error) {
            console.error("Error ending chat:", error);
        }
    };
    return (
        <div style={styles.chatContainer}>
            {/* Header */}
            <div style={styles.header}>
                <h2 style={{ margin: 0 }}>Chat Session</h2>
                <button onClick={endChat} style={styles.endButton}>
                    End Chat
                </button>
            </div>

            {/* Messages */}
            <div style={styles.messagesBox}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            ...styles.message,
                            alignSelf: msg.senderId === user?.uid ? "flex-end" : "flex-start",
                            background:
                                msg.senderId === user?.uid ? "#DCF8C6" : "#FFFFFF",
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={styles.form}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;

const styles: { [key: string]: React.CSSProperties } = {
    chatContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "10px",
        background: "#f7f7f7",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    endButton: {
        padding: "6px 10px",
        backgroundColor: "#e53935",
        border: "none",
        borderRadius: "4px",
        color: "white",
        cursor: "pointer",
    },
    messagesBox: {
        flex: 1,
        overflowY: "auto",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        background: "#e5ddd5",
        borderRadius: "8px",
        marginBottom: "10px",
    },
    message: {
        padding: "8px 12px",
        borderRadius: "8px",
        maxWidth: "70%",
        boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
        wordWrap: "break-word",
    },
    form: {
        display: "flex",
        gap: "8px",
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 16px",
        borderRadius: "4px",
        border: "none",
        background: "#4CAF50",
        color: "white",
        cursor: "pointer",
    },
};
