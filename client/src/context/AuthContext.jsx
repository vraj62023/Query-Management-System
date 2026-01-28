import {createContext, useState, useEffect} from 'react';
import axios from 'axios';

// Create the context(cloud)
const AuthContext = createContext();
// Create a provider component (cloud generator)
export const AuthProvider = ({children})=>{
    const [user,setuser]= useState(null);
    const [loading,setLoading]= useState(true);
    // on load : check if user is logged in
    useEffect(()=>{
        const checkLoggedIn = async ()=>{
            const token = localStorage.getItem('token');
            if(token){
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try{
                    const res = await axios.get('/api/auth/me');
                    setuser(res.data.user);
                }catch(err){
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    setuser(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    },[]);

    const login = (token, userData)=>{
        localStorage.setItem("token",token);
        axios.defaults.headers.common['Authorization']= `Bearer ${token}`;
        setuser(userData);
    };
    const logout =()=>{
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setuser(null);
    };
    return(
        <AuthContext.Provider value = {{user,login,logout,loading}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;