import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./home.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";
import Operands from "./Operands.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}  />
                <Route path="/login" element={<Login/>}  />
                <Route path="/register" element={<Register/>}  />
                <Route path="/submit" element={<Operands/>}  />
                
                </Routes>
        </BrowserRouter>

    </React.StrictMode>
);