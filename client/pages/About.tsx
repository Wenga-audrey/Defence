import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  Trophy,
  Target,
  Heart,
  Lightbulb,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  BookOpen,
  Globe,
  Shield,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description:
        "We strive for the highest standards in education and student success.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Our dedication to student growth drives everything we do.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We continuously evolve our methods to provide the best learning experience.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We maintain transparency and honesty in all our interactions.",
    },
  ];

  const stats = [
    { number: "98%", label: "Success Rate", icon: Trophy },
    { number: "15,000+", label: "Students Trained", icon: Users },
    { number: "20+", label: "Partner Institutions", icon: GraduationCap },
    { number: "5+", label: "Years Experience", icon: Award },
  ];

  const team = [
    {
      name: "Dr. Emmanuel Njoya",
      role: "Founder & CEO",
      specialization: "Engineering Education",
      experience: "15+ years",
      education: "PhD in Educational Technology",
    },
    {
      name: "Prof. Marie Fotso",
      role: "Academic Director",
      specialization: "Mathematics & Sciences",
      experience: "12+ years",
      education: "PhD in Applied Mathematics",
    },
    {
      name: "Dr. Jean-Claude Mbarga",
      role: "Technology Director",
      specialization: "Digital Learning",
      experience: "10+ years",
      education: "PhD in Computer Science",
    },
    {
      name: "Ms. Catherine Ndom",
      role: "Student Success Manager",
      specialization: "Student Psychology",
      experience: "8+ years",
      education: "Masters in Educational Psychology",
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: "Foundation",
      description:
        "MindBoost Excellence Academy was founded with a vision to revolutionize exam preparation in Cameroon.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description:
        "Launched our comprehensive online learning platform reaching students nationwide.",
    },
    {
      year: "2021",
      title: "Partnership Expansion",
      description:
        "Established partnerships with 10+ top institutions across Cameroon.",
    },
    {
      year: "2022",
      title: "Recognition",
      description:
        "Awarded 'Best Educational Innovation' by the Ministry of Higher Education.",
    },
    {
      year: "2023",
      title: "Scale & Impact",
      description:
        "Reached 10,000+ successful student graduations and expanded to neighboring countries.",
    },
    {
      year: "2024",
      title: "AI Integration",
      description:
        "Introduced AI-powered personalized learning paths and predictive analytics.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mindboost-green to-mindboost-dark-green py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Empowering
              <span className="block text-white/80">Academic Dreams</span>
            </h1>

            <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto">
              We are Cameroon's premier educational institution dedicated to
              helping students excel in their entrance exams and achieve their
              academic aspirations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-mindboost-light-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-black mb-8">
                Our Mission
              </h2>
              <p className="text-xl text-black/80 leading-relaxed mb-8">
                To provide exceptional, personalized education that empowers
                students to excel in competitive entrance examinations and
                pursue their academic dreams with confidence.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-mindboost-green" />
                  <span className="text-black font-semibold">
                    Personalized learning experiences
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-mindboost-green" />
                  <span className="text-black font-semibold">
                    Expert mentorship and guidance
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-mindboost-green" />
                  <span className="text-black font-semibold">
                    Proven success methodologies
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-4">
                    Our Vision
                  </h3>
                  <p className="text-black/80 leading-relaxed">
                    To be the leading educational institution in Central Africa,
                    recognized for transforming lives through excellence in exam
                    preparation and academic achievement.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-4">
                    Our Promise
                  </h3>
                  <p className="text-black/80 leading-relaxed">
                    Every student who joins MindBoost receives dedicated
                    support, cutting-edge resources, and the guidance needed to
                    achieve their academic goals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              These principles guide everything we do and shape the MindBoost
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-mindboost-green/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-mindboost-green group-hover:scale-110 transition-all">
                    <value.icon className="h-8 w-8 text-mindboost-green group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">
                    {value.title}
                  </h3>
                  <p className="text-black/70">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-mindboost-green text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6">Our Impact</h2>
            <p className="text-xl text-white/90">
              Numbers that speak to our commitment and success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                <div className="text-5xl font-black text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-6">Our Journey</h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              From a vision to transform education to becoming Cameroon's
              leading exam preparation academy.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-mindboost-green rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-lg">
                      {milestone.year}
                    </span>
                  </div>
                </div>
                <Card className="flex-1 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-black mb-4">
                      {milestone.title}
                    </h3>
                    <p className="text-black/80 leading-relaxed">
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-mindboost-light-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Experienced educators and industry experts dedicated to your
              success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-mindboost-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-black text-2xl">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    {member.name}
                  </h3>
                  <div className="text-mindboost-green font-semibold mb-4">
                    {member.role}
                  </div>
                  <div className="space-y-2 text-sm text-black/70">
                    <div>
                      <strong>Specialization:</strong> {member.specialization}
                    </div>
                    <div>
                      <strong>Experience:</strong> {member.experience}
                    </div>
                    <div>
                      <strong>Education:</strong> {member.education}
                    </div>
                  </div>
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
            <Star className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join thousands of successful students who have achieved their
            academic dreams with MindBoost.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-mindboost-green hover:bg-white/90 text-xl px-12 py-6 rounded-2xl shadow-xl font-black"
            >
              <Link to="/get-started">
                Get Started Today
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-mindboost-green text-xl px-12 py-6 rounded-2xl font-black"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
