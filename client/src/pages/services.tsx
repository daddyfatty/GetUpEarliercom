import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServicesGrid } from "@/components/services-grid";
import { Link } from "wouter";
import CheckoutModal from "@/components/checkout-modal";

export default function Services() {
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    packageTitle: string;
    price: string;
    description: string;
  }>({
    isOpen: false,
    packageTitle: '',
    price: '',
    description: ''
  });

  const openCheckout = (packageTitle: string, price: string, description: string) => {
    setCheckoutModal({
      isOpen: true,
      packageTitle,
      price,
      description
    });
  };

  const closeCheckout = () => {
    setCheckoutModal({
      isOpen: false,
      packageTitle: '',
      price: '',
      description: ''
    });
  };

  const packages = [
    {
      title: "First Session For New Clients",
      price: "FREE",
      priceTag: "1st Time",
      description: "It all starts with a 30-minute session! Small, incremental changes, nothing drastic.",
      features: [
        "For 1st time clients",
        "In-person Orange, CT or virtual anywhere",
        "7 days a week 4:45am-2pm"
      ],
      buttonText: "Reach Out And Book Session",
      isPopular: false,
      isFree: true,
      backgroundColor: "bg-orange-50",
      badge: undefined
    },
    {
      title: "1-on-1 Personal Training",
      price: "$50",
      priceTag: "Per 30 Minute Session",
      description: "Maximize your time with efficient, results-driven 30-minute strength sessions designed to build strength and improve fitness. Each session incorporates strength training, weight lifting, compound exercises, bodyweight movements, yoga-inspired stretches, efficient drills, portable workouts, and nutrition information you can take with you when you travel and navigate life on your own. When there is AI, no app, no coach, or no trainer to help you.",
      features: [
        "100% customized training",
        "Powerful 30 minute workouts",
        "In-person Orange, CT or virtual anywhere*"
      ],
      buttonText: "Book Session",
      isPopular: false,
      backgroundColor: "bg-slate-900",
      textColor: "text-white",
      quantityInput: true,
      badge: undefined
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section + Services Grid with Gradient Background */}
      <section className="bg-gradient-to-b from-[#BCDCEC] via-[#E8F4F8] to-white">
        {/* Hero Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-purple-800/10 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              1-on-1 Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Comprehensive<br className="hidden sm:block" />
              <span className="text-purple-800">Coaching & Training</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Personalized coaching tailored to your individual needs and goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-800 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">30 Years Experience</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Certified Training</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ServicesGrid 
              showImages={true} 
              showReadMore={true} 
              title=""
              subtitle=""
            />
          </div>
        </div>
      </section>
      {/* Strength Training & Coaching Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Strength Training & Coaching
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the level of support that best fits your goals and lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ gap: '25px' }}>
            {packages.map((pkg, index) => (
              <Card key={index} className={`${pkg.backgroundColor || 'bg-white'} ${pkg.textColor || 'text-gray-900'} ${pkg.isPopular ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} relative`}>
                {pkg.isPopular && pkg.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      {pkg.badge}
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className={`text-xl font-semibold mb-4 ${pkg.textColor || 'text-gray-900'}`}>
                      {pkg.title}
                    </h3>
                    
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className={`text-4xl font-bold ${pkg.isFree ? 'text-gray-900' : pkg.textColor || 'text-gray-900'}`}>
                        {pkg.price}
                      </span>
                      {pkg.priceTag && (
                        <Badge variant="secondary" className="bg-gray-500 text-white text-xs">
                          {pkg.priceTag}
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`text-sm leading-relaxed mb-6 ${pkg.textColor || 'text-gray-700'}`}>
                      {pkg.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className={`text-sm ${pkg.textColor || 'text-gray-700'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    {pkg.quantityInput && (
                      <div className="mb-4">
                        <label className={`block text-sm font-medium mb-2 ${pkg.textColor || 'text-gray-700'}`}>
                          30 Minute Training / Coaching Session
                        </label>
                        <input 
                          type="number" 
                          defaultValue="1" 
                          min="1"
                          className="w-16 px-3 py-2 border rounded-md text-gray-900 bg-white"
                        />
                      </div>
                    )}
                    
                    {pkg.isFree ? (
                      <Link href="/contact">
                        <Button 
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 px-8 text-lg rounded-lg h-16"
                        >
                          {pkg.buttonText} →
                        </Button>
                      </Link>
                    ) : pkg.backgroundColor === 'bg-slate-900' ? (
                      <>
                        <Link href="/contact">
                          <Button 
                            className="w-full bg-blue-400 hover:bg-blue-500 text-gray-900 font-medium py-6 px-8 text-lg rounded-lg h-16 mb-4"
                          >
                            Book Session
                          </Button>
                        </Link>
                        <Button 
                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-6 px-8 text-lg rounded-lg h-16"
                          onClick={() => openCheckout(pkg.title, pkg.price, pkg.description)}
                        >
                          Buy now
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/contact">
                          <Button 
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 px-8 text-lg rounded-lg h-16"
                          >
                            💳 Book Session
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full py-6 px-8 text-lg rounded-lg h-16 mt-3">
                          💰 Pay with PayPal
                        </Button>
                        <Link href="/contact">
                          <Button variant="ghost" className="w-full text-gray-600 py-6 px-8 text-lg rounded-lg h-16 mt-3">
                            📅 Book Consultation First
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModal.isOpen}
        onClose={closeCheckout}
        packageTitle={checkoutModal.packageTitle}
        price={checkoutModal.price}
        description={checkoutModal.description}
      />
    </div>
  );
}