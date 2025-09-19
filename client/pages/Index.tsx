import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Play,
  GraduationCap,
  Users,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  X,
} from "@/lib/icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";

// Counter Animation Hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
}

// Counter Component
function Counter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const { count, setIsVisible } = useCounter(end, duration);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [setIsVisible, end]);

  return (
    <span id={`counter-${end}`}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleEnrollClick = (course: any) => {
    if (!isAuthenticated) {
      navigate('/signin');
    } else {
      // Navigate to pricing page with selected course details
      navigate(`/pricing?exam=${encodeURIComponent(course.name)}&tier=${course.tier}&price=${encodeURIComponent(course.price)}&duration=${encodeURIComponent(course.duration)}`);
    }
  };

  const handleViewProgramsClick = () => {
    navigate('/courses');
  };
  const preparatoryClasses = [
    {
      name: "ENAM - Basic",
      description: "École Nationale d'Administration et de Magistrature",
      category: "Administration",
      price: "30,000 FCFA",
      duration: "1 month",
      tier: "basic",
      subjects: ["General Knowledge", "Administrative Law", "Constitutional Law", "Economics", "French", "English"],
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
      name: "ENAM - Premium",
      description: "École Nationale d'Administration et de Magistrature",
      category: "Administration",
      price: "55,000 FCFA",
      duration: "3 months",
      tier: "premium",
      subjects: ["General Knowledge", "Administrative Law", "Constitutional Law", "Economics", "French", "English"],
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
    {
      name: "ENS - Basic",
      description: "École Normale Supérieure",
      category: "Education",
      price: "30,000 FCFA",
      duration: "1 month",
      tier: "basic",
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Literature", "Philosophy"],
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
      name: "ENS - Premium",
      description: "École Normale Supérieure",
      category: "Education",
      price: "55,000 FCFA",
      duration: "3 months",
      tier: "premium",
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Literature", "Philosophy"],
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
    {
      name: "Police Nationale - Basic",
      description: "National Police Force",
      category: "Security",
      price: "30,000 FCFA",
      duration: "1 month",
      tier: "basic",
      subjects: ["General Knowledge", "Criminal Law", "Physical Fitness", "Psychology", "French", "Mathematics"],
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
      name: "Police Nationale - Premium",
      description: "National Police Force",
      category: "Security",
      price: "55,000 FCFA",
      duration: "3 months",
      tier: "premium",
      subjects: ["General Knowledge", "Criminal Law", "Physical Fitness", "Psychology", "French", "Mathematics"],
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

  const achievements = [
    { number: 98, label: "Success Rate", icon: Trophy, suffix: "%" },
    { number: 15000, label: "Students Trained", icon: Users, suffix: "+" },
    { number: 20, label: "Top Institutions", icon: GraduationCap, suffix: "+" },
    { number: 24, label: "Expert Support", icon: Clock, suffix: "/7" },
  ];

  const testimonials = [
    {
      name: "Marie Ngozi",
      institution: "ENSP Yaoundé",
      text: "MindBoost's preparation program was exceptional. The structured approach and expert guidance helped me achieve my dream.",
      rating: 5,
      role: "Civil Engineer",
    },
    {
      name: "Jean-Paul Kamdem",
      institution: "HICM",
      text: "The business preparation course exceeded my expectations. Real-world case studies made all the difference.",
      rating: 5,
      role: "Business Analyst",
    },
    {
      name: "Amélie Takam",
      institution: "FHS Bamenda",
      text: "Outstanding medical preparation program. The clinical exposure and expert mentoring were invaluable.",
      rating: 5,
      role: "Medical Student",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Image */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
            alt="Student studying with laptop" 
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Enhanced Badge */}


            {/* Main Headline */}
            <h1 className="text-5xl lg:text-7xl font-black leading-tight max-w-4xl">
              <span className="text-white drop-shadow-lg">Excel in Your</span>
              <br />
              <span className="text-mindboost-green drop-shadow-lg">Academic</span>
              <br />
              <span className="text-white drop-shadow-lg">Journey</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-semibold max-w-3xl drop-shadow-md">
              Professional preparation courses for
              <span className="text-mindboost-green font-black">
                {" "}
                Cameroon's top institutions
              </span>
              . Expert guidance, proven results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button
              size="lg"
              onClick={handleViewProgramsClick}
              className="bg-mindboost-green hover:bg-mindboost-green/90 text-white text-xl px-12 py-6 rounded-2xl shadow-xl font-black group"
            >
              Explore Programs
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-mindboost-green text-mindboost-green hover:bg-mindboost-green hover:text-white text-xl px-12 py-6 rounded-2xl font-black transition-all"
              >
                <Play className="mr-3 h-6 w-6" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-8">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 bg-mindboost-green rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-12 h-12 bg-mindboost-green/80 rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-12 h-12 bg-mindboost-dark-green rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                  +15K
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-mindboost-green fill-current"
                    />
                  ))}
                  <span className="text-lg font-bold text-black ml-2">
                    4.9/5
                  </span>
                </div>
                <p className="text-sm text-black/60 font-semibold">
                  Trusted by 15,000+ students
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Under Banner */}
      <section className="py-16 bg-white border-t border-mindboost-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-mindboost-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <achievement.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-black mb-2">
                    <Counter
                      end={achievement.number}
                      suffix={achievement.suffix}
                      duration={2000 + index * 500}
                    />
                  </div>
                  <div className="text-sm text-black/60 font-semibold">
                    {achievement.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preparatory Classes Section */}
      <section className="py-24 bg-gradient-to-br from-white to-mindboost-light-green/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-6">
              Preparatory
              <span className="text-mindboost-green block">Classes</span>
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Comprehensive preparation programs designed for success in
              Cameroon's top institutions
            </p>
          </div>

          {/* Class Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {preparatoryClasses.map((course, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden"
              >
                <div className="h-2 bg-mindboost-green"></div>
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-col space-y-2">
                      <Badge
                        variant="outline"
                        className="border-mindboost-green text-mindboost-green w-fit"
                      >
                        {course.category}
                      </Badge>
                      {course.tier === "premium" && (
                        <Badge className="bg-yellow-100 text-yellow-800 w-fit">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-mindboost-green">
                        {course.price}
                      </div>
                      <div className="text-xs text-black/60">
                        {course.duration}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-black text-black mb-3 group-hover:text-mindboost-green transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-black/70 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Subjects */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-black mb-3">
                      Key Subjects:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {course.subjects.map((subject, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-mindboost-light-green text-black"
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-black mb-3">
                      What's Included:
                    </h4>
                    <ul className="space-y-2">
                      {course.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-black/70"
                        >
                          <CheckCircle className="h-4 w-4 text-mindboost-green mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {course.limitations && course.limitations.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-xs font-bold text-red-600 mb-2">
                          Not Included:
                        </h5>
                        <ul className="space-y-1">
                          {course.limitations.map((limitation, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-xs text-red-500"
                            >
                              <X className="h-3 w-3 text-red-500 mr-2" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnrollClick(course)}
                    className="w-full group-hover:bg-mindboost-green group-hover:text-white group-hover:border-transparent transition-all font-bold text-lg py-6"
                  >
                    {isAuthenticated ? 'View Course' : 'Enroll Now'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleViewProgramsClick}
              className="bg-mindboost-green hover:bg-mindboost-green/90 text-white text-xl px-16 py-6 rounded-2xl shadow-xl font-black"
            >
              View All Programs
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-mindboost-green/5 to-mindboost-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Real testimonials from students who achieved their academic goals
              with MindBoost
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8">
                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-mindboost-green fill-current"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-black/70 mb-8 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="border-t pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-mindboost-green rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-black">
                          {testimonial.name}
                        </p>
                        <p className="text-mindboost-green font-semibold text-sm">
                          {testimonial.role}
                        </p>
                        <p className="text-xs text-black/60">
                          {testimonial.institution}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-mindboost-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-mindboost-dark-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-mindboost-green rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8">
            Ready to Start Your
            <span className="text-black block">Success Journey?</span>
          </h2>

          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join thousands of successful students who chose MindBoost for their
            academic preparation
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-mindboost-green text-xl px-12 py-6 rounded-2xl shadow-xl font-black"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-mindboost-green text-xl px-12 py-6 rounded-2xl font-black"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
