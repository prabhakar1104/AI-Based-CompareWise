"use client";
import { db } from "@/utils/db";
import { Newsletter } from "@/utils/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
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

const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitted: false, error: null });

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Please fill out all fields");
      }

      // Insert into database using Newsletter schema
      await db.insert(Newsletter).values({
        newName: formData.name,
        newEmail: formData.email,
        newMessage: formData.message,
        // createdAt: new Date().toISOString()
      });

      // Update UI state on success
      setFormStatus({ submitted: true, error: null });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setFormStatus({
        submitted: false,
        error: "Failed to send message. Please try again."
      });
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Contact Us</h2>
        <p className="mt-4 text-lg text-gray-500">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>
      <div className="mt-12 max-w-3xl mx-auto">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your message..."
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full py-2"
                disabled={formStatus.submitted}
              >
                {formStatus.submitted ? "Message Sent!" : "Send Message"}
              </Button>

              {formStatus.error && (
                <p className="mt-2 text-sm text-red-600">{formStatus.error}</p>
              )}

              {formStatus.submitted && (
                <p className="mt-2 text-sm text-green-600">
                  Thanks for your message! We'll get back to you soon.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3 text-base text-gray-500">
            <p>support@comparewise.com</p>
            <p className="mt-1">We'll respond within 24 hours</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3 text-base text-gray-500">
            <p>+1 (555) 123-4567</p>
            <p className="mt-1">Mon-Fri 9am-5pm EST</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3 text-base text-gray-500">
            <p>123 Comparison Ave</p>
            <p className="mt-1">Jalandhar,144803</p>
          </div>
        </div>
      </div>
    </div>
  );
}
