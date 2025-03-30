'use client';

import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import Link from "next/link";
import Navbar from "./components/layout/Navbar";
import "./globals.css";

export default function Landing() {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const animateBlobs = () => {
      const blobs = document.querySelectorAll('.orange-blob');
      blobs.forEach((blob, index) => {
        const speed = 0.2 + (index * 0.05);
        const yMovement = Math.sin(Date.now() * 0.001 * speed) * 10;
        const xMovement = Math.cos(Date.now() * 0.001 * speed) * 10;
        
        if (blob instanceof HTMLElement) {
          blob.style.transform = `translate(calc(-50% + ${xMovement}px), calc(-50% + ${yMovement}px))`;
        }
      });
      
      requestAnimationFrame(animateBlobs);
    };
    
    animateBlobs();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-[#0a0a0e] min-h-screen text-white relative overflow-hidden @font-face">
      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="orange-blob orange-blob-1 absolute w-[800px] h-[400px] top-[30%] left-1/2"
          style={{
            borderRadius: '100%',
            background: 'radial-gradient(circle, rgba(134, 239, 172, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            opacity: 0.6,
            animation: 'pulse 8s ease-in-out infinite',
          }}>
        </div>
        <div className="orange-blob orange-blob-2 absolute w-[600px] h-[300px] top-[50%] left-[40%]"
          style={{
            borderRadius: '100%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
            opacity: 0.6,
            animation: 'pulse 8s ease-in-out infinite 1s',
          }}>
        </div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 pt-32 pb-16 text-center relative z-10">
        {/* New Feature Label */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm mb-12 animate-fade-in-up">
          <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          <span className="hidden md:inline text-[11px] font-funnel-medium text-white/80">We're live! MITE - Sentia 2025 | Your Premier Digital Gallery Solution</span>
          <span className="md:hidden text-[11px] font-funnel-medium text-white/80">We're live! MITE - Sentia 2025</span>
          <span className="ml-2 px-1.5 py-0.5 bg-blue-500/20 rounded-full text-[10px] font-funnel-medium text-blue-300">Beta</span>
        </div>
        
        {/* Heading */}
        <div className="space-y-4 mb-3 animate-fade-in-up [animation-delay:200ms]">
          <h1 className="@font-face text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4.25rem] max-w-[1000px] mx-auto leading-[1.1] tracking-[-0.03em] bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/70">
            Unfolding moments,
            <br />
            preserving memories forever
          </h1>
        </div>
        
        {/* Subtext */}
        <p className="font-funnel-regular text-base sm:text-lg text-white/60 max-w-[720px] mx-auto mb-12 leading-relaxed animate-fade-in-up [animation-delay:400ms]">
          Experience a platform where every captured moment becomes a lasting memory. Whether it's a snapshot of joy, laughter, or celebration, we make it easy to upload, share, and revisit your most cherished experiences—all in one place.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 animate-fade-in-up [animation-delay:600ms]">
          <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-funnel-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20">
            <Link href="/login" className="px-8 py-4 text-base">
              Start Creating Now
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto bg-black/30 text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300">
            <Link href="/get-started" className="px-8 py-4 text-base">
              Get Started
            </Link>
          </Button>
        </div>
      </main>

      {/* Bottom Image Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 relative z-10 animate-fade-in-up [animation-delay:800ms]">
        <div className="w-full rounded-2xl bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-teal-700/50 h-96 relative overflow-hidden backdrop-blur-sm border border-white/5">
          {/* Stars/sparkle effects */}
          <div className="absolute top-10 left-10 h-2 w-2 bg-white rounded-full opacity-70 animate-twinkle"></div>
          <div className="absolute top-32 left-32 h-1 w-1 bg-white rounded-full opacity-50 animate-twinkle [animation-delay:1s]"></div>
          <div className="absolute top-20 right-20 h-1 w-1 bg-white rounded-full opacity-40 animate-twinkle [animation-delay:2s]"></div>
          <div className="absolute top-40 right-40 h-2 w-2 bg-white rounded-full opacity-60 animate-twinkle [animation-delay:1.5s]"></div>
          
          {/* Gallery Demo placeholder */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-3/4 max-w-md h-40 bg-black/40 rounded-md border border-white/10 shadow-lg backdrop-blur-sm">
            <div className="h-6 w-full bg-black/60 rounded-t-md border-b border-white/10 flex items-center px-2">
              <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          </div>
          
          {/* Circular lines in the corner */}
          <div className="absolute -bottom-20 -right-20 h-80 w-80 border border-white/5 rounded-full animate-spin-slow"></div>
          <div className="absolute -bottom-10 -right-10 h-60 w-60 border border-white/5 rounded-full animate-spin-slow [animation-delay:2s]"></div>
          <div className="absolute bottom-0 right-0 h-40 w-40 border border-white/5 rounded-full animate-spin-slow [animation-delay:4s]"></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
