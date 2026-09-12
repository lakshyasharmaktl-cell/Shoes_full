import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiPlay, FiStar, FiZap, FiShoppingBag, FiShield, FiTrendingUp } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { api } from "../api/apiClient";
import ProductCard from "../Components/ProductCard";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        setFeaturedProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const heroSlides = [
    {
      title: "Pure White Aesthetics. Engineered For Motion.",
      subtitle: "THE VELOCITY 01 COLLECTION",
      description: "Handcrafted ultra-lightweight foam with breathable aerodynamic knit for effortless daily performance.",
      tag: "NEW DROP • WHITE EDITION",
      buttonText: "Explore Collection",
      link: "/shop?category=Running",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Minimalist Luxury. Unrivaled Daily Comfort.",
      subtitle: "HERITAGE MONOCHROME SERIES",
      description: "Supple Italian leather sneakers in pure porcelain white. The pinnacle of understated sophistication.",
      tag: "SIGNATURE CASUALS",
      buttonText: "Shop Casuals",
      link: "/shop?category=Casual",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Explosive Energy. High Performance Agility.",
      subtitle: "PRO PERFORMANCE SPORT",
      description: "Designed for court dominance and track supremacy with adaptive responsive carbon-plate cushioning.",
      tag: "HIGH PERFORMANCE",
      buttonText: "Discover Sports",
      link: "/shop?category=Sports",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const categories = [
    {
      name: "Running",
      desc: "Ultra-cushioned speed editions",
      img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
      query: "Running",
    },
    {
      name: "Casual Sneakers",
      desc: "Timeless street silhouettes",
      img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
      query: "Casual",
    },
    {
      name: "Performance Sports",
      desc: "Dynamic turf & court grip",
      img: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=600&q=80",
      query: "Sports",
    },
    {
      name: "Formal Leather",
      desc: "Refined sartorial elegance",
      img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80",
      query: "Formal",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SWIPER CAROUSEL */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100/80 bg-white"
        >
          {heroSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative min-h-[520px] md:min-h-[580px] flex items-center bg-gradient-to-r from-slate-50 via-white to-slate-100 p-8 sm:p-12 md:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10">
                  {/* Left Text */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest italic shadow-sm">
                      <FiZap className="w-3 h-3 text-amber-400" />
                      <span>{slide.tag}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs md:text-sm font-bold tracking-[0.25em] text-slate-400 uppercase italic">
                        {slide.subtitle}
                      </p>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-serif-italic text-slate-900 tracking-tight leading-[1.08] italic">
                        {slide.title}
                      </h1>
                    </div>

                    <p className="text-sm md:text-base text-slate-600 max-w-lg italic font-normal leading-relaxed">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        to={slide.link}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs md:text-sm font-bold hover:bg-slate-800 transition shadow-xl flex items-center gap-2.5 italic tracking-wider uppercase group"
                      >
                        <span>{slide.buttonText}</span>
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </Link>

                      <Link
                        to="/shop"
                        className="px-6 py-4 bg-white border border-slate-200 hover:border-slate-800 text-slate-900 rounded-2xl text-xs md:text-sm font-bold transition italic shadow-xs"
                      >
                        View All Drops
                      </Link>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="lg:col-span-5 relative flex items-center justify-center">
                    <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-white to-slate-100 p-6 flex items-center justify-center border border-white shadow-xl">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-contain transform hover:scale-105 transition duration-500"
                      />
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-800 italic uppercase">
                          ★ 100% White Pure Edition
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. CINEMATIC VIDEO & ANIMATION SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-2xl">
          {/* Ambient Video Player */}
          <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen scale-105"
            >
              {/* High-quality sneaker motion preview loop */}
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-shoes-of-a-runner-running-outdoors-42861-large.mp4"
                type="video/mp4"
              />
            </video>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950/40" />

            {/* Video Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 z-10">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-white italic">
                  <FiPlay className="w-3 h-3 fill-current text-amber-300" />
                  <span>Cinematic Motion Engineering</span>
                </div>

                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif-italic text-white italic tracking-tight leading-tight">
                  "Every Curve Precision-Molded for Pure Velocity."
                </h2>

                <p className="text-xs md:text-sm text-slate-300 italic max-w-lg leading-relaxed font-light">
                  Experience seamless balance, dynamic arch suspension, and responsive cellular foam formulated specifically for the modern stride.
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    to="/shop"
                    className="px-6 py-3 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-lg flex items-center gap-2 italic tracking-wider uppercase"
                  >
                    <span>Shop Active Editions</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SHOWCASE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
              Curated Classifications
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif-italic text-slate-900 italic mt-1">
              Shop by Footwear Silhouette
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-slate-900 hover:text-slate-600 transition flex items-center gap-1 italic"
          >
            <span>Browse Full Catalog</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${cat.query}`}
              className="group relative rounded-3xl overflow-hidden white-card white-card-hover p-4 flex flex-col justify-between"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-4">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-italic font-bold text-lg text-slate-900 italic">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 italic">{cat.desc}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition flex items-center justify-center text-slate-700">
                  <FiArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SWIPER CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold uppercase tracking-wider italic mb-2">
              <FiTrendingUp className="w-3 h-3 text-slate-900" />
              <span>Trending Drops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif-italic text-slate-900 italic">
              Exclusive Arrivals & Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-slate-900 hover:text-slate-600 transition flex items-center gap-1 italic"
          >
            <span>See all {featuredProducts.length} releases</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="white-card rounded-3xl p-4 animate-pulse space-y-4">
                <div className="w-full aspect-square bg-slate-100 rounded-2xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="white-card rounded-3xl p-12 text-center space-y-4">
            <h3 className="font-serif-italic text-xl text-slate-800 italic font-bold">
              New Collection Incoming
            </h3>
            <p className="text-xs text-slate-500 italic max-w-md mx-auto">
              Our latest white edition footwear catalog is currently being prepared. Check back shortly or view the admin portal.
            </p>
          </div>
        )}
      </section>

      {/* 5. BRAND PROMISE & WHITE AESTHETICS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="white-card rounded-3xl p-8 md:p-14 bg-gradient-to-b from-white via-slate-50/60 to-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="space-y-2 p-4">
              <span className="text-3xl md:text-4xl font-black font-serif-italic text-slate-900 italic">
                300+
              </span>
              <h4 className="font-bold text-sm text-slate-900 italic">Master Mold Prototypes</h4>
              <p className="text-xs text-slate-500 italic">Refining lightweight anatomical fit across every size</p>
            </div>

            <div className="space-y-2 p-4">
              <span className="text-3xl md:text-4xl font-black font-serif-italic text-slate-900 italic">
                100%
              </span>
              <h4 className="font-bold text-sm text-slate-900 italic">Pure Porcelain White</h4>
              <p className="text-xs text-slate-500 italic">Hydrophobic coated finish to resist dust and moisture</p>
            </div>

            <div className="space-y-2 p-4">
              <span className="text-3xl md:text-4xl font-black font-serif-italic text-slate-900 italic">
                24 / 7
              </span>
              <h4 className="font-bold text-sm text-slate-900 italic">Concierge Support</h4>
              <p className="text-xs text-slate-500 italic">Direct assistance on sizing, orders & tracking</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
