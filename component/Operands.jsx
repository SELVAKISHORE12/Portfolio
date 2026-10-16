import React, { useState, useEffect } from "react";
import "../styles.css";

function Calculator() { 
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const email = localStorage.getItem("userEmail");
                if (!email) return;

                const response = await fetch(`http://localhost:4000/history?email=${encodeURIComponent(email)}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                if (data.data) {
                    setHistory(data.data.split('\n').filter(Boolean));
                }
            } catch (error) {
                console.error("Failed to load history", error);
            }
        };
        fetchHistory();
    }, []);

    const handleClick = async (value) => {
        if (value === "=") {
            try {
                const sanitizedInput = input.replace(/[^0-9+\-*/.]/g, "");
                const dynamicCode = `return ${sanitizedInput};`; 
                const sumFunction = new Function("input", dynamicCode);

                const result = sumFunction(sanitizedInput); 
                const calculationResult = result.toString();   
                const combinedData = `${sanitizedInput} = ${calculationResult}`;

                const response = await fetch("http://localhost:4000/calculate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        expression: input, 
                        email: localStorage.getItem("userEmail")
                    })
                });

                if (response.ok) {
                    setHistory([combinedData, ...history]);
                    setInput(calculationResult);
                } else {
                    setInput("Error");
                }

            } catch (error) {
                setInput("Error");
            }
        } else if (value === "del") {
            setInput("");
        } else {
            setInput(input + value);
        }
    };

    return (
        <div className="calculator-container">
            <div className="history-dropdown-container">
                <button 
                    className="history-dropdown-btn"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span>Previous Calculations</span>
                    <span>{isDropdownOpen ? "▲" : "▼"}</span>
                </button>

                {isDropdownOpen && (
                    <ul className="history-dropdown-list">
                        {history.length === 0 ? (
                            <li className="history-empty">No history yet</li>
                        ) : (
                            history.map((item, index) => (
                                <li key={index} className="history-item">{item}</li>
                            ))
                        )}
                    </ul>
                )}
            </div>

            <div className="calcu">
                <input 
                    type="text" 
                    className="input" 
                    value={input} 
                    readOnly 
                />
                
                <div className="keypad">
                    <button onClick={() => handleClick("1")}>1</button>
                    <button onClick={() => handleClick("2")}>2</button>
                    <button onClick={() => handleClick("3")}>3</button>
                    <button onClick={() => handleClick("/")}>/</button>

                    <button onClick={() => handleClick("4")}>4</button>
                    <button onClick={() => handleClick("5")}>5</button>
                    <button onClick={() => handleClick("6")}>6</button>
                    <button onClick={() => handleClick("+")}>+</button>

                    <button onClick={() => handleClick("7")}>7</button>
                    <button onClick={() => handleClick("8")}>8</button>
                    <button onClick={() => handleClick("9")}>9</button>
                    <button onClick={() => handleClick("-")}>-</button>

                    <button onClick={() => handleClick("0")}>0</button>
                    <button onClick={() => handleClick("*")}>x</button>
                    <button onClick={() => handleClick("=")}>=</button>
                    <button onClick={() => handleClick("del")}>del</button>
                </div>
            </div>
        </div>
    );
}

export default Calculator;