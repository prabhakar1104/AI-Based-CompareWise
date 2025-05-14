"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronRight,
  MessageSquare,
  Image as ImageIcon,
  BarChart3,
  Layers,
  Clock,
  Search,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import Contact from "./dashboard/_components/Contact";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: false,
        error: "Please fill out all fields",
      });
      return;
    }

    // Mock form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        error: null,
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        message: "",
      });

      // Reset status after 5 seconds
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          error: null,
        });
      }, 5000);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BestChoice
                <span className="text-xs align-super bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full ml-1">
                  AI
                </span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                className="group relative px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10"></span>
              </a>
              <a
                href="#how-it-works"
                className="group relative px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10"></span>
              </a>
              <a
                href="#contact"
                className="group relative px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10"></span>
              </a>
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              <Link href="/dashboard">
                <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
                  Open Dashboard
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 ml-1.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4.25A2.25 2.25 0 015.25 2h10.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-10.5A2.25 2.25 0 013 6.75v-2.5zm0 7A2.25 2.25 0 015.25 11h10.5A2.25 2.25 0 0118 13.25v2.5A2.25 2.25 0 0115.75 18h-10.5A2.25 2.25 0 013 15.75v-2.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <svg
                className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                fill="currentColor"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="50,0 100,0 50,100 0,100" />
              </svg>

              <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Make smarter choices</span>
                    <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      with AI-powered comparisons
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Compare any products, services, or options with our
                    intelligent comparison tool. Upload images or enter text,
                    and let our AI provide clear, unbiased insights to help you
                    decide.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link href="/dashboard">
                        <Button
                          size="lg"
                          className="w-full flex items-center justify-center px-8 py-3"
                        >
                          Get started
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <a
                        href="#how-it-works"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                      >
                        How it works
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="hero.jpg"
              alt="Comparison dashboardd"
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for smarter decisions
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our powerful comparison tool helps you analyze options and make
                the best choice every time.
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Image Recognition
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Upload product images and let our AI extract key details
                      automatically, saving you time and effort.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Side-by-Side Analysis
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Compare unlimited options with our intuitive interface
                      that highlights key differences and similarities.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      AI Recommendations
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Get intelligent insights and personalized recommendations
                      based on your specific needs and priorities.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Multi-Item Comparison
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Compare more than just two items at once, making complex
                      decisions simpler and more informed.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Quick Results
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Save hours of research with instant, comprehensive
                      comparisons delivered in seconds.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Search className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Simple Interface
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      User-friendly design that's easy to use for everyone,
                      regardless of technical knowledge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                How It Works
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Three simple steps to better decisions
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">
                    Enter Your Options
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Type in the items you want to compare or upload images of
                    products.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">
                    AI Analysis
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our AI processes the information and performs a
                    comprehensive comparison.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-2xl font-bold">
                    3
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">
                    Get Results
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Receive a clear, easy-to-understand comparison with
                    recommendations tailored to you.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/dashboard">
                <Button size="lg" className="px-8">
                  Try it now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Trusted by users worldwide
            </h2>
            <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-700">S</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Sarah T.
                    </h3>
                    <p className="text-sm text-gray-500">Tech Enthusiast</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "I was stuck between three different laptop models until I
                  used this tool. The clear comparison helped me make the right
                  choice without any regrets."
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-700">M</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Michael R.
                    </h3>
                    <p className="text-sm text-gray-500">
                      Small Business Owner
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "The image upload feature saved me tons of time. I just
                  snapped photos of products and got instant comparisons.
                  Brilliant!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-700">J</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Jessica L.
                    </h3>
                    <p className="text-sm text-gray-500">Parent</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "As someone who isn't tech-savvy, I appreciate how easy this
                  tool is to use. It helped me compare different strollers for
                  my baby without feeling overwhelmed."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <Contact />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 mr-3"></div>
                <span className="text-2xl font-bold text-white">
                  BestChoice
                </span>
              </div>
              <p className="text-gray-300 text-base">
                Making complex decisions simple with AI-powered comparison
                tools.
              </p>
              <div className="flex space-x-6">
                <a
                  href="https://www.instagram.com/prabhakar_1104_"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/prabhakar_1104_"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">Twitter</span>
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://github.com/prabhakar1104"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">GitHub</span>
                  <Github className="h-6 w-6" />
                </a>
                {/* <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-6 w-6" />
                </a> */}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Product
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="#features"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="#how-it-works"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        How it works
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="/footer/help"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a
                        href="#contact"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="/footer/status"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        API Status
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Company
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="/footer/about"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="/footer/blog"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="/footer/career"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Careers
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Legal
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link
                        href="/footer/privacy"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/footer/terms"
                        className="text-base text-gray-300 hover:text-white"
                      >
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2025 CompareWise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
