"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function Terms() {
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
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Service Usage</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 13 years old to use this service</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>Your use of the service must comply with all applicable laws</li>
              <li>You agree not to misuse or attempt to disrupt our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. User Content</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You retain ownership of content you upload</li>
              <li>You grant us license to use uploaded content for comparison purposes</li>
              <li>You must not upload content that violates any laws or rights</li>
              <li>We may remove content that violates our terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Service Limitations</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We provide comparisons as guidance only</li>
              <li>We don't guarantee accuracy of AI-generated comparisons</li>
              <li>Service availability may vary and maintenance may occur</li>
              <li>We reserve the right to modify or discontinue features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
            <p>
              All content and functionality on BestChoice, including but not limited to text, graphics, logos, and software, is our property or our licensors' property and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without any warranties. We do not guarantee that the service will be error-free or uninterrupted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p>
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}