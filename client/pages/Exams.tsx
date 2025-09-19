import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Shield,
  Users,
  Building,
  Briefcase,
  Calendar,
  Clock,
  Target,
  BookOpen,
  TrendingUp,
  Star,
  ArrowRight,
  Filter,
  Search,
  CheckCircle,
  X,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Exams() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const examCategories = [
    { id: "all", name: "All Exams", icon: BookOpen },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "security", name: "Security & Defense", icon: Shield },
    { id: "administration", name: "Public Administration", icon: Building },
    { id: "finance", name: "Finance & Customs", icon: Briefcase },
    { id: "health", name: "Health", icon: Users },
  ];

  const nationalExams = [
    {
      id: "enam-basic",
      name: "ENAM - Basic",
      category: "administration",
      shortName: "ENAM",
      description:
        "National School of Administration and Magistracy - Basic preparation",
      difficulty: "Advanced",
      duration: "1 month preparation",
      subjects: [
        "General Knowledge",
        "Administrative Law",
        "Constitutional Law",
        "Economics",
        "French",
        "English",
      ],
      examDate: "June 2024",
      registrationDeadline: "March 15, 2024",
      eligibility: "University degree required",
      studyPlan: "4 weeks intensive",
      successRate: "15%",
      enrolled: 2847,
      premium: false,
      tier: "basic",
      price: "30,000 FCFA",
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
      id: "enam-premium",
      name: "ENAM - Premium",
      category: "administration",
      shortName: "ENAM",
      description:
        "National School of Administration and Magistracy - Premium preparation",
      difficulty: "Advanced",
      duration: "3 months preparation",
      subjects: [
        "General Knowledge",
        "Administrative Law",
        "Constitutional Law",
        "Economics",
        "French",
        "English",
      ],
      examDate: "June 2024",
      registrationDeadline: "March 15, 2024",
      eligibility: "University degree required",
      studyPlan: "12 weeks intensive",
      successRate: "15%",
      enrolled: 2847,
      premium: true,
      tier: "premium",
      price: "55,000 FCFA",
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
      id: "ens-basic",
      name: "ENS - Basic",
      category: "education",
      shortName: "ENS",
      description:
        "Higher Teacher Training College - Basic preparation",
      difficulty: "Advanced",
      duration: "1 month preparation",
      subjects: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Literature",
        "Philosophy",
      ],
      examDate: "July 2024",
      registrationDeadline: "April 20, 2024",
      eligibility: "Bachelor's degree in relevant field",
      studyPlan: "4 weeks intensive",
      successRate: "22%",
      enrolled: 1965,
      premium: false,
      tier: "basic",
      price: "30,000 FCFA",
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
      id: "ens-premium",
      name: "ENS - Premium",
      category: "education",
      shortName: "ENS",
      description:
        "Higher Teacher Training College - Premium preparation",
      difficulty: "Advanced",
      duration: "3 months preparation",
      subjects: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Literature",
        "Philosophy",
      ],
      examDate: "July 2024",
      registrationDeadline: "April 20, 2024",
      eligibility: "Bachelor's degree in relevant field",
      studyPlan: "12 weeks intensive",
      successRate: "22%",
      enrolled: 1965,
      premium: true,
      tier: "premium",
      price: "55,000 FCFA",
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
      id: "police-basic",
      name: "Police Nationale - Basic",
      category: "security",
      shortName: "Police",
      description:
        "National Police Force - Basic preparation",
      difficulty: "Intermediate",
      duration: "1 month preparation",
      subjects: [
        "General Knowledge",
        "Criminal Law",
        "Physical Fitness",
        "Psychology",
        "French",
        "Mathematics",
      ],
      examDate: "May 2024",
      registrationDeadline: "February 28, 2024",
      eligibility: "High school diploma minimum",
      studyPlan: "4 weeks intensive",
      successRate: "35%",
      enrolled: 3421,
      premium: false,
      tier: "basic",
      price: "30,000 FCFA",
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
      id: "police-premium",
      name: "Police Nationale - Premium",
      category: "security",
      shortName: "Police",
      description:
        "National Police Force - Premium preparation",
      difficulty: "Intermediate",
      duration: "3 months preparation",
      subjects: [
        "General Knowledge",
        "Criminal Law",
        "Physical Fitness",
        "Psychology",
        "French",
        "Mathematics",
      ],
      examDate: "May 2024",
      registrationDeadline: "February 28, 2024",
      eligibility: "High school diploma minimum",
      studyPlan: "12 weeks intensive",
      successRate: "35%",
      enrolled: 3421,
      premium: true,
      tier: "premium",
      price: "55,000 FCFA",
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
      id: "customs-basic",
      name: "Douanes - Basic",
      category: "finance",
      shortName: "Customs",
      description:
        "Customs Administration - Basic preparation",
      difficulty: "Intermediate",
      duration: "1 month preparation",
      subjects: [
        "Economics",
        "International Trade",
        "Customs Law",
        "Mathematics",
        "Geography",
        "French",
      ],
      examDate: "August 2024",
      registrationDeadline: "May 30, 2024",
      eligibility: "High school diploma required",
      studyPlan: "4 weeks intensive",
      successRate: "28%",
      enrolled: 1876,
      premium: false,
      tier: "basic",
      price: "30,000 FCFA",
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
      id: "customs-premium",
      name: "Douanes - Premium",
      category: "finance",
      shortName: "Customs",
      description:
        "Customs Administration - Premium preparation",
      difficulty: "Intermediate",
      duration: "3 months preparation",
      subjects: [
        "Economics",
        "International Trade",
        "Customs Law",
        "Mathematics",
        "Geography",
        "French",
      ],
      examDate: "August 2024",
      registrationDeadline: "May 30, 2024",
      eligibility: "High school diploma required",
      studyPlan: "12 weeks intensive",
      successRate: "28%",
      enrolled: 1876,
      premium: true,
      tier: "premium",
      price: "55,000 FCFA",
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
      id: "gendarmerie-basic",
      name: "Gendarmerie - Basic",
      category: "security",
      shortName: "Gendarmerie",
      description: "National Gendarmerie - Basic preparation",
      difficulty: "Intermediate",
      duration: "1 month preparation",
      subjects: [
        "General Knowledge",
        "Military Law",
        "Physical Training",
        "Discipline",
        "French",
        "Civic Education",
      ],
      examDate: "September 2024",
      registrationDeadline: "June 15, 2024",
      eligibility: "High school diploma, age 18-25",
      studyPlan: "4 weeks intensive",
      successRate: "30%",
      enrolled: 2156,
      premium: false,
      tier: "basic",
      price: "30,000 FCFA",
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
      id: "gendarmerie-premium",
      name: "Gendarmerie - Premium",
      category: "security",
      shortName: "Gendarmerie",
      description: "National Gendarmerie - Premium preparation",
      difficulty: "Intermediate",
      duration: "3 months preparation",
      subjects: [
        "General Knowledge",
        "Military Law",
        "Physical Training",
        "Discipline",
        "French",
        "Civic Education",
      ],
      examDate: "September 2024",
      registrationDeadline: "June 15, 2024",
      eligibility: "High school diploma, age 18-25",
      studyPlan: "12 weeks intensive",
      successRate: "30%",
      enrolled: 2156,
      premium: true,
      tier: "premium",
      price: "55,000 FCFA",
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
      id: "iric-basic",
      name: "IRIC - Basic",
      category: "administration",
      shortName: "IRIC",
      description:
        "Institute of International Relations - Basic preparation",
      difficulty: "Advanced",
      duration: "1 month preparation",
      subjects: [
        "International Relations",
        "Diplomacy",
        "Political Science",
        "Economics",
        "Languages",
        "History",
      ],
      examDate: "October 2024",
      registrationDeadline: "July 20, 2024",
      eligibility: "University degree, language proficiency",
      studyPlan: "4 weeks intensive",
      successRate: "18%",
      enrolled: 892,
      premium: false,
      tier: "basic",
      price: "30,000 FCFA",
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
      id: "iric-premium",
      name: "IRIC - Premium",
      category: "administration",
      shortName: "IRIC",
      description:
        "Institute of International Relations - Premium preparation",
      difficulty: "Advanced",
      duration: "3 months preparation",
      subjects: [
        "International Relations",
        "Diplomacy",
        "Political Science",
        "Economics",
        "Languages",
        "History",
      ],
      examDate: "October 2024",
      registrationDeadline: "July 20, 2024",
      eligibility: "University degree, language proficiency",
      studyPlan: "12 weeks intensive",
      successRate: "18%",
      enrolled: 892,
      premium: true,
      tier: "premium",
      price: "55,000 FCFA",
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
      id: "health-basic",
      name: "Health Ministry - Basic",
      category: "health",
      shortName: "Health",
      description:
        "Ministry of Health competitive exams - Basic preparation",
      difficulty: "Advanced",
      duration: "1 month preparation",
      subjects: [
        "Medicine",
        "Public Health",
        "Epidemiology",
        "Healthcare Management",
        "Ethics",
        "Statistics",
      ],
      examDate: "November 2024",
      registrationDeadline: "August 31, 2024",
      eligibility: "Medical degree or health sciences",
      studyPlan: "4 weeks intensive",
      successRate: "25%",
      enrolled: 1234,
      premium: false,
      tier: "basic",
      price: "30,000 FCFA",
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
      id: "health-premium",
      name: "Health Ministry - Premium",
      category: "health",
      shortName: "Health",
      description:
        "Ministry of Health competitive exams - Premium preparation",
      difficulty: "Advanced",
      duration: "3 months preparation",
      subjects: [
        "Medicine",
        "Public Health",
        "Epidemiology",
        "Healthcare Management",
        "Ethics",
        "Statistics",
      ],
      examDate: "November 2024",
      registrationDeadline: "August 31, 2024",
      eligibility: "Medical degree or health sciences",
      studyPlan: "12 weeks intensive",
      successRate: "25%",
      enrolled: 1234,
      premium: true,
      tier: "premium",
      price: "55,000 FCFA",
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
      id: "finance-basic",
      name: "Ministry of Finance - Basic",
      category: "finance",
      shortName: "Finance",
      description:
        "Ministry of Finance competitive exams - Basic preparation",
      difficulty: "Advanced",
      duration: "1 month preparation",
      subjects: [
        "Public Finance",
        "Accounting",
        "Economics",
        "Statistics",
        "Auditing",
        "Tax Law",
      ],
      examDate: "December 2024",
      registrationDeadline: "September 15, 2024",
      eligibility: "Economics or Finance degree",
      studyPlan: "4 weeks intensive",
      successRate: "20%",
      enrolled: 1567,
      premium: false,
      tier: "basic",
      price: "30,000 FCFA",
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
      id: "finance-premium",
      name: "Ministry of Finance - Premium",
      category: "finance",
      shortName: "Finance",
      description:
        "Ministry of Finance competitive exams - Premium preparation",
      difficulty: "Advanced",
      duration: "3 months preparation",
      subjects: [
        "Public Finance",
        "Accounting",
        "Economics",
        "Statistics",
        "Auditing",
        "Tax Law",
      ],
      examDate: "December 2024",
      registrationDeadline: "September 15, 2024",
      eligibility: "Economics or Finance degree",
      studyPlan: "12 weeks intensive",
      successRate: "20%",
      enrolled: 1567,
      premium: true,
      tier: "premium",
      price: "55,000 FCFA",
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

  const filteredExams = nationalExams.filter((exam) => {
    const matchesCategory =
      selectedCategory === "all" || exam.category === selectedCategory;
    const matchesSearch =
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subjects.some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "bg-red-100 text-red-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Beginner":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "education":
        return GraduationCap;
      case "security":
        return Shield;
      case "administration":
        return Building;
      case "finance":
        return Briefcase;
      case "health":
        return Users;
      default:
        return BookOpen;
    }
  };

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

          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Master Your
            <span className="block text-white/80">National Exams</span>
          </h1>

          <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12">
            AI-powered adaptive preparation for ENAM, ENS, Police, Customs, and
            all Cameroonian competitive exams. Personalized study plans that fit
            your schedule.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">15,000+</div>
              <div className="text-white/80">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">8</div>
              <div className="text-white/80">Major Exams</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">94%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-mindboost-light-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams, subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {examCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${selectedCategory === category.id
                        ? "bg-mindboost-green text-white"
                        : "border-mindboost-green text-mindboost-green hover:bg-mindboost-green hover:text-white"
                      }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Exams Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredExams.map((exam) => {
              const CategoryIcon = getCategoryIcon(exam.category);
              return (
                <Card
                  key={exam.id}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all group"
                >
                  <CardHeader className="relative">
                    {exam.premium && (
                      <Badge className="absolute top-4 right-4 bg-yellow-100 text-yellow-800">
                        Premium
                      </Badge>
                    )}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-mindboost-green/10 rounded-full flex items-center justify-center">
                        <CategoryIcon className="h-6 w-6 text-mindboost-green" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black">
                          {exam.shortName}
                        </h3>
                        <Badge className={getDifficultyColor(exam.difficulty)}>
                          {exam.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-black mb-2">
                      {exam.name}
                    </h4>
                    <p className="text-black/70 text-sm">{exam.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Key Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-mindboost-green" />
                        <span className="text-black/70">{exam.examDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-mindboost-green" />
                        <span className="text-black/70">{exam.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-mindboost-green" />
                        <span className="text-black/70">
                          {exam.successRate} success
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-mindboost-green" />
                        <span className="text-black/70">
                          {exam.enrolled.toLocaleString()} enrolled
                        </span>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div>
                      <h5 className="font-semibold text-black mb-2">
                        Key Subjects:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {exam.subjects.slice(0, 3).map((subject, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {subject}
                          </Badge>
                        ))}
                        {exam.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{exam.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h5 className="font-semibold text-black mb-2">
                        Features:
                      </h5>
                      <ul className="space-y-1">
                        {exam.features.slice(0, 2).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <div className="w-2 h-2 bg-mindboost-green rounded-full"></div>
                            <span className="text-black/70">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price & CTA */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-black text-mindboost-green">
                          {exam.price}
                        </div>
                        <div className="text-sm text-black/70">
                          {exam.studyPlan}
                        </div>
                      </div>

                      <Button
                        asChild
                        className="w-full bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold"
                      >
                        <Link to={`/pricing?exam=${encodeURIComponent(exam.name)}&tier=${exam.tier}&price=${encodeURIComponent(exam.price)}&duration=${encodeURIComponent(exam.duration)}`}>
                          Start Preparation
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-mindboost-dark-green to-mindboost-green text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join thousands of successful candidates who achieved their dreams
            with MindBoost's AI-powered adaptive learning system.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-mindboost-green hover:bg-white/90 text-xl px-12 py-6 rounded-2xl shadow-xl font-black"
            >
              <Link to="/get-started">
                Start Your Journey
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-mindboost-green text-xl px-12 py-6 rounded-2xl font-black"
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
