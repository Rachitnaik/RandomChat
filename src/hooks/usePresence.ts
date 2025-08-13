import { useEffect } from "react";
import { ref, onDisconnect, set, serverTimestamp } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

interface UsePresenceOptions {
  state: "online" | "busy" | "offline";
}

export const usePresence = ({ state }: UsePresenceOptions) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const userStatusRef = ref(db, `status/${user.uid}`);

    // Update my current state when told by caller
    set(userStatusRef, {
      state,
      lastChanged: serverTimestamp(),
    });

    // Always mark offline when disconnected
    onDisconnect(userStatusRef).set({
      state: "offline",
      lastChanged: serverTimestamp(),
    });
    
  }, [user, state]);
};
