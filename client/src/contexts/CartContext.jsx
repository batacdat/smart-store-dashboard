import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Hàm thêm sản phẩm (Đã có)
  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.find((item) => item._id === product._id);
      if (isItemInCart) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  // 2. Hàm cập nhật số lượng (Tăng/Giảm)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Không cho phép nhỏ hơn 1
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 3. Hàm xóa sản phẩm khỏi giỏ
 const removeFromCart = (productId) => {
  // Bỏ window.confirm, chỉ giữ lại logic lọc mảng
  setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
};

  // 4. Hàm xóa sạch giỏ hàng (Dùng sau khi thanh toán thành công)
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);