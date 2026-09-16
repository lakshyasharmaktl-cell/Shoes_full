import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiSearch, FiX, FiSliders, FiRefreshCw, FiLayers } from "react-icons/fi";
import { api } from "../api/apiClient";
import ProductCard from "../Components/ProductCard";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const categoryParam = searchParams.get("category") || "All";
  const searchParam = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [priceFilterActive, setPriceFilterActive] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = [
    "All",
    "Running",
    "Casual",
    "Sports",
    "Formal",
    "Sneakers",
    "Lifestyle",
    "Training",
  ];

  // Sync with URL params
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchTerm(searchParam);
  }, [categoryParam, searchParam]);

  // Fetch products from backend
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const query = {};
        if (selectedCategory && selectedCategory !== "All") {
          query.category = selectedCategory;
        }
        if (searchTerm.trim()) {
          query.search = searchTerm.trim();
        }
        const data = await api.getProducts(query);
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, searchTerm]);

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter max price only if user adjusted it
    if (priceFilterActive) {
      result = result.filter((p) => {
        const price = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
        return Number(price) <= Number(maxPrice);
      });
    }

    // Filter in-stock only
    if (inStockOnly) {
      result = result.filter((p) => {
        const sizeStock = (p.sizes || []).some((s) => s.stock > 0);
        return sizeStock || p.totalStock > 0;
      });
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const pa = a.discountPrice > 0 ? a.discountPrice : a.price;
        const pb = b.discountPrice > 0 ? b.discountPrice : b.price;
        return pa - pb;
      });
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const pa = a.discountPrice > 0 ? a.discountPrice : a.price;
        const pb = b.discountPrice > 0 ? b.discountPrice : b.price;
        return pb - pa;
      });
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, maxPrice, priceFilterActive, inStockOnly, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set("search", searchTerm.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setMaxPrice(5000);
    setPriceFilterActive(false);
    setInStockOnly(false);
    setSortBy("newest");
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== "All" || searchTerm || priceFilterActive || inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="white-card rounded-3xl p-8 md:p-12 relative overflow-hidden bg-gradient-to-r from-slate-50 via-white to-slate-100">
        <div className="max-w-2xl space-y-3 z-10 relative">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
            Complete Catalog Directory
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif-italic text-slate-900 italic">
            {selectedCategory === "All" ? "All Footwear Editions" : `${selectedCategory} Collection`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 italic font-light leading-relaxed">
            Discover lightweight silhouettes, carbon plate race runners, and minimalist white leather street classics.
          </p>
        </div>
      </div>

      {/* Controls Bar: Search, Filters button & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 white-card rounded-2xl">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search shoes by name, model, style..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
          />
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                const np = new URLSearchParams(searchParams);
                np.delete("search");
                setSearchParams(np);
              }}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 italic"
          >
            <FiFilter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 italic hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white italic"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div className="white-card rounded-3xl p-6 space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FiSliders className="w-4 h-4 text-slate-800" />
                <h3 className="font-bold text-sm text-slate-900 italic font-serif-italic">
                  Filter Catalog
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-rose-600 hover:underline font-semibold italic flex items-center gap-1"
                >
                  <FiRefreshCw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider italic">
                Category
              </label>
              <div className="flex flex-col space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between italic ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-900 uppercase tracking-wider italic">
                  Max Price
                </label>
                <span className="font-black text-slate-900 italic font-serif-italic">
                  ${maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setPriceFilterActive(true);
                }}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 italic">
                <span>$50</span>
                <span>$5000+</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="border-t border-slate-100 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                />
                <span className="text-xs font-semibold text-slate-700 italic">
                  In-Stock Items Only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 italic">Active:</span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs italic font-medium">
                  {selectedCategory}
                  <button onClick={() => handleCategoryChange("All")}>
                    <FiX className="w-3.5 h-3.5 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs italic font-medium">
                  "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      const np = new URLSearchParams(searchParams);
                      np.delete("search");
                      setSearchParams(np);
                    }}
                  >
                    <FiX className="w-3.5 h-3.5 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {priceFilterActive && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs italic font-medium">
                  Under ${maxPrice}
                  <button onClick={() => {
                    setMaxPrice(5000);
                    setPriceFilterActive(false);
                  }}>
                    <FiX className="w-3.5 h-3.5 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs italic font-medium">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <FiX className="w-3.5 h-3.5 hover:text-rose-500" />
                  </button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="white-card rounded-3xl p-4 animate-pulse space-y-4">
                  <div className="w-full aspect-square bg-slate-100 rounded-2xl" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-8 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="white-card rounded-3xl p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <FiLayers className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-serif-italic italic">
                  No matching footwear found
                </h3>
                <p className="text-xs text-slate-500 italic max-w-sm mx-auto mt-1">
                  Try clearing some filters or searching for alternative shoe silhouettes.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition italic tracking-wider uppercase"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-base text-slate-900 font-serif-italic italic">
                    Filter Shoes
                  </h3>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <FiX className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase italic">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          handleCategoryChange(cat);
                          setMobileFiltersOpen(false);
                        }}
                        className={`p-2 rounded-lg text-xs font-semibold italic text-center ${
                          selectedCategory === cat
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Price */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="italic">Max Price</span>
                    <span className="italic font-serif-italic">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));
                      setPriceFilterActive(true);
                    }}
                    className="w-full accent-slate-900"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold italic tracking-wider uppercase"
                >
                  Apply Filters ({filteredProducts.length} Results)
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      resetFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold italic"
                  >
                    Reset All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
