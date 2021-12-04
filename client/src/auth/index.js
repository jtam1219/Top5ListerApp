import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                });
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        try {
        const response = await api.getLoggedIn();
        
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user,
                    }
                });
            }
        }
        catch (err) {
            auth.errorMessage=err.response.data.errorMessage;
            // maybe set loggied to false or something
        }
        
    }

    auth.registerUser = async function(userData, store) {
        try{
            const response = await api.registerUser(userData);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn:true,
                        errorMessage:null
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }
        catch(err){
            console.log("Error.")
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    loggedIn: false,
                    user: null,
                    errorMessage: err.response.data.errorMessage
                }
            });
        }
    }

    auth.loginUser = async function(userData, store){
        try{
            const response = await api.loginUser(userData);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn:true,
                        errorMessage:null
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }
        catch(err){
            console.log("Error.")
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    loggedIn: false,
                    user: null,
                    errorMessage: err.response.data.errorMessage
                }
            });
        }
    }

    auth.logoutUser = async function () {
        try{
            const response = await api.logoutUser();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGOUT_USER,
                    payload: {
                        user: response.data.user,
                        errorMessage: response.data.errorMessage
                    }
                });
            }
            history.push("/");
        }
        catch(err){
            auth.errorMessage=err.response.data.errorMessage;
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };