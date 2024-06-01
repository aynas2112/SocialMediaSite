import React, { useContext, useEffect,useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();
export function useAuth(){
    return useContext(AuthContext);
}
export function AuthProvider({children}){
    const[currUser,setCurrUser] = React.useState(null);
    const[userLoggedIn,setUserLoggedIn] = React.useState(false);
    const[loading,setLoading] = React.useState(true);

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,initializeUser);
        return unsubscribe;
    },[])

    async function initializeUser(user){
        if(user){
            setCurrUser({...user});
            setUserLoggedIn(true);
        }else{
            setCurrUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }
    const value={
        currUser,
        userLoggedIn,
        loading
    }

    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}