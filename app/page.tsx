"use client";
import Link from 'next/link';
import { useRef } from 'react';

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f7f8f4] font-sans flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between max-w-6xl mx-auto w-full py-6 px-4 sm:py-8">
        <div className="flex items-center gap-2">
          <div className="bg-[#1a7f37] rounded-lg w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
            <span className="text-white text-xl sm:text-2xl font-bold">t</span>
          </div>
          <span className="text-[#1a7f37] text-xl sm:text-2xl font-bold">threadfarm</span>
        </div>
        <nav className="flex items-center gap-6 sm:gap-8 text-base sm:text-lg">
          <button onClick={scrollToFeatures} className="text-black/70 hover:text-black transition-colors duration-200 bg-transparent border-none outline-none cursor-pointer">Product</button>
          <button onClick={scrollToPlans} className="text-black/70 hover:text-black transition-colors duration-200 bg-transparent border-none outline-none cursor-pointer">Pricing</button>
          <Link href="/login" className="font-semibold text-black hover:text-[#1a7f37] transition-colors duration-200">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-12 sm:py-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-black mb-6 leading-[1.1] tracking-tight">
          From content to<br />threads in seconds
        </h1>
        <p className="text-lg sm:text-xl text-center text-black/70 mb-10 max-w-2xl leading-relaxed">
          It's like having your own personal social media copywriter but way cheaper
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/login">
            <button className="w-full sm:w-auto bg-[#1a7f37] text-white font-semibold px-8 py-3.5 rounded-full shadow-sm hover:bg-[#17692e] transition-colors duration-200 text-base sm:text-lg">
              Start Now
            </button>
          </Link>
          <button className="w-full sm:w-auto bg-white text-[#1a7f37] font-semibold px-8 py-3.5 rounded-full shadow-sm border border-[#e0e0e0] hover:bg-[#f2f2f2] transition-colors duration-200 text-base sm:text-lg">
            Demo
          </button>
        </div>
      </main>

      {/* Example Threads Section */}
      <section className="flex flex-col items-center justify-center w-full mt-2 mb-16">
        <div className="flex flex-row items-end justify-center gap-8 sm:gap-16">
          <img src="/tweet1.png" className="w-40 sm:w-56 md:w-64 shadow-lg rotate-[-8deg]" />
          <img src="/tweet2.png" className="w-40 sm:w-56 md:w-64 shadow-lg rotate-[4deg] z-10" />
          <img src="/tweet3.png" className="w-40 sm:w-56 md:w-64 shadow-lg rotate-[10deg]" />
        </div>
      </section>

      {/* Alternatives are expensive Section */}
      <section className="flex flex-col items-center justify-center w-full py-16 mb-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-10">Alternatives are expensive.</h2>
        <img src="/pros and cons.png" className="w-full max-w-4xl scale-110" />
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="flex flex-col items-center justify-center w-full py-16 mb-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-10">Features</h2>
        <img src="/features.png" className="w-full max-w-4xl scale-125" />
      </section>

      {/* Choose your plan Section */}
      <section ref={plansRef} className="flex flex-col items-center justify-center w-full py-16 mb-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-10">Choose your plan</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
          {/* Starter Plan */}
          <div className="relative flex flex-col items-center bg-transparent">
            <img src="/start.png" className="w-72 md:w-80 mb-6" />
            <button className="absolute left-1/2 -translate-x-1/2 bottom-20 px-8 py-3 rounded-full border-2 border-[#1a7f37] text-[#1a7f37] font-semibold bg-white transition-colors duration-200 hover:bg-[#1a7f37] hover:text-white text-lg shadow-sm">
              Buy Now
            </button>
          </div>
          {/* Growth Plan */}
          <div className="relative flex flex-col items-center bg-transparent">
            <img src="/growth.png" className="w-72 md:w-80 mb-6" />
            <button className="absolute left-1/2 -translate-x-1/2 bottom-20 px-8 py-3 rounded-full border-2 border-[#1a7f37] text-[#1a7f37] font-semibold bg-white transition-colors duration-200 hover:bg-[#1a7f37] hover:text-white text-lg shadow-sm">
              Buy Now
            </button>
          </div>
          {/* Scale Plan */}
          <div className="relative flex flex-col items-center bg-transparent">
            <img src="/scale.png" className="w-72 md:w-80 mb-6" />
            <button className="absolute left-1/2 -translate-x-1/2 bottom-20 px-8 py-3 rounded-full border-2 border-[#1a7f37] text-[#1a7f37] font-semibold bg-white transition-colors duration-200 hover:bg-[#1a7f37] hover:text-white text-lg shadow-sm">
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-transparent border-t border-[#e0e0e0] py-12 flex flex-col items-center justify-center mt-auto">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-4 gap-8 md:gap-0">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <img src="/threadfarm logo.png" alt="Threadfarm Logo" className="w-14 h-14 mb-4" />
          </div>
          {/* Navigation Columns */}
          <div className="flex flex-row gap-16 md:gap-24">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-semibold mb-2 text-black">Product</span>
              <span className="text-black/70 mb-1">Features</span>
              <span className="text-black/70 mb-1">Pricing</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-semibold mb-2 text-black">Company</span>
              <span className="text-black/70 mb-1">About</span>
              <span className="text-black/70 mb-1">Contact</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-semibold mb-2 text-black">Legal</span>
              <span className="text-black/70 mb-1">Privacy Policy</span>
              <span className="text-black/70 mb-1">Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-10">
          <span className="text-black/60 text-sm">© ThreadFarm. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
