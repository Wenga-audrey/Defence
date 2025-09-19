import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  X,
  Star,
  Users,
  Trophy,
  Clock,
  BookOpen,
  Video,
  MessageCircle,
  FileText,
  ArrowRight,
  Zap,
  Target,
  Award,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Pricing() {
  const [searchParams] = useSearchParams();
  const [selectedExam, setSelectedExam] = useState<{
    name: string;
    tier: string;
    price: string;
    duration: string;
  } | null>(null);

  useEffect(() => {
    const examName = searchParams.get('exam');
    const tier = searchParams.get('tier');
    const price = searchParams.get('price');
    const duration = searchParams.get('duration');

    if (examName && tier && price && duration) {
      setSelectedExam({
        name: examName,
        tier: tier,
        price: price,
        duration: duration
      });
    }
  }, [searchParams]);

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      description: "Perfect for getting started with exam preparation",
      monthlyPrice: "30,000",
      duration: "1 month",
      popular: false,
      color: "gray",
      features: [
        "Access to basic courses",
        "Weekly practice tests",
        "Email support",
        "Basic progress tracking",
        "Study materials download",
        "Mobile app access",
      ],
      limitations: [
        "No 1-on-1 mentoring",
        "No live classes",
        "Limited analytics",
      ],
    },
    {
      id: "premium",
      name: "Premium Plan",
      description: "Most popular choice for serious exam preparation",
      monthlyPrice: "55,000",
      duration: "3 months",
      popular: true,
      color: "green",
      features: [
        "All basic features",
        "1-on-1 mentoring sessions",
        "Live classes with experts",
        "Advanced analytics",
        "Priority support",
        "Exam simulation",
        "Custom study plans",
        "Performance insights",
        "Discussion forums",
        "Offline content access",
      ],
      limitations: [],
    },

  ];

  const institutions = [
    { name: "ENSP Yaoundé", students: "2,500+", rate: "98%" },
    { name: "ENSP Maroua", students: "1,800+", rate: "97%" },
    { name: "ENSET Douala", students: "2,200+", rate: "96%" },
    { name: "HICM", students: "3,100+", rate: "99%" },
    { name: "FHS Bamenda", students: "1,500+", rate: "95%" },
    { name: "ENSTP/NSPW", students: "1,900+", rate: "97%" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Content",
      description: "Access to all exam topics with detailed explanations",
    },
    {
      icon: Video,
      title: "Live Classes",
      description: "Interactive sessions with expert instructors",
    },
    {
      icon: MessageCircle,
      title: "1-on-1 Mentoring",
      description: "Personal guidance from successful graduates",
    },
    {
      icon: FileText,
      title: "Practice Tests",
      description: "Unlimited mock exams with detailed feedback",
    },
    {
      icon: Target,
      title: "Custom Plans",
      description: "Personalized study schedules based on your goals",
    },
    {
      icon: Award,
      title: "Success Guarantee",
      description: "We guarantee your success or your money back",
    },
  ];

  const faqs = [
    {
      question: "What happens if I don't pass my entrance exam?",
      answer:
        "With our Elite plan, we offer a success guarantee. If you don't pass after following our complete program, we'll refund your money or provide additional coaching at no extra cost.",
    },
    {
      question: "Can I switch plans during my subscription?",
      answer:
        "Yes! You can upgrade your plan at any time. The price difference will be prorated based on your remaining subscription period.",
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "Yes, we offer flexible payment options including monthly installments for annual plans. Contact our support team for custom payment arrangements.",
    },
    {
      question: "What institutions do you prepare students for?",
      answer:
        "We prepare students for all major institutions in Cameroon including ENSP, ENSET, HICM, FHS, ENSTP, and many others. Our curriculum covers all entrance exam formats.",
    },
    {
      question: "How long do I have access to the materials?",
      answer:
        "Access duration depends on your plan. Basic plans include 3-month access, Premium includes 6-month access, and Elite includes 12-month access with post-admission support.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mindboost-green to-mindboost-dark-green py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">


          {selectedExam ? (
            <>
              <div className="mb-6">
                <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                  {selectedExam.tier === "premium" ? "Premium Plan" : "Basic Plan"}
                </Badge>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                {selectedExam.name}
                <span className="block text-white/80 text-3xl lg:text-4xl mt-4">
                  {selectedExam.price} - {selectedExam.duration}
                </span>
              </h1>
              <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12">
                Complete your enrollment for {selectedExam.name} {selectedExam.tier} preparation.
                Start your journey to success today!
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Choose Your
                <span className="block text-white/80">Success Plan</span>
              </h1>
              <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12">
                Invest in your future with our proven exam preparation programs.
                Join thousands of successful students.
              </p>
            </>
          )}

          {/* Billing Toggle */}
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isSelectedPlan = selectedExam && 
                ((selectedExam.tier === "basic" && plan.id === "basic") || 
                 (selectedExam.tier === "premium" && plan.id === "premium"));
              
              return (
                <Card
                  key={plan.id}
                  className={`relative border-0 shadow-xl hover:shadow-2xl transition-all ${
                    plan.popular || isSelectedPlan ? "scale-105 ring-4 ring-mindboost-green" : ""
                  }`}
                >


                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-black mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-black/70 mb-6">{plan.description}</p>

                    <div className="mb-4">
                      <div className="text-5xl font-black text-mindboost-green">
                        {plan.monthlyPrice} FCFA
                      </div>
                      <div className="text-black/70 mt-2">{plan.duration}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-mindboost-green flex-shrink-0" />
                        <span className="text-black/90">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <span className="text-black/50">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    className={`w-full py-4 text-lg font-bold ${plan.popular || isSelectedPlan
                      ? "bg-mindboost-green hover:bg-mindboost-green/90 text-white"
                      : "bg-black hover:bg-gray-800 text-white"
                      }`}
                  >
                    <Link to={`/payment?plan=${plan.id}${selectedExam ? `&exam=${encodeURIComponent(selectedExam.name)}&tier=${selectedExam.tier}&price=${encodeURIComponent(selectedExam.price)}&duration=${encodeURIComponent(selectedExam.duration)}` : ''}`}>
                      {isSelectedPlan ? "Continue with This Plan" : "Get Started"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  {plan.popular && (
                    <div className="text-center mt-4">
                    </div>
                  )}
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-24 bg-mindboost-light-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-6">
              Proven Track Record
            </h2>
            <p className="text-xl text-black/70">
              See how our students perform across different institutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {institutions.map((institution, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-black mb-4">
                    {institution.name}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-black text-mindboost-green">
                        {institution.students}
                      </div>
                      <div className="text-black/70">Students Trained</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-mindboost-green">
                        {institution.rate}
                      </div>
                      <div className="text-black/70">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-6">
              Why Choose MindBoost?
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Our comprehensive approach ensures you're fully prepared for your
              entrance exams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-mindboost-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-mindboost-green" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-black/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-mindboost-light-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-black/70">
              Get answers to common questions about our pricing and services
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-black mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-black/80 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-mindboost-dark-green to-mindboost-green text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Zap className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6">
            Ready to Start Your Success Journey?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join thousands of students who have achieved their academic dreams
            with MindBoost. Your success story starts today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-mindboost-green hover:bg-white/90 text-xl px-12 py-6 rounded-2xl shadow-xl font-black"
            >
              <Link to="/get-started">
                Choose Your Plan
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-mindboost-green text-xl px-12 py-6 rounded-2xl font-black"
            >
              <Link to="/contact">Have Questions?</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 pt-12">
            <div className="flex items-center space-x-2 text-white/80">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-semibold">30-day money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold">4.9/5 student rating</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
