import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
  Clock,
  Shield,
  Key,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // email, sent, reset
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (email) {
        setStep("sent");
      } else {
        setError("Please enter a valid email address");
      }
      setLoading(false);
    }, 1500);
  };

  const handleCodeVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (resetCode === "123456") {
        setStep("reset");
      } else {
        setError("Invalid verification code. Please try again.");
      }
      setLoading(false);
    }, 1000);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Redirect to sign in with success message
      window.location.href = "/signin?message=password-reset-success";
      setLoading(false);
    }, 1500);
  };

  const securityTips = [
    {
      icon: Shield,
      title: "Use Strong Passwords",
      description:
        "Include uppercase, lowercase, numbers, and special characters",
    },
    {
      icon: Key,
      title: "Unique Password",
      description: "Don't reuse passwords from other accounts",
    },
    {
      icon: Lock,
      title: "Keep It Secret",
      description: "Never share your password with anyone",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full space-y-8">
            {/* Back to Sign In */}
            <div className="text-center">
              <Link
                to="/signin"
                className="inline-flex items-center text-mindboost-green hover:text-mindboost-dark-green font-semibold mb-8"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>

            {/* Step 1: Email Input */}
            {step === "email" && (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-mindboost-green to-mindboost-dark-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-black">
                    Reset Password
                  </h2>
                  <p className="mt-2 text-black/70">
                    Enter your email address and we'll send you a reset link
                  </p>
                </div>

                <Card className="border-0 shadow-2xl">
                  <CardContent className="p-8">
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/40" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold py-3 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                            Sending...
                          </div>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Reset Code
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Step 2: Code Verification */}
            {step === "sent" && (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-mindboost-green to-mindboost-dark-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-black">
                    Check Your Email
                  </h2>
                  <p className="mt-2 text-black/70">
                    We've sent a verification code to{" "}
                    <span className="font-semibold">{email}</span>
                  </p>
                </div>

                <Card className="border-0 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="mb-6 p-4 bg-mindboost-green/10 border border-mindboost-green/20 rounded-xl flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-mindboost-green" />
                      <span className="text-mindboost-green font-semibold">
                        Email sent successfully!
                      </span>
                    </div>

                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                    )}

                    <form
                      onSubmit={handleCodeVerification}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all text-center text-2xl font-bold tracking-widest"
                          placeholder="000000"
                          maxLength={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold py-3 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                            Verifying...
                          </div>
                        ) : (
                          "Verify Code"
                        )}
                      </Button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-black/70 text-sm">
                        Didn't receive the code?{" "}
                        <button
                          onClick={() => setStep("email")}
                          className="text-mindboost-green hover:text-mindboost-dark-green font-semibold"
                        >
                          Resend
                        </button>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-mindboost-green/5 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-mindboost-green" />
                    <div>
                      <p className="font-semibold text-black text-sm">
                        Code expires in 10 minutes
                      </p>
                      <p className="text-black/70 text-xs">
                        For demo purposes, use code: 123456
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: New Password */}
            {step === "reset" && (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-mindboost-green to-mindboost-dark-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <Key className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-black">
                    Create New Password
                  </h2>
                  <p className="mt-2 text-black/70">
                    Choose a strong password for your account
                  </p>
                </div>

                <Card className="border-0 shadow-2xl">
                  <CardContent className="p-8">
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                    )}

                    <form onSubmit={handlePasswordReset} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                          placeholder="Create a strong password"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold py-3 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                            Updating Password...
                          </div>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Security Tips */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-mindboost-green to-mindboost-dark-green relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative flex flex-col justify-center items-center text-white p-12">
            <div className="max-w-lg text-center space-y-8">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                🔒 Security First
              </Badge>

              <h2 className="text-4xl font-black leading-tight">
                Protect Your
                <span className="block text-white/80">Account</span>
              </h2>

              <p className="text-xl text-white/90 leading-relaxed">
                Your security is our priority. Follow these tips to keep your
                account safe and secure.
              </p>

              {/* Security Tips */}
              <div className="space-y-6 pt-8">
                {securityTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 text-left"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <tip.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{tip.title}</h3>
                      <p className="text-white/80 text-sm">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Support Info */}
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur mt-8">
                <h3 className="font-bold mb-2">Need Help?</h3>
                <p className="text-white/90 text-sm mb-3">
                  If you're having trouble resetting your password, our support
                  team is here to help.
                </p>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-mindboost-green"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
