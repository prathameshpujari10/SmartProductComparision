"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage(): JSX.Element {
  const contactInfoItems = [
    { icon: Phone, title: "Phone", content: "+1 (555) 123-4567" },
    { icon: Mail, title: "Email", content: "support@smartproduct.com" },
    { icon: MapPin, title: "Address", content: "123 Tech Street, San Francisco, CA 94105" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-blue-300">Contact Us</h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </section>

        <div className="space-y-12">
          {/* Contact Form */}
          <section>
            <div className="max-w-xl mx-auto">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-blue-300 text-center">Send us a message</h2>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        placeholder="Your message"
                        className="bg-gray-700 border-gray-600 text-white w-full p-2 rounded-md"
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-blue-300 text-center">Contact Information</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              {contactInfoItems.map((item, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 flex items-start space-x-4">
                    {React.createElement(item.icon, { className: "text-blue-300 h-6 w-6 mt-1" })}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="text-gray-400">{item.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Map Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">Find Us</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977638620157!2d-122.39997168441416!3d37.78779907975641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807abad77a7d%3A0xd6c296338408a571!2s123%20Tech%20St%2C%20San%20Francisco%2C%20CA%2094105%2C%20USA!5e0!3m2!1sen!2s!4v1625120283670!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="SmartProduct Office Location"
            ></iframe>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-blue-400">SmartProduct</h2>
              <p className="text-gray-400">Making product comparisons easy</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Terms of Service
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Contact Us
              </Button>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            <p>&copy; 2025 SmartProduct. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
