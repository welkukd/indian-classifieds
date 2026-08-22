"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Phone, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function AuthPage() {
  const { signInWithPhone, verifyOTP } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\s/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setIsSubmitting(true);
    const { error: apiError } = await signInWithPhone(cleanPhone);
    if (apiError) {
      setError(apiError);
    } else {
      setStep("otp");
    }
    setIsSubmitting(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP sent to your phone");
      return;
    }

    setIsSubmitting(true);
    const { error: apiError } = await verifyOTP(phone, otp);
    if (apiError) {
      setError(apiError);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">⬣</span>
            </div>
            <h1 className="text-2xl font-playfair font-bold text-gray-900">DesiList</h1>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              step === "phone" ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"
            }`}>
              <Phone className="w-5 h-5" />
            </div>
            <div className={`w-20 h-1 transition-all ${step === "otp" ? "bg-amber-500" : "bg-gray-200"}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              step === "otp" ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"
            }`}>
              <span className="text-sm">OTP</span>
            </div>
          </div>

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Your Mobile Number</h2>
                <p className="text-sm text-gray-500">We'll send you a 6-digit OTP to verify your identity</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-l-xl border border-r-0 border-gray-300">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">We'll send an OTP to verify this number</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || phone.replace(/\s/g, "").length !== 10}
                className="w-full px-6 py-3.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-5 h-5" />}
                Send OTP
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter OTP</h2>
                <p className="text-sm text-gray-500">We sent a 6-digit code to +91 {phone.replace(/(\d{5})(\d{5})/, "$1 $2")}</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 text-center text-2xl font-bold tracking-wider border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                  maxLength={6}
                  inputMode="numeric"
                />
                <div className="flex justify-center gap-1 mt-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-1 rounded-full transition-all ${
                        otp.length > i ? "bg-amber-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button type="button" className="text-sm text-amber-600 hover:underline font-medium">
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full px-6 py-3.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verify & Continue
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full flex items-center justify-center gap-2 text-gray-600 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Number
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}