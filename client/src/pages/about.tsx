import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Calendar, Users, Heart, Target, Dumbbell } from "lucide-react";

import headshotPath from "@assets/678ab404c229cf3cdfa5e86c_download-2024-08-16T133456.440-1024x1024-p-800_1749491757995.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-8 border-white shadow-xl">
            <img 
              src={headshotPath} 
              alt="Michael Baker" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Michael Baker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Dedicated & authentic health and wellness practitioner with over 30 years of experience
          </p>
        </div>

        {/* Bio Section */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                Hello, I'm Michael Baker. I am a 50-year-old strength trainer, certified personal trainer, running coach, 
                health coach, and yoga teacher. I'm also a former yoga studio owner and a digital professional with over 
                30 years of experience.
              </p>
              <p className="mb-4">
                I began <span className="font-semibold italic text-primary">Get Up Earlier</span> because getting up 
                earlier was step one in transforming my routine and overall well-being, especially after spending years 
                sitting at a computer. The name represents more than just waking up early—it's about taking control of 
                your day, your health, and your life.
              </p>
              <p className="mb-4">
                My approach combines practical strength training, clean eating principles, and accountability coaching 
                to help bridge the gap from inactivity and poor diet to strength and healthy habits. I believe in 
                sustainable, realistic changes that fit into real life, not extreme measures that can't be maintained.
              </p>
              <p>
                Through Get Up Earlier, I've helped hundreds of people transform their relationship with fitness and 
                nutrition, creating lasting change that goes far beyond the gym or kitchen.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Credentials */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Award className="w-6 h-6 text-primary mr-2" />
              Certifications & Experience
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Certifications</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2">Certified</Badge>
                    Personal Trainer
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2">Certified</Badge>
                    Running Coach
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2">Certified</Badge>
                    Health Coach
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2">Certified</Badge>
                    Yoga Teacher
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Experience</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <Calendar className="w-4 h-4 text-primary mr-2" />
                    30+ years in fitness and wellness
                  </li>
                  <li className="flex items-center">
                    <Dumbbell className="w-4 h-4 text-primary mr-2" />
                    Former yoga studio owner
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-primary mr-2" />
                    Digital professional background
                  </li>
                  <li className="flex items-center">
                    <Target className="w-4 h-4 text-primary mr-2" />
                    Strength training specialist
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Philosophy */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Heart className="w-6 h-6 text-primary mr-2" />
              My Philosophy
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Strength Training</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Building functional strength that enhances daily life and long-term health.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Clean Eating</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simple, nutritious meals that fuel your body and support your goals.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Accountability</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Consistent support and guidance to help you stay on track and achieve lasting results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Let's work together to bridge the gap from where you are to where you want to be.
          </p>
          <Link href="/coaching">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Explore Coaching Options
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}