"use client"
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search } from "lucide-react";

export default function HelpCenter() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create a comparison?",
          a: "Click the 'Open Dashboard' button, then select 'New Comparison'. You can either enter text descriptions or upload images of the items you want to compare."
        },
        {
          q: "Is there a limit to how many items I can compare?",
          a: "You can compare up to 5 items simultaneously for the most effective results."
        }
      ]
    },
    {
      category: "Account & Billing",
      questions: [
        {
          q: "Is BestChoice free to use?",
          a: "Yes, BestChoice offers a free tier with basic comparison features. Premium features are available with a subscription."
        },
        {
          q: "How do I manage my account settings?",
          a: "Click on your profile picture in the top-right corner and select 'Settings' to manage your account preferences."
        }
      ]
    },
    {
      category: "Features & Tools",
      questions: [
        {
          q: "How does the image recognition work?",
          a: "Our AI analyzes uploaded images to extract key features and specifications automatically. This works best with clear, well-lit product photos."
        },
        {
          q: "Can I save my comparisons?",
          a: "Yes, all comparisons are automatically saved to your history. You can access them anytime from your dashboard."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>

          {/* Search Bar */}
          <div className="relative mb-12">
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <a href="#getting-started" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">Getting Started</h3>
              <p className="text-sm text-gray-500">New to BestChoice? Start here</p>
            </a>
            <a href="#account" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">Account Help</h3>
              <p className="text-sm text-gray-500">Manage your account</p>
            </a>
            <a href="#contact" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">Contact Support</h3>
              <p className="text-sm text-gray-500">Get personalized help</p>
            </a>
          </div>

          {/* FAQs by Category */}
          {faqs.map((category, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" id={category.category.toLowerCase().replace(/\s+/g, '-')}>
                {category.category}
              </h2>
              <div className="space-y-6">
                {category.questions.map((item, qIndex) => (
                  <div key={qIndex} className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.q}</h3>
                    <p className="text-gray-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Support */}
          <div className="bg-blue-50 rounded-lg p-6 mt-12">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">Still need help?</h2>
            <p className="text-blue-700 mb-4">
              Our support team is available to assist you with any questions or concerns.
            </p>
            <Button asChild>
              <Link href="#contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}