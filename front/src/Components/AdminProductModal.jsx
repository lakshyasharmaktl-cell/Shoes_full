import React, { useState, useEffect } from "react";
import { FiX, FiPlus, FiTrash2, FiUploadCloud, FiImage, FiCheck } from "react-icons/fi";
import { api } from "../api/apiClient";
import { useToast } from "../context/ToastContext";

export default function AdminProductModal({ isOpen, onClose, productToEdit, onSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "Running",
    price: "",
    discountPrice: "",
    isActive: true,
  });

  const [sizes, setSizes] = useState([
    { size: 7, stock: 10 },
    { size: 8, stock: 15 },
    { size: 9, stock: 20 },
    { size: 10, stock: 15 },
    { size: 11, stock: 5 },
  ]);

  const [colorsInput, setColorsInput] = useState("White, Black");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useToast();

  const categories = [
    "Running",
    "Casual",
    "Sports",
    "Formal",
    "Sneakers",
    "Lifestyle",
    "Training",
  ];

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        brand: productToEdit.brand || "",
        category: productToEdit.category || "Running",
        price: productToEdit.price || "",
        discountPrice: productToEdit.discountPrice || "",
        isActive: productToEdit.isActive !== undefined ? productToEdit.isActive : true,
      });

      if (productToEdit.sizes && productToEdit.sizes.length > 0) {
        setSizes(productToEdit.sizes.map((s) => ({ size: Number(s.size), stock: Number(s.stock) })));
      } else {
        setSizes([{ size: 8, stock: 10 }]);
      }

      if (productToEdit.colors && productToEdit.colors.length > 0) {
        setColorsInput(productToEdit.colors.join(", "));
      } else {
        setColorsInput("");
      }

      if (productToEdit.images && productToEdit.images.length > 0) {
        setExistingImages(productToEdit.images);
      } else {
        setExistingImages([]);
      }
    } else {
      // Reset defaults for Add Mode
      setFormData({
        name: "",
        description: "",
        brand: "SHOE COLLECTION",
        category: "Running",
        price: "",
        discountPrice: "",
        isActive: true,
      });
      setSizes([
        { size: 7, stock: 10 },
        { size: 8, stock: 15 },
        { size: 9, stock: 20 },
        { size: 10, stock: 15 },
        { size: 11, stock: 5 },
      ]);
      setColorsInput("White, Silver, Pure White");
      setSelectedFiles([]);
      setPreviewUrls([]);
      setExistingImages([]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      showError("You can upload a maximum of 5 images");
      return;
    }
    setSelectedFiles(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  const handleAddSize = () => {
    const lastSize = sizes.length > 0 ? sizes[sizes.length - 1].size : 6;
    setSizes([...sizes, { size: lastSize + 1, stock: 10 }]);
  };

  const handleRemoveSize = (index) => {
    if (sizes.length <= 1) {
      showError("At least one size is required");
      return;
    }
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...sizes];
    updated[index][field] = Number(value);
    setSizes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
      showError("Please fill in all required fields (Name, Description, Price)");
      return;
    }

    if (sizes.length === 0) {
      showError("Please provide at least one shoe size and stock count");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("brand", formData.brand.trim());
      data.append("category", formData.category);
      data.append("price", Number(formData.price));
      if (formData.discountPrice) {
        data.append("discountPrice", Number(formData.discountPrice));
      }
      data.append("isActive", formData.isActive);

      // Parse colors
      const parsedColors = colorsInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      data.append("colors", JSON.stringify(parsedColors));

      // Append sizes
      data.append("sizes", JSON.stringify(sizes));

      // Append files
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          data.append("images", file);
        });
      }

      if (productToEdit) {
        await api.updateProduct(productToEdit._id, data);
        showSuccess(`Product "₹{formData.name}" updated successfully!`);
      } else {
        await api.createProduct(data);
        showSuccess(`New Product "₹{formData.name}" created successfully!`);
      }

      onSaved();
      onClose();
    } catch (err) {
      showError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-serif-italic italic">
              {productToEdit ? "Edit Footwear Product" : "Add New Footwear Product"}
            </h3>
            <p className="text-xs text-slate-500 italic">
              {productToEdit
                ? "Update pricing, inventory, categories and images"
                : "Enter product details to publish to the store"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Air Velocity Pulse White"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 italic"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                Brand Name
              </label>
              <input
                type="text"
                placeholder="e.g. SHOE COLLECTION, Nike, Adidas..."
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 italic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                Regular Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="e.g. 149.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
                Discount Price (₹) (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 119.99"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
              Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the shoe materials, cushioned sole, breathable upper, aesthetic styling..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 italic">
              Color Variations (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Pure White, Arctic Silver, Pearl White"
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none italic"
            />
          </div>

          {/* Sizes and Inventory Manager */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider italic">
                  Shoe Sizes & Stock Inventory *
                </h4>
                <p className="text-[11px] text-slate-500 italic">
                  Specify available sizes (e.g. 7, 8, 9, 10, 11) and their units in stock.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-800 text-slate-900 rounded-lg text-xs font-semibold flex items-center gap-1 italic transition shadow-xs"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add Size
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sizes.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200"
                >
                  <div className="w-1/2">
                    <label className="text-[10px] text-slate-500 uppercase font-semibold italic">
                      Size
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={s.size}
                      onChange={(e) => handleSizeChange(idx, "size", e.target.value)}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold italic"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-[10px] text-slate-500 uppercase font-semibold italic">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={s.stock}
                      onChange={(e) => handleSizeChange(idx, "stock", e.target.value)}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold italic"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(idx)}
                    className="mt-3 p-1.5 text-slate-400 hover:text-rose-500 transition"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 italic">
              Product Images (Max 5 files)
            </label>

            {/* Existing Images preview */}
            {existingImages.length > 0 && selectedFiles.length === 0 && (
              <div className="mb-3">
                <p className="text-[11px] text-slate-500 italic mb-1.5">Current Saved Images:</p>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((img, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1"
                    >
                      <img
                        src={api.getImageUrl(img)}
                        alt="Existing"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <label className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <FiUploadCloud className="w-8 h-8 text-slate-400 group-hover:text-slate-700 transition mb-2" />
              <p className="text-xs font-semibold text-slate-800 italic">
                Click to browse or drop shoe photo files here
              </p>
              <p className="text-[11px] text-slate-400 italic mt-0.5">
                PNG, JPG, WEBP up to 5MB each
              </p>
            </label>

            {/* New previews */}
            {previewUrls.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {previewUrls.map((url, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-xl border border-emerald-300 overflow-hidden bg-white p-1 relative shadow-xs"
                  >
                    <img src={url} alt="Upload preview" className="w-full h-full object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-slate-800 italic cursor-pointer">
              Product is Active & visible in customer store
            </label>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition italic"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md flex items-center gap-2 italic tracking-wider uppercase disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <FiCheck className="w-4 h-4" />
            )}
            <span>{productToEdit ? "Save Changes" : "Create Product"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
