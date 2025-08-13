import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

type OnlineUser = {
  uid: string;
  state: string;
  lastChanged: number;
};

export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const statusRef = ref(db, "status");
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const users: OnlineUser[] = [];
      snapshot.forEach((child) => {
        const val = child.val();
        if (val.state === "online") {
          users.push({
            uid: child.key!,
            state: val.state,
            lastChanged: val.lastChanged,
          });
        }
      });
      setOnlineUsers(users);
    });

    return () => unsubscribe();
  }, []);

  return onlineUsers;
};
