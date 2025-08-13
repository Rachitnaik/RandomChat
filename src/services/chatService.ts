import {  collection, addDoc, query, getDocs, where, Timestamp  } from "firebase/firestore";
import { ref, get, set } from "firebase/database";
import { db, dbFirestore } from "../firebase"; // db = RTDB, dbFirestore = Firestore

// Helper to get available online users from RTDB
export const getAvailableOnlineUsers = async (currentUserId: string): Promise<string[]> => {
  const statusRef = ref(db, "status");
  const snapshot = await get(statusRef);
  const availableUsers: string[] = [];
  snapshot.forEach((child) => {
    const val = child.val();
    const uid = child.key;
    if (uid && uid !== currentUserId && val.state === "online") {
      availableUsers.push(uid);
    }
  });
  return availableUsers;
};

export const createRandomChatSession = async (currentUserId: string) => {
  // Step 1 - Check for any open session with me already in it
  const existingQ = query(
    collection(dbFirestore, "chatSessions"),
    where("participants", "array-contains", currentUserId)
  );
  const existingSnap = await getDocs(existingQ);

  if (!existingSnap.empty) {
    console.log("Existing session found, reusing...");
    const doc = existingSnap.docs[0];
    return { sessionId: doc.id, participantId: doc.data().participants.find((p: string) => p !== currentUserId) };
  }

  // Step 2 - Find available online users
  const availableUsers = await getAvailableOnlineUsers(currentUserId);
  if (!availableUsers.length) throw new Error("No available users to connect");

  // Step 3 - Randomly pick one user
  const selectedUserId = availableUsers[Math.floor(Math.random() * availableUsers.length)];

  // Step 4 - Create new chat session
  const chatSessionRef = await addDoc(collection(dbFirestore, "chatSessions"), {
    participants: [currentUserId, selectedUserId],
    createdAt: Timestamp.now()
  });

  // Step 5 - Set both users to busy
  await Promise.all([
    set(ref(db, `status/${currentUserId}`), { state: "busy", lastChanged: Date.now() }),
    set(ref(db, `status/${selectedUserId}`), { state: "busy", lastChanged: Date.now() })
  ]);

  return { sessionId: chatSessionRef.id, participantId: selectedUserId };
};
