import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("shoe_cart_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showError, showInfo, showSuccess } = useToast();

  useEffect(() => {
    localStorage.setItem("shoe_cart_items", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedSize, quantity = 1) => {
    // 🔒 Require sign-in before shopping
    if (!isAuthenticated) {
      showError("Please sign in to add items to your cart");
      navigate("/auth");
      return false;
    }

    if (!selectedSize) {
      showError("Please select a shoe size first");
      return false;
    }

    const sizeObj = product.sizes?.find((s) => Number(s.size) === Number(selectedSize));
    const availableStock = sizeObj ? sizeObj.stock : product.totalStock || 0;

    if (availableStock <= 0) {
      showError("Selected size is currently out of stock");
      return false;
    }

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    const existingIndex = cart.findIndex(
      (item) => item.productId === product._id && Number(item.size) === Number(selectedSize)
    );

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + quantity > availableStock) {
        showError(`Cannot add more than ${availableStock} items in this size`);
        return false;
      }

      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
      showSuccess(`Updated ${product.name} (Size ${selectedSize}) in your cart!`);
    } else {
      if (quantity > availableStock) {
        showError(`Only ${availableStock} items available in size ${selectedSize}`);
        return false;
      }

      const newItem = {
        productId: product._id,
        name: product.name,
        brand: product.brand || "Exclusive",
        category: product.category,
        image: product.images && product.images[0] ? product.images[0] : "",
        price: price,
        originalPrice: product.price,
        discountPrice: product.discountPrice,
        size: Number(selectedSize),
        quantity: quantity,
        maxStock: availableStock,
      };

      setCart((prev) => [newItem, ...prev]);
      showSuccess(`Added ${product.name} (Size ${selectedSize}) to cart!`);
    }

    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && Number(item.size) === Number(size)) {
          if (newQty > item.maxStock) {
            showInfo(`Max available quantity reached (${item.maxStock})`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && Number(item.size) === Number(size))
      )
    );
    showInfo("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0);
  const totalSavings = Math.max(0, totalOriginal - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
