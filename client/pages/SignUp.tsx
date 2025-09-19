import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "@/lib/icons";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/lib/auth";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    targetInstitution: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      const { dashboardRole } = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        currentLevel: "BEGINNER",
        examTargets: formData.targetInstitution
          ? [formData.targetInstitution]
          : [],
      });
      navigate(`/dashboard/${dashboardRole}`);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const institutions = [
    "ENSP Yaoundé (ENSPY)",
    "ENSP Maroua",
    "ENSET Douala",
    "HICM",
    "FHS Bamenda",
    "ENSTP/NSPW",
    "Other",
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-mindboost-olive to-mindboost-ebony relative overflow-hidden"
      style={{
        backgroundImage: 'url("/placeholder.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Centered Form */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white">Create Account</h2>
            <p className="mt-2 text-white/80">
              Start your journey to academic excellence
            </p>
          </div>

          {/* Signup Form */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
            <CardContent className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/40" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
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

                {/* Phone & Institution */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/40" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                        placeholder="+237 6XX XXX XXX"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Target Institution
                    </label>
                    <select
                      name="targetInstitution"
                      value={formData.targetInstitution}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                      required
                    >
                      <option value="">Select your target institution</option>
                      {institutions.map((institution) => (
                        <option key={institution} value={institution}>
                          {institution}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 gap-4">
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
                        placeholder="Create a strong password"
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
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/40" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-11 pr-12 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="rounded border-mindboost-green text-mindboost-green focus:ring-mindboost-green mt-1"
                    required
                  />
                  <span className="ml-3 text-sm text-black/70">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-mindboost-green hover:text-mindboost-dark-green font-semibold"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-mindboost-green hover:text-mindboost-dark-green font-semibold"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold py-3 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-black/70">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-mindboost-green hover:text-mindboost-dark-green font-bold"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
