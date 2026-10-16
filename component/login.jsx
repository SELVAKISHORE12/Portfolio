import React, { useState } from "react";

function Login(){
    const [email, setEmail] = useState("");

    const handleEmailChange = (e) => {
        const val = e.target.value;
        setEmail(val);
        
        localStorage.setItem("userEmail", val);
    };

    return (
        <div className="container mt-5">
            <h1>Login</h1>

            <div className="row">
                <div className="col-sm-8">
                    <div className="card">
                        <div className="card-body">

                            <form action="/login" method="POST">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        name="username" 
                                        value={email}
                                        onChange={handleEmailChange} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" name="password" />
                                </div>
                                <button type="submit" className="btn btn-dark">Login</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;