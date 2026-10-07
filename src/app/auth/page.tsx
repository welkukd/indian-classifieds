"use client";

import React, { useState, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, CheckCircle, Shield, Smartphone, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithPhone: sendOTP, verifyOTP, signInWithGoogle: signInWithOAuth } = useAuth();
  
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const cleanPhone = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  const handlePhoneChange = React.useCallback((value: string) => {
    setPhone(cleanPhone(value));
    setError("");
  }, []);

  const handleOtpChange = React.useCallback((value: string) => {
    setOtp(value.replace(/\D/g, "").slice(0, 6));
    setError("");
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    const { error: apiError } = await sendOTP(phone);
    if (apiError) {
      setError(apiError);
      setIsLoading(false);
    } else {
      setStep("otp");
      setResendTimer(60);
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    setIsLoading(true);
    const { error: apiError } = await verifyOTP(phone, otp);
    if (apiError) {
      setError(apiError);
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    const { error: apiError } = await signInWithOAuth();
    if (apiError) {
      setError(apiError);
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setError("");
    setIsLoading(true);
    const { error: apiError } = await sendOTP(phone);
    if (apiError) {
      setError(apiError);
    } else {
      setResendTimer(60);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [step === "otp"]);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - visual branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #d4d4d4 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="absolute top-1/3 left-0 w-48 h-48 bg-gradient-to-br from-brand-400/20 via-brand-300/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative z-10 p-12 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-xl">⬣</span>
            </div>
            <span className="text-2xl font-display font-bold text-neutral-900">DesiList</span>
          </div>
          <div className="mt-auto">
            <h1 className="font-display text-4xl font-bold text-neutral-900 mb-4">
              {step === "phone" ? "Your India, Your Marketplace" : "Secure Verification"}
            </h1>
            <p className="text-neutral-600 text-lg leading-relaxed max-w-md">
              {step === "phone"
                ? "Join millions of Indians buying and selling locally on DesiList. Post your first ad in minutes — 100% free forever."
                : `Enter the 6-digit OTP sent to +91 ${phone.slice(0, 5)}-${phone.slice(5)}. We'll verify your number to get you started.`}
            </p>
            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="text-center"><div className="text-3xl font-bold text-brand-600">5M+</div><div className="text-xs text-neutral-500">Happy users</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-brand-600">20L+</div><div className="text-xs text-neutral-500">Listings</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-brand-600">12s</div><div className="text-xs text-neutral-500">Avg. response</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-neutral-50">
        <Card variant="elevated" className="w-full max-w-md">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="lg:hidden flex items-center gap-2" aria-label="DesiList Home">
                <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
                  <span className="text-white font-bold text-lg">⬣</span>
                </div>
                <span className="text-xl font-display font-bold text-neutral-900">DesiList</span>
              </Link>
              <Link href="/" className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors" aria-label="Back to home">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                step === "phone" ? "bg-brand-500 text-white" : "bg-success-100 text-success-600"
              )}>
                {step === "phone" ? 1 : <CheckCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1 h-px bg-neutral-200" />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                step === "otp" ? "bg-brand-500 text-white" : "bg-neutral-100 text-neutral-400"
              )}>
                2
              </div>
            </div>

            {/* Phone Step */}
            {step === "phone" && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-neutral-900 mb-2">Enter your phone number</h1>
                  <p className="text-neutral-500">We'll send a 6-digit OTP via SMS. No spam, ever.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-error-50 border border-error-200 flex items-start gap-3 animate-slide-up">
                    <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-error-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label htmlFor="phone" className="label">Phone Number <span className="text-error-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg font-medium">+91</span>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="98765 43210"
                        maxLength={10}
                        inputMode="numeric"
                        className="pl-12"
                        disabled={isLoading}
                        autoComplete="tel"
                        autoFocus
                      />
                    </div>
                    <p className="mt-2 text-xs text-neutral-500 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      By continuing, you agree to our Terms & Privacy Policy
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    isLoading={isLoading} 
                    rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
                  >
                    Send OTP
                  </Button>
                </form>
              </>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-900">Verify your number</h1>
                  <p className="text-neutral-500 mt-2">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-medium text-neutral-900">+91 {phone.slice(0, 5)} {phone.slice(5)}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-error-50 border border-error-200 flex items-start gap-3 animate-slide-up">
                    <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-error-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <Input
                        key={i}
                        id={"otp-" + i}
                        type="text"
                        inputMode="numeric"
                        autoComplete={i === 0 ? "one-time-code" : undefined}
                        maxLength={1}
                        value={otp[i] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !/^\d$/.test(val)) return;
                          const newOtpArr = otp.split("");
                          newOtpArr[i] = val;
                          if (val && i < 5) {
                            inputRefs.current[i + 1]?.focus();
                          }
                          if (val && i === 5) {
                            const fullOtp = [...newOtpArr].join("");
                            if (fullOtp.length === 6) {
                              handleVerifyOTP();
                            }
                          }
                          handleOtpChange(newOtpArr.join(""));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otp[i] && i > 0) {
                            inputRefs.current[i - 1]?.focus();
                          }
                        }}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        className="w-12 h-14 text-center text-2xl font-bold tracking-widest border-2 focus:border-brand-500 focus:ring-0"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Link 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setStep("phone"); 
                        setOtp(""); 
                        setResendTimer(0);
                      }}
                      className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Change number
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || isLoading}
                      className="text-neutral-500 hover:text-neutral-700"
                    >
                      {resendTimer > 0 
                        ? <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" />Resend in {resendTimer}s</span>
                        : "Resend OTP"}
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    isLoading={isLoading}
                    disabled={otp.length !== 6}
                    rightIcon={!isLoading && <CheckCircle className="w-4 h-4" />}
                  >
                    Verify & Continue
                  </Button>
                </form>
              </>
            )}

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-neutral-50 text-neutral-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.78c0-1.06-.09-2.08-.25-3.06H12v5.7h3.34c-.44 1.56-1.72 2.87-3.16 3.68l-.01-.01c-1.1.75-2.46 1.19-3.88 1.19-2.97 0-5.46-2.39-6.28-5.56l-.01.01C3.66 17.18 7.37 20 12 20c3.2 0 5.82-1.23 7.74-3.22a11.87 11.87 0 00 2.82-2.01V12.8zM12 5.5c1.35 0 2.58.5 3.54 1.31l2.64-2.64A11.34 11.34 0 00 12 2C7.37 2 3.66 4.82 2.26 8.81L7 13l4.66-.66C12.69 12.08 13.54 11.82 14.28 11.42L12 9.3V5.5z" />
                </svg>
              }
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Continue with Google
            </Button>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-success-50">
                <CheckCircle className="w-5 h-5 text-success-500 mx-auto mb-1" />
                <p className="text-xs text-success-700">No spam</p>
              </div>
              <div className="p-3 rounded-xl bg-brand-50">
                <Shield className="w-5 h-5 text-brand-500 mx-auto mb-1" />
                <p className="text-xs text-brand-700">Secure</p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100">
                <Smartphone className="w-5 h-5 text-neutral-600 mx-auto mb-1" />
                <p className="text-xs text-neutral-600">Fast</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-neutral-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-brand-600 hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
