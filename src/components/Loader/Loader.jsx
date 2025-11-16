
import React from 'react';
import './Loader.css'; 

const Loader = ({ isExternalFadeOut }) => {
    
    // 🟢 Սահմանում ենք fadeOutClass փոփոխականը
    const fadeOutClass = isExternalFadeOut ? 'fade-out' : '';

    return (
        <div id="medical-preloader" className={fadeOutClass}>
             
            <div className="ekg-line-container">
                <svg className="ekg-svg" viewBox="0 0 500 100" preserveAspectRatio="xMidYMid meet">
                    <path
                        className="ekg-path"
                        d="M0,50 L50,50 L55,30 L65,70 L70,50 L120,50 L125,20 L135,80 L140,50 L500,50"
                        fill="none"
                        stroke="#e50404ff" 
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Loader;