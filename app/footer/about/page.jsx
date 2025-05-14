"use client"
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function About() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About BestChoice</h1>
          
          <section className="prose lg:prose-lg">
            <h2>Our Mission</h2>
            <p>
              At BestChoice, we're on a mission to make decision-making simpler and smarter. 
              By combining cutting-edge AI technology with user-friendly design, we help people 
              make informed choices about products, services, and options that matter to them.
            </p>

            <h2>Our Story</h2>
            <p>
              Founded in 2024, BestChoice emerged from a simple observation: people spend too 
              much time researching and comparing options, often feeling overwhelmed by information. 
              We built an AI-powered platform that streamlines this process, making comparisons 
              quick, easy, and accurate.
            </p>

            <h2>Our Technology</h2>
            <p>
              Our platform leverages advanced AI algorithms and natural language processing to 
              analyze and compare options. Whether through text input or image recognition, 
              our technology extracts key features and presents them in an easy-to-understand format.
            </p>

            <h2>Our Values</h2>
            <ul>
              <li>Simplicity in Design</li>
              <li>Accuracy in Analysis</li>
              <li>Transparency in Results</li>
              <li>Privacy by Default</li>
              <li>Continuous Innovation</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}