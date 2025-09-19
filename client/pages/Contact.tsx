import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  User,
  FileText,
  CheckCircle,
  Award,
  Heart,
  Zap,
} from "@/lib/icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: ["Yaoundé, Bastos", "Near Ministry of Education", "Cameroon"],
      color: "from-mindboost-green to-mindboost-dark-green",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [
        "+237 6XX XXX XXX",
        "+237 6YY YYY YYY",
        "24/7 Support Available",
      ],
      color: "from-mindboost-dark-green to-mindboost-green",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "hello@mindboost.cm",
        "support@mindboost.cm",
        "Quick Response Guaranteed",
      ],
      color: "from-mindboost-green to-mindboost-dark-green",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Mon - Fri: 8AM - 6PM",
        "Saturday: 9AM - 4PM",
        "Sunday: Emergency Only",
      ],
      color: "from-mindboost-dark-green to-mindboost-green",
    },
  ];

  const team = [
    {
      name: "Dr. Emmanuel Tabi",
      role: "Academic Director",
      specialization: "Engineering & Mathematics",
      experience: "15+ years",
      image: "ET",
    },
    {
      name: "Prof. Marie Ngozi",
      role: "Medical Sciences Lead",
      specialization: "Health Sciences & Biology",
      experience: "12+ years",
      image: "MN",
    },
    {
      name: "Mr. Jean-Paul Kamdem",
      role: "Business Studies Head",
      specialization: "Commerce & Management",
      experience: "10+ years",
      image: "JPK",
    },
    {
      name: "Ms. Amélie Takam",
      role: "Student Success Manager",
      specialization: "Academic Counseling",
      experience: "8+ years",
      image: "AT",
    },
  ];

  const faqs = [
    {
      question: "How long are the preparation courses?",
      answer:
        "Our courses range from 3 to 8 months depending on the institution and complexity of the entrance exam.",
    },
    {
      question: "Do you offer online classes?",
      answer:
        "Yes! We offer both in-person and online classes with live sessions and recorded materials for flexible learning.",
    },
    {
      question: "What is your success rate?",
      answer:
        "We maintain a 98% success rate with over 15,000 students successfully placed in their desired institutions.",
    },
    {
      question: "Are there payment plans available?",
      answer:
        "Yes, we offer flexible payment plans with installments to make quality education accessible to everyone.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-mindboost-light-green via-white to-mindboost-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">

            <h1 className="text-5xl lg:text-6xl font-black text-black mb-6">
              Let's Start Your
              <span className="text-mindboost-green block">Success Story</span>
            </h1>
            <p className="text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your academic future? Our expert team is here
              to guide you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">
                    {info.title}
                  </h3>
                  <div className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-black/70 text-sm font-medium"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-gradient-to-br from-mindboost-green/5 to-mindboost-light-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-black mb-4">
                    Send Us a Message
                  </h2>
                  <p className="text-black/70">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </div>

                {submitted && (
                  <div className="mb-6 p-4 bg-mindboost-green/10 border border-mindboost-green/20 rounded-xl flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-mindboost-green" />
                    <span className="text-mindboost-green font-semibold">
                      Message sent successfully! We'll be in touch soon.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                        placeholder="+237 6XX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Target Institution
                      </label>
                      <select
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                      >
                        <option value="">Select Institution</option>
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

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
                      placeholder="What can we help you with?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-mindboost-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all resize-none"
                      placeholder="Tell us more about your goals and how we can help..."
                      required
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold py-4 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                  >
                    <Send className="mr-3 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-8">
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-6">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Dedicated professionals committed to your academic success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group text-center"
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-mindboost-green to-mindboost-dark-green rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform shadow-lg">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    {member.name}
                  </h3>
                  <p className="text-mindboost-green font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-black/70 mb-3">
                    {member.specialization}
                  </p>
                  <Badge
                    variant="outline"
                    className="border-mindboost-green text-mindboost-green text-xs"
                  >
                    {member.experience}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-mindboost-light-green/30 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-black/70">
              Quick answers to common questions about our programs
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-black mb-4 flex items-start">
                    <MessageCircle className="h-6 w-6 text-mindboost-green mr-3 mt-0.5 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-black/70 leading-relaxed ml-9">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-mindboost-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful students who chose MindBoost for their
            academic journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-mindboost-green hover:bg-white/90 font-bold px-8 py-4 text-lg">
              <Heart className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-mindboost-green font-bold px-8 py-4 text-lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
