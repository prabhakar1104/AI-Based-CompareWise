"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Account information (email, name) when you register</li>
              <li>Comparison data and preferences</li>
              <li>Usage information and interaction with our services</li>
              <li>Device and browser information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and improve our comparison services</li>
              <li>To personalize your experience</li>
              <li>To communicate with you about our services</li>
              <li>To ensure security and prevent fraud</li>
              <li>To analyze and improve our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. Your comparisons and personal information are stored securely in our database and are only accessible to authorized personnel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            <p>
              We use trusted third-party services for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Authentication (Clerk)</li>
              <li>Database hosting</li>
              <li>Analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}