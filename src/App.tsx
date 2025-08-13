import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useActiveChatSession } from "./hooks/useActiveChatSession";
import { usePresence } from "./hooks/usePresence";
import GoogleSignIn from "./components/Auth/GoogleSignIn";
import ChatWindow from "./components/ChatWindow";
import RandomConnect from "./components/RandomConnect";
import OnlineUsers from "./components/OnlineUsers";

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const activeSession = useActiveChatSession();
  const [localActiveSession, setLocalActiveSession] = useState(activeSession);

  // Keep presence updated using the optimized usePresence
  usePresence({ state: localActiveSession ? "busy" : "online" });

  // Sync local session with hook session
  React.useEffect(() => {
    setLocalActiveSession(activeSession);
  }, [activeSession]);

  const handleChatEnd = () => {
    setLocalActiveSession(null);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <GoogleSignIn />;

  if (localActiveSession) {
    return <ChatWindow session={localActiveSession} onChatEnd={handleChatEnd} />;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <RandomConnect />
      <OnlineUsers />
    </div>
  );
};

export default App;
