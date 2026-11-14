import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('ss_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('ss_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant, quantity) => {
    const existingIndex = cartItems.findIndex(
      item => item.productId === product.id && item.variantId === variant.id
    );

    if (existingIndex > -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      // Calculate unit price based on category
      let unitPrice = 0;
      if (product.category === 'Shrink Wrapper') {
        unitPrice = variant.weightKg * product.basePricePerKg;
      } else {
        unitPrice = variant.pricePerPack || variant.price || 0;
      }

      setCartItems([
        ...cartItems,
        { productId: product.id, variantId: variant.id, product, variant, quantity, unitPrice }
      ]);
    }
  };

  const removeFromCart = (productId, variantId) => {
    setCartItems(cartItems.filter(item => !(item.productId === productId && item.variantId === variantId)));
  };

  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    const updatedCart = cartItems.map(item =>
      item.productId === productId && item.variantId === variantId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);