import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Clock,
  Trophy,
  Users,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const [selectedPayment, setSelectedPayment] = useState("mobile");
  const [selectedExam, setSelectedExam] = useState<{
    name: string;
    tier: string;
    price: string;
    duration: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    plan: "premium",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    institution: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    mobileProvider: "orange",
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    const examName = searchParams.get('exam');
    const tier = searchParams.get('tier');
    const price = searchParams.get('price');
    const duration = searchParams.get('duration');

    if (planParam) {
      setFormData(prev => ({ ...prev, plan: planParam }));
    }

    if (examName && tier && price && duration) {
      setSelectedExam({
        name: examName,
        tier: tier,
        price: price,
        duration: duration
      });
    }
  }, [searchParams]);

  const plans = {
    basic: {
      name: "Basic Plan",
      price: "30,000 FCFA",
      duration: "1 months",
      features: [
        "Access to basic courses",
        "Weekly practice tests",
        "Email support",
      ],
    },
    premium: {
      name: "Premium Plan",
      price: "55,000 FCFA",
      duration: "3 months",
      features: [
        "All basic features",
        "1-on-1 mentoring",
        "Live classes",
        "Advanced analytics",
      ],
    },

  };

  const mobileProviders = [
    { id: "orange", name: "Orange Money", logo: "📱" },
    { id: "mtn", name: "MTN Mobile Money", logo: "📲" },
    { id: "nexttel", name: "Nexttel Possa", logo: "💳" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <Card className="max-w-2xl w-full border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="text-4xl font-black text-black mb-6">
                Payment Successful!
              </h1>
              <p className="text-xl text-black/70 mb-8">
                Welcome to MindBoost Excellence Academy! Your enrollment has
                been confirmed.
              </p>
              <div className="bg-mindboost-light-green rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-black mb-4">
                  What's Next?
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-mindboost-green" />
                    <span className="text-black">
                      Access your student dashboard
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-mindboost-green" />
                    <span className="text-black">
                      Complete your profile setup
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-mindboost-green" />
                    <span className="text-black">Start your first lesson</span>
                  </div>
                </div>
              </div>
              <Button
                asChild
                className="bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold px-8 py-3 rounded-xl"
              >
                <Link to="/dashboard/learner">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">

          <h1 className="text-4xl font-black text-black mb-4">
            Complete Your Enrollment
          </h1>
          <p className="text-xl text-black/70">
            Secure your spot and start your journey to academic excellence
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl sticky top-8">
              <CardHeader className="bg-mindboost-green text-white rounded-t-xl">
                <h3 className="text-2xl font-bold">Order Summary</h3>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {selectedExam ? (
                    <>
                      <div>
                        <h4 className="text-xl font-bold text-black mb-2">
                          {selectedExam.name}
                        </h4>
                        <div className="flex items-center space-x-2 mb-4">
                          <Badge className={selectedExam.tier === "premium" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                            {selectedExam.tier === "premium" ? "Premium Plan" : "Basic Plan"}
                          </Badge>
                        </div>
                        <p className="text-black/70 mb-4">
                          {selectedExam.duration} access
                        </p>
                        <div className="text-3xl font-black text-mindboost-green">
                          {selectedExam.price}
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h5 className="font-bold text-black mb-4">
                          What's Included:
                        </h5>
                        <ul className="space-y-2">
                          {plans[formData.plan as keyof typeof plans].features.map(
                            (feature, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <CheckCircle className="h-4 w-4 text-mindboost-green" />
                                <span className="text-sm text-black/80">
                                  {feature}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-black">Total</span>
                          <span className="text-2xl font-black text-black">
                            {selectedExam.price}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="text-xl font-bold text-black mb-2">
                          {plans[formData.plan as keyof typeof plans].name}
                        </h4>
                        <p className="text-black/70 mb-4">
                          {plans[formData.plan as keyof typeof plans].duration}{" "}
                          access
                        </p>
                        <div className="text-3xl font-black text-mindboost-green">
                          {plans[formData.plan as keyof typeof plans].price}
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h5 className="font-bold text-black mb-4">
                          What's Included:
                        </h5>
                        <ul className="space-y-2">
                          {plans[formData.plan as keyof typeof plans].features.map(
                            (feature, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <CheckCircle className="h-4 w-4 text-mindboost-green" />
                                <span className="text-sm text-black/80">
                                  {feature}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-black">Total</span>
                          <span className="text-2xl font-black text-black">
                            {plans[formData.plan as keyof typeof plans].price}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Security badges */}
                  <div className="bg-mindboost-light-green rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-mindboost-green" />
                      <span className="text-sm font-semibold text-black">
                        Secure Payment
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-mindboost-green" />
                      <span className="text-sm text-black/70">
                        256-bit SSL encryption
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-6">
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                        required
                      />
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
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-black mb-2">
                        Target Institution
                      </label>
                      <select
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                        required
                      >
                        <option value="">Select your target institution</option>
                        <option value="enspy">ENSP Yaoundé (ENSPY)</option>
                        <option value="ensp-maroua">ENSP Maroua</option>
                        <option value="enset">ENSET Douala</option>
                        <option value="hicm">HICM</option>
                        <option value="fhs">FHS Bamenda</option>
                        <option value="enstp">ENSTP/NSPW</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-6">
                    Payment Method
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <button
                      type="button"
                      onClick={() => setSelectedPayment("mobile")}
                      className={`p-6 border-2 rounded-xl transition-all ${selectedPayment === "mobile"
                        ? "border-mindboost-green bg-mindboost-green/5"
                        : "border-gray-200 hover:border-mindboost-green/50"
                        }`}
                    >
                      <div className="flex items-center space-x-4">
                        <Smartphone className="h-8 w-8 text-mindboost-green" />
                        <div>
                          <div className="font-bold text-black">
                            Mobile Money
                          </div>
                          <div className="text-sm text-black/70">
                            Orange, MTN, Nexttel
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPayment("card")}
                      className={`p-6 border-2 rounded-xl transition-all ${selectedPayment === "card"
                        ? "border-mindboost-green bg-mindboost-green/5"
                        : "border-gray-200 hover:border-mindboost-green/50"
                        }`}
                    >
                      <div className="flex items-center space-x-4">
                        <CreditCard className="h-8 w-8 text-mindboost-green" />
                        <div>
                          <div className="font-bold text-black">
                            Credit Card
                          </div>
                          <div className="text-sm text-black/70">
                            Visa, Mastercard
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Mobile Money Form */}
                  {selectedPayment === "mobile" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-black mb-4">
                          Select Provider
                        </label>
                        <div className="grid md:grid-cols-3 gap-4">
                          {mobileProviders.map((provider) => (
                            <button
                              key={provider.id}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  mobileProvider: provider.id,
                                })
                              }
                              className={`p-4 border-2 rounded-xl transition-all ${formData.mobileProvider === provider.id
                                ? "border-mindboost-green bg-mindboost-green/5"
                                : "border-gray-200 hover:border-mindboost-green/50"
                                }`}
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-2">
                                  {provider.logo}
                                </div>
                                <div className="font-semibold text-black">
                                  {provider.name}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div className="text-sm text-blue-700">
                            <strong>How it works:</strong> After clicking
                            "Complete Payment", you'll receive an SMS with
                            payment instructions. Follow the prompts to complete
                            your mobile money transaction.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Credit Card Form */}
                  {selectedPayment === "card" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <Button
                  asChild
                  variant="outline"
                  className="border-mindboost-green text-mindboost-green hover:bg-mindboost-green hover:text-white"
                >
                  <Link to="/pricing">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Plans
                  </Link>
                </Button>

                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold px-12 py-4 text-lg rounded-xl shadow-xl"
                >
                  {processing ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Complete Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 py-12 border-t">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-6 w-6 text-mindboost-green" />
              <span className="text-black/70 font-semibold">
                Secure Payment
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-6 w-6 text-mindboost-green" />
              <span className="text-black/70 font-semibold">
                Instant Access
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-6 w-6 text-mindboost-green" />
              <span className="text-black/70 font-semibold">
                15,000+ Students
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Trophy className="h-6 w-6 text-mindboost-green" />
              <span className="text-black/70 font-semibold">
                98% Success Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
