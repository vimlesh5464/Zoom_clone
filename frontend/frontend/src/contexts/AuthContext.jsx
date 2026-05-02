import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext({});

// 🌐 Axios instance (HTTP ONLY)
const client = axios.create({
    baseURL: `${server}/api/v1/users`,
});

// 🔐 Attach JWT token automatically
client.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem("token");

        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }

        return req;
    },
    (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // 🧾 REGISTER
    const handleRegister = async (name, username, password) => {
        try {
            const response = await client.post("/register", {
                name,
                username,
                password,
            });

            return response.data?.message;
        } catch (err) {
            console.error(
                "Register Error:",
                err?.response?.data || err.message
            );
            throw err;
        }
    };

    // 🔑 LOGIN
    const handleLogin = async (username, password) => {
        try {
            const response = await client.post("/login", {
                username,
                password,
            });

            const token = response.data?.access_token;

            if (!token) {
                throw new Error("Token not received from server");
            }

            localStorage.setItem("token", token);

            setUserData({ username });

            navigate("/home");
        } catch (err) {
            console.error(
                "Login Error:",
                err?.response?.data || err.message
            );
            throw err;
        }
    };

    // 📌 ADD MEETING HISTORY
    const addToUserHistory = async (meetingCode) => {
        try {
            const response = await client.post("/meetings", {
                meeting_code: meetingCode,
            });

            return response.data;
        } catch (err) {
            console.error(
                "Add Meeting Error:",
                err?.response?.data || err.message
            );
            throw err;
        }
    };

    // 📜 GET HISTORY
    const getHistoryOfUser = async () => {
        try {
            const response = await client.get("/meetings");

            return response.data;
        } catch (err) {
            console.error(
                "Get History Error:",
                err?.response?.data || err.message
            );
            throw err;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userData,
                setUserData,
                handleRegister,
                handleLogin,
                addToUserHistory,
                getHistoryOfUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};