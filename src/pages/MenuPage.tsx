import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Check, ShoppingBag, Star, Utensils, Sparkles, ChevronRight, 
  Phone, ShieldCheck, Flame, Award, Quote, Clock, MapPin, Bike, ArrowRight, Heart
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { MenuItem } from '../types';
import { DatclamLogo } from '../components/DatclamLogo';

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Classic Chicken Shawarma',
    description: 'Juicy tender grilled chicken breast wrapped in warm pita with creamy garlic sauce and fresh crunchy cabbage.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80',
    category: 'Shawarma Wraps',
    isAvailable: true
  },
  {
    id: 'm2',
    name: 'Double Beef & Sausage Monster Wrap',
    description: 'Double grilled spiced beef, spicy sausage link, melted cheddar cheese, house special chili mayo sauce.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    category: 'Shawarma Wraps',
    isAvailable: true
  },
  {
    id: 'm3',
    name: 'Mixed Deluxe (Chicken + Beef + Cheese)',
    description: 'The ultimate combo wrap! Slow-roasted chicken & beef, extra mozzarella cheese blend, sweet corn, and garlic cream.',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    category: 'Shawarma Wraps',
    isAvailable: true
  },
  {
    id: 'm4',
    name: 'Crispy French Fries (Large)',
    description: 'Golden crispy crinkle-cut fries seasoned with garlic paprika salt.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    category: 'Sides',
    isAvailable: true
  },
  {
    id: 'm5',
    name: 'Chilled Datclam Special Lemonade',
    description: 'Freshly squeezed lemon, mint leaves, honey, and sparkling mineral water.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages',
    isAvailable: true
  }
];


const REVIEWS = [
  {
    quote: "Datclam is easily the best shawarma spot on the mainland. The chicken wrap is perfectly spiced, the house-made garlic sauce is rich, and my delivery arrived in under 25 minutes!",
    author: "Tobi A.",
    source: "Verified Delivery"
  },
  {
    quote: "I always stop by the supermarket just for the Double Beef Monster wrap! Generous portions, fresh crisp veggies, and that 6-digit pickup code gives me peace of mind when sending my dispatch rider.",
    author: "Seyi O.",
    source: "In-Store Shopper"
  },
  {
    quote: "Consistently top quality! Freshly baked pita, tender meats, and the chilled lemonade is exactly what you need for this Lagos heat. My absolute number one shawarma hub!",
    author: "Chinedu E.",
    source: "Verified Customer"
  }
];

const HERO_SLIDES = [
  {
    url: '/shawarma_png_1.png',
    alt: 'Garlic Mayo Splash & Flying Parsley Shawarma Cutout',
    title: 'Signature Mayo Splash'
  },
  {
    url: '/shawarma_png_2.png',
    alt: 'Double Melted Cheese Chicken Wrap Cutout',
    title: 'Melted Cheese Delight'
  },
  {
    url: '/shawarma_png_3.png',
    alt: 'Spiced Grilled Chicken Duo Cutout',
    title: 'Spiced Chicken Duo'
  },
  {
    url: '/shawarma_png_4.png',
    alt: 'Fresh Tomato & Beef Supreme Wrap Cutout',
    title: 'Beef Supreme Wrap'
  },
  {
    url: '/shawarma_png_5.png',
    alt: 'Double Stacked Cheese Mayo Shawarma Cutout',
    title: 'Double Stack Monster'
  }
];

export const MenuPage: React.FC<{ initialShowMenu?: boolean }> = ({ initialShowMenu = false }) => {
  const { cart } = useStore();
  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (initialShowMenu) {
      setTimeout(() => {
        scrollToMenu();
      }, 100);
    }
  }, [initialShowMenu]);

  const handleAddToCart = (item: MenuItem) => {
    cart.addToCart(item);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const totalCartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const filteredItems = selectedCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((i) => i.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-stone-900 space-y-16 pb-20 overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. QISSA-STYLE HERO SECTION WITH MOTION VIDEO BACKGROUND */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#FFFBF5] border-b-4 border-datclam-green py-12 lg:py-20">
        
        {/* Ambient Motion Video Background Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/poster_shawarma_food.png"
            ref={(el) => {
              if (el) {
                el.muted = true;
                el.play().catch(() => {});
              }
            }}
            className="w-full h-full object-cover filter brightness-105 saturate-125 scale-105"
          >
            <source src="/shawarma_roll.mp4" type="video/mp4" />
            <source src="/shawarma_recipe.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFBF5]/90 via-[#FFFBF5]/75 to-[#FFFBF5]/50" />
        </div>

        {/* Soft Ambient Background Blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column (7 cols): Eyebrow, Headline, Lede, Actions & Badges */}
            <div className="lg:col-span-7 text-left space-y-6 sm:space-y-8 flex flex-col items-start">
              
              {/* Eyebrow Pill Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg shadow-amber-200/50 border border-amber-300/60">
                <span className="w-2.5 h-2.5 rounded-full bg-datclam-red animate-ping" />
                <p className="text-xs sm:text-sm font-black tracking-widest uppercase">
                  <span className="text-datclam-red">A Tale of Flavor & Spice</span> • 
                  <span className="text-amber-700"> Freshy • Yummy • Tasty</span>
                </p>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-2xl">
                <span className="text-datclam-green bg-gradient-to-r from-datclam-green via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  Shawarma{" "}
                </span>
                <span className="text-datclam-red bg-gradient-to-r from-datclam-red via-red-600 to-amber-600 bg-clip-text text-transparent">
                  Hub
                </span>
              </h1>

              {/* Lede Description */}
              <p className="text-base sm:text-lg text-stone-700 font-medium leading-relaxed max-w-xl text-left">
                Celebrating the authentic flavors of slow-roasted meats, house-made garlic sauces, and crisp veggies wrapped in warm pita. Delivered hot in under 30 minutes!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
                <button
                  onClick={scrollToMenu}
                  className="pulsing-order-btn inline-flex items-center gap-3 bg-gradient-to-r from-datclam-red via-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-lg sm:text-xl font-black px-9 py-4 rounded-full shadow-xl shadow-red-500/25 transition-transform hover:scale-105 border-2 border-amber-200 cursor-pointer"
                >
                  <Utensils className="w-6 h-6" />
                  <span>ORDER NOW</span>
                  <ChevronRight className="w-6 h-6" />
                </button>

                <button
                  onClick={scrollToMenu}
                  className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-stone-900 font-black text-base px-7 py-4 rounded-full border-2 border-amber-300 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-5 h-5 text-amber-600" />
                </button>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 pt-4 text-xs sm:text-sm font-bold">
                <span className="flex items-center gap-2 bg-amber-100/90 text-amber-950 px-4 py-2 rounded-full border border-amber-300/70 shadow-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9★ Google Rating
                </span>
                <span className="flex items-center gap-2 bg-emerald-100/90 text-emerald-950 px-4 py-2 rounded-full border border-emerald-300/70 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 6-Digit Security Handshake
                </span>
                <span className="flex items-center gap-2 bg-orange-100/90 text-orange-950 px-4 py-2 rounded-full border border-orange-300/70 shadow-sm">
                  <Phone className="w-4 h-4 text-orange-600" /> 08143616974
                </span>
              </div>

            </div>

            {/* Right Column (5 cols): Floating Transparent Contour Food Item (No Cards, No UI Boxes, No Masking) */}
            <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[450px] lg:h-[500px] flex items-center justify-center p-4">
              
              {/* Soft Ambient Warm Glow behind floating food item */}
              <div className="absolute inset-6 bg-gradient-to-tr from-amber-400/25 via-orange-400/20 to-red-400/15 rounded-full blur-3xl pointer-events-none transform scale-110" />

              {/* Organic Floating Container */}
              <div className="organic-hero-float relative w-full h-full max-w-[440px] max-h-[460px] flex items-center justify-center">
                {HERO_SLIDES.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 z-10' 
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={slide.alt}
                      className="w-full h-full object-contain filter drop-shadow-2xl drop-shadow-[0_25px_35px_rgba(180,83,9,0.3)] transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. THE DATCLAM ADVANTAGE / OUR STORY SECTION */}
      <section id="datclam-advantage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="bg-white rounded-3xl p-8 sm:p-14 shadow-xl border border-amber-200/80 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 relative">
            <img
              src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80"
              alt="Datclam Shawarma Crafting"
              className="rounded-2xl shadow-xl border-4 border-amber-100 object-cover h-80 sm:h-96 w-full"
            />
            <div className="absolute -bottom-4 -right-4 bg-amber-500 text-white p-4 rounded-2xl font-black text-xs shadow-lg uppercase tracking-widest flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-100" /> Premium Quality Guaranteed
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-black uppercase text-amber-700 tracking-widest bg-amber-100/90 px-4 py-1.5 rounded-full border border-amber-300 inline-block">
              THE DATCLAM ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              Fresh from our <span className="text-datclam-green">grocery aisles,</span> straight to your <span className="text-datclam-red">wrap.</span>
            </h2>
            <div className="space-y-4 text-stone-700 font-medium leading-relaxed text-base">
              <p>
                Because we are Datclam Groceries, we never have to compromise on our ingredients. Every morning, our kitchen selects the crispest cabbage, the freshest vegetables, and premium cuts of beef and chicken directly from our own daily supply. We control the quality from the shelf to the grill.
              </p>
              <p>
                We skip the street-corner shortcuts. Crafted in a strictly sanitized professional kitchen, every Datclam Shawarma is packed with generous meat portions, slow-roasted to perfection, and layered heavily with our signature house-made garlic mayo. Better hygiene, better ingredients, and a much heavier wrap.
              </p>
            </div>
            
            <blockquote className="bg-amber-50/90 p-5 rounded-2xl border-l-4 border-datclam-red text-stone-800 italic font-semibold text-sm leading-relaxed shadow-sm">
              <Quote className="w-5 h-5 text-datclam-red inline-block mr-2 -mt-1" />
              "We promise a heavy wrap, sizzling hot meats, and zero compromises on hygiene. Handed over securely using your unique 6-digit verification code."
              <cite className="block not-italic text-xs font-black text-amber-900 mt-2">— The Datclam Promise</cite>
            </blockquote>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
        
        <div className="space-y-2 text-left">
          <h2 className="text-3xl sm:text-4xl font-black text-datclam-red tracking-tight">
            How it works
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-medium">
            Four easy stages from craving to first bite.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Stage 1 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/90 space-y-4 flex flex-col justify-between shadow-md hover:shadow-xl hover:border-datclam-red/50 transition-all">
            <div>
              <div className="w-8 h-8 rounded-full bg-datclam-red text-white flex items-center justify-center font-black text-sm mb-4 shadow-md">
                1
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-2">
                You order
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed font-medium">
                Choose your shawarma, enter your address and pick how to pay. You get a delivery code.
              </p>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/90 space-y-4 flex flex-col justify-between shadow-md hover:shadow-xl hover:border-datclam-red/50 transition-all">
            <div>
              <div className="w-8 h-8 rounded-full bg-datclam-red text-white flex items-center justify-center font-black text-sm mb-4 shadow-md">
                2
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-2">
                We prepare
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed font-medium">
                Our kitchen gets your order instantly and starts grilling.
              </p>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/90 space-y-4 flex flex-col justify-between shadow-md hover:shadow-xl hover:border-datclam-red/50 transition-all">
            <div>
              <div className="w-8 h-8 rounded-full bg-datclam-red text-white flex items-center justify-center font-black text-sm mb-4 shadow-md">
                3
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-2">
                Rider delivers
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed font-medium">
                Follow your rider on the tracking page until they reach you.
              </p>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/90 space-y-4 flex flex-col justify-between shadow-md hover:shadow-xl hover:border-datclam-red/50 transition-all">
            <div>
              <div className="w-8 h-8 rounded-full bg-datclam-red text-white flex items-center justify-center font-black text-sm mb-4 shadow-md">
                4
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-2">
                Show your code
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed font-medium">
                Give the rider your delivery code. Done: Delivered and Paid.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* 4. CONTINUOUS MARQUEE BAND */}
      <div className="bg-gradient-to-r from-amber-600 via-datclam-red to-red-700 text-white py-4 overflow-hidden shadow-lg border-y-2 border-amber-300">
        <div className="animate-marquee flex items-center gap-8 text-sm sm:text-base font-black uppercase tracking-widest">
          <span>Origin</span><span className="text-amber-300">✦</span>
          <span>Spice</span><span className="text-amber-300">✦</span>
          <span>Aroma</span><span className="text-amber-300">✦</span>
          <span>Texture</span><span className="text-amber-300">✦</span>
          <span>Taste</span><span className="text-amber-300">✦</span>
          <span>Craft</span><span className="text-amber-300">✦</span>
          <span>Gathering</span><span className="text-amber-300">✦</span>
          <span>Celebration</span><span className="text-amber-300">✦</span>
          <span>Freshy</span><span className="text-amber-300">✦</span>
          <span>Yummy</span><span className="text-amber-300">✦</span>
          <span>Tasty</span><span className="text-amber-300">✦</span>
          <span>Origin</span><span className="text-amber-300">✦</span>
          <span>Spice</span><span className="text-amber-300">✦</span>
          <span>Aroma</span><span className="text-amber-300">✦</span>
          <span>Texture</span><span className="text-amber-300">✦</span>
          <span>Taste</span><span className="text-amber-300">✦</span>
          <span>Craft</span><span className="text-amber-300">✦</span>
        </div>
      </div>




      {/* 6. THE TALE SO FAR (STATS GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-200/80 space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-amber-700 tracking-widest bg-amber-100 px-4 py-1.5 rounded-full border border-amber-300 inline-block">
              The Tale So Far
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900">
              A story worth <span className="text-datclam-red">telling.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200/80 space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-stone-900 block">4.9★</span>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Google Rating</span>
            </div>
            <div className="bg-red-50/80 p-6 rounded-2xl border border-red-200/80 space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-stone-900 block">500+</span>
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider block">Daily Hot Wraps</span>
            </div>
            <div className="bg-emerald-50/80 p-6 rounded-2xl border border-emerald-200/80 space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-stone-900 block">100%</span>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">Fresh & Sourced</span>
            </div>
            <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-stone-900 block">∞</span>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Delighted Smiles</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GUEST REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-1.5 rounded-full border border-amber-300">
            <div className="flex text-amber-500">★★★★★</div>
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider">LOVED BY OUR IN-STORE SHOPPERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900">
            What <span className="text-datclam-red">Lagosians</span> are saying.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <p className="text-stone-700 text-sm leading-relaxed font-medium italic">
                  "{rev.quote}"
                </p>
              </div>
              <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-stone-900">
                <span>{rev.author}</span>
                <span className="text-amber-700">{rev.source}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TWO WAYS TO TASTE THE TALE (DINE IN / HOME DELIVERY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-amber-700 tracking-widest bg-amber-100 px-4 py-1.5 rounded-full border border-amber-300 inline-block">
            Your Order Awaits
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900">
            Two ways to <span className="text-datclam-red">taste the tale.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Store Pickup */}
          <div className="bg-white p-8 rounded-3xl border-2 border-amber-300 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block">
                Store Pickup
              </span>
              <h3 className="text-2xl font-black text-stone-900">Pickup at Datclam Store</h3>
              <p className="text-stone-600 text-sm font-medium leading-relaxed">
                Order online and pick up at Datclam Supermarket HQ. Instant verification via 6-digit cryptographic security code.
              </p>
            </div>
            <button
              onClick={scrollToMenu}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02]"
            >
              Order Store Pickup &rarr;
            </button>
          </div>

          {/* Card 2: Doorstep Delivery */}
          <div className="bg-white p-8 rounded-3xl border-2 border-datclam-green shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Doorstep Delivery
              </span>
              <h3 className="text-2xl font-black text-stone-900">Fast Home Delivery</h3>
              <p className="text-stone-600 text-sm font-medium leading-relaxed">
                Hot wraps delivered straight to your door in under 30 minutes with live GPS rider tracking.
              </p>
            </div>
            <button
              onClick={scrollToMenu}
              className="w-full bg-datclam-green hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02]"
            >
              Order Doorstep Delivery &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* 9. THE ACTIVE SHAWARMA MENU SECTION */}
      <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 scroll-mt-24">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-lg border border-amber-200/80">
          <div>
            <div className="flex items-center gap-2">
              <DatclamLogo size="sm" variant="raw" />
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Our Shawarma Menu
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium">Select your wraps and side items for instant guest checkout</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Shawarma Wraps', 'Sides', 'Beverages'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all ${
                  selectedCategory === cat
                    ? 'bg-datclam-red text-white shadow-md'
                    : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border-2 border-stone-200 hover:border-datclam-red transition-all shadow-md hover:shadow-2xl flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-datclam-red text-white font-black text-xs px-3 py-1.5 rounded-full shadow uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="absolute bottom-4 right-4 bg-emerald-700 text-white font-black text-xl px-4 py-1.5 rounded-xl shadow-lg border border-white/20">
                  ₦{item.price.toLocaleString()}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xl font-black text-stone-900 mb-2 group-hover:text-datclam-red transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedItems[item.id]
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-gradient-to-r from-datclam-red to-red-700 hover:from-red-700 hover:to-datclam-red text-white shadow-red-600/20 hover:scale-[1.02]'
                  }`}
                >
                  {addedItems[item.id] ? (
                    <>
                      <Check className="w-5 h-5" /> Added to Order!
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" /> Add to Order
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* STICKY CART ACTION BAR */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-white text-stone-900 p-4 rounded-2xl font-black flex items-center justify-between shadow-2xl border-2 border-datclam-green hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-datclam-red text-white flex items-center justify-center font-black">
                {totalCartCount}
              </div>
              <div className="text-left">
                <span className="text-xs uppercase text-amber-700 font-bold block">Cart Subtotal</span>
                <span className="text-lg font-black text-stone-900">₦{cart.getSubtotal().toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-datclam-red to-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md">
              <ShoppingBag className="w-4 h-4" /> Proceed to Checkout &rarr;
            </div>
          </button>
        </div>
      )}

    </div>
  );
};

