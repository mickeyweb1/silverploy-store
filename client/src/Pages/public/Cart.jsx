import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', address: '' });

  // Replace with your brother's actual WhatsApp number (include country code, no + or spaces)
  const BUSINESS_WHATSAPP_NUMBER = "2348000000000"; 

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      alert('Please fill in all delivery details.');
      return;
    }

    // Format the WhatsApp message
    let message = `*NEW ORDER FROM SILVER-SEMAT WEBSITE* 🛒\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerDetails.name}\n`;
    message += `Phone: ${customerDetails.phone}\n`;
    message += `Address: ${customerDetails.address}\n\n`;
    message += `*Order Items:*\n`;

    cartItems.forEach((item, index) => {
      const variantName = item.product.category === 'Shrink Wrapper' 
        ? `${item.variant.weightKg}kg (${item.variant.rollType} Roll)` 
        : (item.variant.size || item.variant.name);
      
      const itemTotal = item.unitPrice * item.quantity;
      message += `${index + 1}. ${item.product.name} [${variantName}] x ${item.quantity} = ₦${itemTotal.toLocaleString()}\n`;
    });

    message += `\n*Grand Total: ₦${cartTotal.toLocaleString()}*`;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Optional: Clear cart after checkout
    // clearCart();
    // alert('Order sent! We will contact you shortly.');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any products yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const variantName = item.product.category === 'Shrink Wrapper' 
              ? `${item.variant.weightKg}kg (${item.variant.rollType} Roll)` 
              : (item.variant.size || item.variant.name);

            return (
              <div key={`${item.productId}-${item.variantId}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg bg-gray-50" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{variantName}</p>
                  <p className="text-sm text-gray-500 mt-1">₦{item.unitPrice.toLocaleString()} per unit</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button 
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
                    <span className="px-3 py-1 font-semibold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
                  </div>
                  <p className="font-bold text-gray-900">₦{(item.unitPrice * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span className="text-gray-400">Calculated later</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">₦{cartTotal.toLocaleString()}</span>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleCheckout} className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Delivery Details</h3>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <textarea 
                placeholder="Delivery Address" 
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                rows="2"
                required
              />

              <button 
                type="submit" 
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.2-.4.2-.6.4-.8.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.7.7-.9 1.7-.5 2.8.5 1.4 1.6 2.9 3.1 3.9 1.5 1 2.8 1.3 3.8 1.1.6-.1 1.2-.5 1.5-1 .2-.5.2-1 .1-1.1z" />
                </svg>
                Checkout via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}