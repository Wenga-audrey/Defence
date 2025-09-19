import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, Search } from "@/lib/icons";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-mindboost-green/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Simple Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-mindboost-green rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-black">
                Mind<span className="text-mindboost-green">Boost</span>
              </span>
              <div className="text-xs text-black/60 font-semibold -mt-1">
                Excellence Academy
              </div>
            </div>
          </Link>

          {/* Simplified Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className="px-4 py-2 text-black hover:text-mindboost-green transition-colors font-semibold hover:bg-mindboost-light-green rounded-xl"
            >
              Home
            </Link>

            <Link
              to="/exams"
              className="px-4 py-2 text-black hover:text-mindboost-green transition-colors font-semibold hover:bg-mindboost-light-green rounded-xl"
            >
              Exams
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-black hover:text-mindboost-green transition-colors font-semibold hover:bg-mindboost-light-green rounded-xl"
            >
              About
            </Link>
            <Link
              to="/pricing"
              className="px-4 py-2 text-black hover:text-mindboost-green transition-colors font-semibold hover:bg-mindboost-light-green rounded-xl"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 text-black hover:text-mindboost-green transition-colors font-semibold hover:bg-mindboost-light-green rounded-xl"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-black hover:text-mindboost-green font-semibold"
            >
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold rounded-full px-6 shadow-lg hover:shadow-xl transition-all"
              size="sm"
            >
              <Link to="/get-started">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-2xl text-black hover:text-mindboost-green hover:bg-mindboost-light-green transition-all"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-3 bg-mindboost-light-green rounded-full border border-mindboost-green/20 focus:outline-none focus:ring-2 focus:ring-mindboost-green/50 focus:border-mindboost-green transition-all"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6 border-t border-mindboost-green/20 mt-4 pt-4 bg-white/50 backdrop-blur rounded-2xl">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                className="px-4 py-3 text-black hover:text-mindboost-green hover:bg-mindboost-light-green rounded-xl transition-all font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/institutions"
                className="px-4 py-3 text-black hover:text-mindboost-green hover:bg-mindboost-light-green rounded-xl transition-all font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Institutions
              </Link>
              <Link
                to="/exams"
                className="px-4 py-3 text-black hover:text-mindboost-green hover:bg-mindboost-light-green rounded-xl transition-all font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Exams
              </Link>
              <Link
                to="/about"
                className="px-4 py-3 text-black hover:text-mindboost-green hover:bg-mindboost-light-green rounded-xl transition-all font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="px-4 py-3 text-black hover:text-mindboost-green hover:bg-mindboost-light-green rounded-xl transition-all font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="px-4 py-3 text-black hover:text-mindboost-green hover:bg-mindboost-light-green rounded-xl transition-all font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-mindboost-green/20 mt-4">
                <div className="flex flex-col space-y-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="justify-start text-black font-semibold"
                  >
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-mindboost-green text-white font-bold rounded-full justify-start shadow-lg"
                    size="sm"
                  >
                    <Link to="/get-started">Start Your Journey</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
