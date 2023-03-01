import React from 'react'

export default function LandingPage({ onStart }) {
    
    return (
        <div className="landingpage-container">
            <h1>Quizzical</h1>
            <h3>Some description if needed</h3>
            <button onClick={onStart} className="btn">Start quiz</button>
        </div>
        )
}