"use client"
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Careers() {
  const positions = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Looking for an experienced developer to help build and scale our comparison platform."
    },
    {
      id: 2,
      title: "AI/ML Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Join us in developing cutting-edge AI solutions for product comparisons."
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      description: "Lead the development and strategy of our comparison tools."
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Careers at BestChoice</h1>
          <p className="text-xl text-gray-600 mb-8">
            Join us in revolutionizing how people make decisions. We're always looking for 
            talented individuals to help us build the future of comparison technology.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Open Positions</h2>
            <div className="space-y-6">
              {positions.map((position) => (
                <div key={position.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {position.title}
                      </h3>
                      <div className="flex gap-4 mt-2">
                        <span className="text-sm text-gray-500">{position.department}</span>
                        <span className="text-sm text-gray-500">{position.location}</span>
                        <span className="text-sm text-gray-500">{position.type}</span>
                      </div>
                    </div>
                    <Button>Apply Now</Button>
                  </div>
                  <p className="text-gray-600">{position.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Join Us?</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Remote-First Culture</h3>
                <p className="text-gray-600">Work from anywhere in the world with our distributed team.</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Competitive Benefits</h3>
                <p className="text-gray-600">Comprehensive health coverage and equity packages.</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Learning & Development</h3>
                <p className="text-gray-600">Continuous learning opportunities and growth support.</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Impact</h3>
                <p className="text-gray-600">Help millions make better decisions every day.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}