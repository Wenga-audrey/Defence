import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Brain,
  Heart,
  ArrowRight,
} from "@/lib/icons";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-mindboost-ebony text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-mindboost-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-mindboost-green rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-mindboost-green rounded-full mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-white">
              Stay Connected to Excellence
            </h3>
            <p className="text-xl text-white/80 mb-8">
              Get exclusive access to the latest resources, expert insights, and
              premium opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-mindboost-green/50"
              />
              <Button className="bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold px-8 py-4 rounded-full">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-mindboost-green rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-black text-white">
                    Mind<span className="text-mindboost-green">Boost</span>
                  </span>
                  <div className="text-xs text-white/60 font-medium">
                    Excellence Academy
                  </div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed max-w-md">
                Your trusted partner in achieving academic excellence. We
                transform ambition into success through personalized learning
                experiences and premium educational resources.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-mindboost-green/30 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-mindboost-green/30 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-mindboost-green/30 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-mindboost-green/30 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Navigate
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/institutions"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Institutions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Services
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Premium Coaching
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Practice Tests
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    1-on-1 Mentoring
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Progress Tracking
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Success Guarantee
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-sm text-white/70">
                  <MapPin className="h-4 w-4 text-mindboost-green" />
                  <span>Yaoundé, Cameroon</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-white/70">
                  <Phone className="h-4 w-4 text-mindboost-green" />
                  <span>+237 6XX XXX XXX</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-white/70">
                  <Mail className="h-4 w-4 text-mindboost-green" />
                  <span>hello@mindboost.cm</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2024 MindBoost Excellence Academy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
