import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Users, 
  BookOpen,
  MessageSquare,
  Loader2
} from "lucide-react";

export default function Index() {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, isLoading, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading HUMSJ Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Simple header */}
      <header className="relative z-50 p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center text-green-400">
            HUMSJ IT Sector
          </h1>
          <p className="text-center text-slate-300 mt-2">
            Haramaya University Muslim Student Jama'a
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Islamic Community Platform
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A comprehensive digital platform for the Muslim student community at Haramaya University, 
            featuring prayer times, Quran study, community management, and spiritual growth tools.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-6 mb-16">
          {user ? (
            <div className="text-center">
              <p className="text-lg mb-4">Welcome back, {user.email}!</p>
              <Button 
                onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 text-lg"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-green-400 mb-4">
              <Users className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Member Management</h3>
            <p className="text-slate-300">
              Complete member lifecycle management with role-based permissions and detailed profiles.
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-blue-400 mb-4">
              <BookOpen className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Islamic Education</h3>
            <p className="text-slate-300">
              Quran study, Hadith collections, prayer times, and comprehensive Islamic learning resources.
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-purple-400 mb-4">
              <MessageSquare className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Features</h3>
            <p className="text-slate-300">
              Discussion forums, event management, announcements, and community engagement tools.
            </p>
          </div>
        </div>

        {/* Quick access links */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-semibold mb-8">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => navigate("/prayer-times")}
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
            >
              Prayer Times
            </Button>
            <Button 
              onClick={() => navigate("/quran-audio")}
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
            >
              Quran Audio
            </Button>
            <Button 
              onClick={() => navigate("/dhikr-counter")}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            >
              Digital Tasbih
            </Button>
            <Button 
              onClick={() => navigate("/halal-marketplace")}
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white"
            >
              Marketplace
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-400">
          <p>&copy; 2024 HUMSJ IT Sector. All rights reserved.</p>
          <p className="mt-2">Built with React, TypeScript, and Supabase</p>
        </footer>
      </main>
    </div>
  );
}