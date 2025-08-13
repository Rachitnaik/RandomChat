import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { dbFirestore } from "../firebase";
import { useAuth } from "../context/AuthContext";

export const useActiveChatSession = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;

    // const sessionsRef = collection(dbFirestore, "chatSessions");
    //const q = query(sessionsRef, where("participants", "array-contains", user.uid));
    const q = query(
    collection(dbFirestore, "chatSessions"),
    where("participants", "array-contains", user.uid)
    
    );
// Listen for chat sessions in which I'm a participant

    const unsubscribe = onSnapshot(q, snapshot => {
      // Pick an active session—customize logic if supporting multiple or only "open" sessions
      const session = snapshot.docs[0]?.data();
      if (session) {
        setActiveSession({ id: snapshot.docs[0].id, ...session });
      } else {
        setActiveSession(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return activeSession;
};
