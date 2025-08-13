import React from "react";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const GoogleSignIn: React.FC = () => {
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
            // ✅ The AuthContext will automatically update `user`
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <button onClick={signInWithGoogle} type="button">
            Sign in with Google
        </button>
    );
};

export default GoogleSignIn;
