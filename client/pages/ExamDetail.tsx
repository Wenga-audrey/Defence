import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  Play,
  CheckCircle,
  Award,
  BarChart3,
  MessageCircle,
  Download,
  Zap,
  Brain,
  Trophy,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ExamDetail() {
  const { examId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock exam data - in real app, this would come from API
  const examData = {
    enam: {
      id: "enam",
      name: "ENAM (École Nationale d'Administration et de Magistrature)",
      shortName: "ENAM",
      description:
        "National School of Administration and Magistracy - Training for public administrators and magistrates",
      difficulty: "Advanced",
      duration: "6 months preparation",
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
      price: "150,000 FCFA",
      originalPrice: "200,000 FCFA",
      features: [
        "AI-Adaptive Learning",
        "Mock Exams",
        "Expert Mentoring",
        "Study Calendar",
      ],
      syllabus: {
        "General Knowledge": {
          weight: "25%",
          topics: [
            "Current Affairs",
            "History of Cameroon",
            "Geography",
            "Politics",
            "International Relations",
          ],
          lessons: 45,
          duration: "3 weeks",
        },
        "Administrative Law": {
          weight: "20%",
          topics: [
            "Public Service",
            "Administrative Procedures",
            "Administrative Courts",
            "Public Contracts",
          ],
          lessons: 38,
          duration: "2.5 weeks",
        },
        "Constitutional Law": {
          weight: "20%",
          topics: [
            "Constitutional Principles",
            "Separation of Powers",
            "Human Rights",
            "Electoral System",
          ],
          lessons: 35,
          duration: "2.5 weeks",
        },
        Economics: {
          weight: "15%",
          topics: [
            "Macroeconomics",
            "Development Economics",
            "Public Finance",
            "International Trade",
          ],
          lessons: 28,
          duration: "2 weeks",
        },
        French: {
          weight: "10%",
          topics: ["Essay Writing", "Grammar", "Vocabulary", "Comprehension"],
          lessons: 20,
          duration: "1.5 weeks",
        },
        English: {
          weight: "10%",
          topics: [
            "Business English",
            "Technical Writing",
            "Comprehension",
            "Translation",
          ],
          lessons: 18,
          duration: "1.5 weeks",
        },
      },
      studyPath: [
        {
          week: "Week 1-3",
          phase: "Foundation Building",
          focus: "General Knowledge & Current Affairs",
          activities: [
            "Daily news digest",
            "Historical timeline study",
            "Geography mapping",
          ],
        },
        {
          week: "Week 4-6",
          phase: "Legal Framework",
          focus: "Administrative & Constitutional Law",
          activities: [
            "Case study analysis",
            "Legal precedent review",
            "Mock legal scenarios",
          ],
        },
        {
          week: "Week 7-9",
          phase: "Economic Analysis",
          focus: "Economics & Public Finance",
          activities: [
            "Economic model analysis",
            "Budget simulation",
            "Policy impact studies",
          ],
        },
        {
          week: "Week 10-12",
          phase: "Final Preparation",
          focus: "Integration & Mock Exams",
          activities: [
            "Full mock exams",
            "Time management practice",
            "Stress management",
          ],
        },
      ],
      careerProspects: [
        {
          title: "Administrator",
          salary: "800,000 FCFA/month",
          description: "Public service administrator",
        },
        {
          title: "Magistrate",
          salary: "1,200,000 FCFA/month",
          description: "Judicial officer",
        },
        {
          title: "Prefect",
          salary: "1,500,000 FCFA/month",
          description: "Regional administrator",
        },
        {
          title: "Ambassador",
          salary: "2,000,000 FCFA/month",
          description: "Diplomatic representative",
        },
      ],
      testimonials: [
        {
          name: "Marie Ngozi",
          role: "Current ENAM Student",
          text: "MindBoost's AI-adaptive system helped me identify my weak areas and focus my studies effectively. I passed on my first attempt!",
          rating: 5,
          image: "MN",
        },
        {
          name: "Jean Mbarga",
          role: "ENAM Graduate 2023",
          text: "The personalized study calendar was game-changing. It fit perfectly with my work schedule.",
          rating: 5,
          image: "JM",
        },
      ],
    },
    // Add other exams data here...
  };

  const exam = examData[examId as keyof typeof examData] || examData.enam;

  const tabs = [
    { id: "overview", name: "Overview", icon: BookOpen },
    { id: "syllabus", name: "Syllabus", icon: Target },
    { id: "study-path", name: "Study Path", icon: TrendingUp },
    { id: "career", name: "Career Prospects", icon: Trophy },
    { id: "testimonials", name: "Success Stories", icon: Star },
  ];

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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mindboost-green to-mindboost-dark-green py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-24 h-24 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>

              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                {exam.shortName}
              </h1>

              <p className="text-xl text-white/90 leading-relaxed mb-8">
                {exam.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-white mb-1">
                    {exam.successRate}
                  </div>
                  <div className="text-white/80 text-sm">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white mb-1">
                    {exam.enrolled.toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm">Students Enrolled</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-mindboost-green hover:bg-white/90 font-bold px-8 py-4"
                >
                  <Link to={`/payment?exam=${exam.id}`}>
                    Start Preparation - {exam.price}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-mindboost-green font-bold px-8 py-4"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Quick Facts
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-white/80" />
                      <div>
                        <div className="text-white font-semibold">
                          Exam Date
                        </div>
                        <div className="text-white/80 text-sm">
                          {exam.examDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-white/80" />
                      <div>
                        <div className="text-white font-semibold">
                          Preparation Time
                        </div>
                        <div className="text-white/80 text-sm">
                          {exam.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-white/80" />
                      <div>
                        <div className="text-white font-semibold">Subjects</div>
                        <div className="text-white/80 text-sm">
                          {exam.subjects.length} core subjects
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-white/80" />
                      <div>
                        <div className="text-white font-semibold">
                          Eligibility
                        </div>
                        <div className="text-white/80 text-sm">
                          {exam.eligibility}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 whitespace-nowrap ${activeTab === tab.id
                      ? "border-mindboost-green text-mindboost-green font-bold"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "overview" && (
            <div className="space-y-12">
              {/* Features */}
              <div>
                <h2 className="text-3xl font-black text-black mb-8">
                  What You'll Get
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {exam.features.map((feature, index) => (
                    <Card
                      key={index}
                      className="border-0 shadow-lg text-center"
                    >
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-mindboost-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Brain className="h-6 w-6 text-mindboost-green" />
                        </div>
                        <h3 className="font-bold text-black mb-2">{feature}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-3xl font-black text-black mb-8">
                  Investment in Your Future
                </h2>
                <Card className="max-w-md mx-auto border-0 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl font-black text-mindboost-green mb-2">
                      {exam.price}
                    </div>
                    {exam.originalPrice && (
                      <div className="text-lg text-gray-500 line-through mb-4">
                        {exam.originalPrice}
                      </div>
                    )}
                    <div className="text-black/70 mb-6">{exam.studyPlan}</div>
                    <Button
                      asChild
                      className="w-full bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold py-3"
                    >
                      <Link to={`/payment?exam=${exam.id}`}>
                        Enroll Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "syllabus" && (
            <div>
              <h2 className="text-3xl font-black text-black mb-8">
                Detailed Syllabus
              </h2>
              <div className="grid gap-6">
                {Object.entries(exam.syllabus).map(([subject, details]) => (
                  <Card key={subject} className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-black">
                          {subject}
                        </h3>
                        <Badge className="bg-mindboost-green/10 text-mindboost-green">
                          {details.weight}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-black mb-2">
                            Topics Covered
                          </h4>
                          <ul className="space-y-1">
                            {details.topics.map((topic, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <CheckCircle className="h-4 w-4 text-mindboost-green" />
                                <span className="text-black/70">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-black mb-2">
                            Course Details
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-mindboost-green" />
                              <span className="text-black/70">
                                {details.lessons} lessons
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-mindboost-green" />
                              <span className="text-black/70">
                                {details.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button variant="outline" className="w-full">
                            Start {subject}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "study-path" && (
            <div>
              <h2 className="text-3xl font-black text-black mb-8">
                Your 12-Week Study Journey
              </h2>
              <div className="space-y-8">
                {exam.studyPath.map((phase, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 bg-mindboost-green rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-black mb-2">
                            {phase.phase}
                          </h3>
                          <div className="text-mindboost-green font-semibold mb-2">
                            {phase.week}
                          </div>
                          <p className="text-black/70 mb-4">{phase.focus}</p>
                          <div>
                            <h4 className="font-semibold text-black mb-2">
                              Key Activities:
                            </h4>
                            <ul className="space-y-1">
                              {phase.activities.map((activity, actIndex) => (
                                <li
                                  key={actIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <Target className="h-4 w-4 text-mindboost-green" />
                                  <span className="text-black/70">
                                    {activity}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "career" && (
            <div>
              <h2 className="text-3xl font-black text-black mb-8">
                Career Opportunities
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {exam.careerProspects.map((career, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-mindboost-green/10 rounded-full flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-mindboost-green" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-black">
                            {career.title}
                          </h3>
                          <div className="text-2xl font-black text-mindboost-green">
                            {career.salary}
                          </div>
                        </div>
                      </div>
                      <p className="text-black/70">{career.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div>
              <h2 className="text-3xl font-black text-black mb-8">
                Success Stories
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {exam.testimonials.map((testimonial, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-mindboost-green rounded-full flex items-center justify-center text-white font-bold">
                          {testimonial.image}
                        </div>
                        <div>
                          <h3 className="font-bold text-black">
                            {testimonial.name}
                          </h3>
                          <p className="text-black/70 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-yellow-500 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-black/80 italic">
                        "{testimonial.text}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-mindboost-light-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-black mb-4">
            Ready to Start Your Success Journey?
          </h2>
          <p className="text-xl text-black/70 mb-8">
            Join thousands who have already transformed their careers with our
            AI-powered preparation system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold px-8 py-4"
            >
              <Link to={`/payment?exam=${exam.id}`}>
                Enroll Now - {exam.price}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-mindboost-green text-mindboost-green hover:bg-mindboost-green hover:text-white font-bold px-8 py-4"
            >
              <Link to="/contact">Have Questions?</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
