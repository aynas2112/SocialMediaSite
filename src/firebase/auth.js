// auth.js
import {auth} from "./firebase"
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    updatePassword, 
    sendPasswordResetEmail, 
    sendEmailVerification,
    getIdToken
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token=await userCredential.user.getIdToken();
    console.log({user:userCredential.user,token});
    return {user:userCredential.user,token};
};  

export const doSignInWithEmailAndPassword = async(email, password) => {
    const userCredential = signInWithEmailAndPassword(auth, email, password);
    const token=await userCredential.user.getIdToken();
    console.log({user:userCredential.user,token});
    return {user:userCredential.user,token};
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token=await result.user.getIdToken();
    // console.log({user:result.user,token});
    return {user:result.user,token};
};

export const doSignOut = () => {
    return auth.signOut();
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`
    });
};
