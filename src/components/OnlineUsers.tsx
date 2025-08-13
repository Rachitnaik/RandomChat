import React from "react";
import { useOnlineUsers } from "../hooks/useOnlineUsers";

const OnlineUsers: React.FC = () => {
    const onlineUsers = useOnlineUsers();

    return (
        <div>
            <h2>Online Users</h2>
            <ul>
                {onlineUsers.map((user) => (
                    <li key={user.uid}>{user.uid}</li>
                ))}
            </ul>
        </div>
    );
};

export default OnlineUsers;
