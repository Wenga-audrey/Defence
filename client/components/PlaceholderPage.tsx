import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Construction, ArrowLeft, MessageCircle } from "@/lib/icons";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function PlaceholderPage({
  title,
  description,
  icon: Icon = Construction,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="text-center border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-mindboost-purple to-mindboost-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-black mb-4">{title}</h1>
            <p className="text-xl text-black/70 mb-8 max-w-2xl mx-auto">
              {description}
            </p>

            <div className="bg-gradient-to-r from-mindboost-green/10 to-mindboost-light-green/20 rounded-2xl p-8 mb-8 border border-mindboost-green/20">
              <h3 className="text-xl font-bold text-black mb-3">
                🚧 Page Under Development
              </h3>
              <p className="text-black/70 leading-relaxed">
                We're actively working on this section to bring you the most
                exceptional experience possible. Check back soon for exciting
                new features and content!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-mindboost-green hover:bg-mindboost-green/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-mindboost-green text-mindboost-green hover:bg-mindboost-green hover:text-white font-bold px-8 py-3 rounded-xl transition-all transform hover:-translate-y-1"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
