import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  Star,
  Shield,
} from "@/lib/icons";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/lib/auth";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { dashboardRole } = await login({
        email: formData.email,
        password: formData.password,
      });
      navigate(`/dashboard/${dashboardRole}`);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Access",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: Zap,
      title: "Instant Progress",
      description: "Track your learning journey in real-time",
    },
    {
      icon: Star,
      title: "Personalized Experience",
      description: "Customized content based on your goals",
    },
  ];

  const stats = [
    { value: "15,000+", label: "Active Students" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen flex">
       

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-mindboost-green to-mindboost-dark-green rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-black">Welcome Back!</h2>
              <p className="mt-2 text-black/70">
                Sign in to continue your academic journey
              </p>
            </div>

            {/* Login Form */}
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-11 pr-12 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="rounded border-mindboost-green text-mindboost-green focus:ring-mindboost-green"
                      />
                      <span className="ml-2 text-sm text-black/70">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-mindboost-green hover:text-mindboost-dark-green font-semibold"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold py-3 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-black/70">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-mindboost-green hover:text-mindboost-dark-green font-bold"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
