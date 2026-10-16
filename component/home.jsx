import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function Home() {
    const navigate = useNavigate(); 
    return(
        <div className="jumbotron">
            <div className="container">
                <i className="fas fa-key fa-6x"></i>
                <h1 className="display">Calculator</h1>
               
                
                {}
                <button 
                    className="btn btn-light btn-lg" 
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>
                
                <button 
                    className="btn btn-dark btn-lg" 
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Home;