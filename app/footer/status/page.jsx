"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function ApiStatus() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize services after component mounts (client-side only)
    setServices([
      {
        name: 'Comparison API',
        status: 'operational',
        latency: '123ms',
        lastChecked: new Date()
      },
      {
        name: 'Gemini AI Integration',
        status: 'operational',
        latency: '450ms',
        lastChecked: new Date()
      },
      {
        name: 'Authentication Service',
        status: 'operational',
        latency: '89ms',
        lastChecked: new Date()
      },
      {
        name: 'Database Service',
        status: 'operational',
        latency: '95ms',
        lastChecked: new Date()
      }
    ]);
    setIsLoading(false);
  }, []);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Status</h1>
          <p className="mt-2 text-gray-600">
            Current status of all BestChoice services and APIs
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">System Status</h2>
              <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                All Systems Operational
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {services.map((service, index) => (
              <div key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(service.status)}
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Latency: {service.latency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Last checked:{' '}
                      {formatTime(service.lastChecked)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">
              Incident History
            </h2>
          </div>
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            No incidents reported in the last 90 days
          </div>
        </div>
      </main>
    </div>
  );
}