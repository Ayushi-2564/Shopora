import React, { useState } from 'react';
import {
  X,
  Zap,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Receipt,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export const OrderCheckoutModal: React.FC = () => {
  const {
    isOrderCheckoutOpen,
    closeOrderCheckout,
    items,
    stats,
    isPlacingOrder,
    placedOrder,
    submitPlaceOrder,
    preferences,
    setActiveTab,
  } = useShoppingStore();

  const { speak } = useSpeechSynthesis(preferences.enableTTS, preferences.language);

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Flat 402, Green Valley Apartments, Indiranagar, Bengaluru - 560038'
  );
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  if (!isOrderCheckoutOpen) return null;

  const activeItems = items.filter((i) => !i.completed);
  const subtotal = activeItems.reduce(
    (sum, item) => sum + item.estimatedPrice * item.quantity,
    0
  );
  const deliveryFee = 0; // Free promo
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = async () => {
    const order = await submitPlaceOrder({
      deliveryAddress,
      paymentMethod,
    });

    if (order && preferences.enableTTS) {
      speak(
        `Thank you! Your order of ₹${order.total} has been confirmed. It will arrive in 25 minutes.`
      );
    }
  };

  const handleGoToHistory = () => {
    closeOrderCheckout();
    setActiveTab('history');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {placedOrder ? 'Order Confirmation' : 'Review & Place Order'}
              </h3>
              <p className="text-xs text-slate-500">
                {placedOrder
                  ? `Order #${placedOrder.orderNumber}`
                  : `${activeItems.length} items ready for express checkout`}
              </p>
            </div>
          </div>

          <button
            onClick={closeOrderCheckout}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {placedOrder ? (
          /* ========================================================================= */
          /* SUCCESS / PLACED SCREEN */
          /* ========================================================================= */
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                ₹{placedOrder.total} Paid via {placedOrder.paymentMethod}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Order ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{placedOrder.orderNumber}</span>
              </p>
            </div>

            {/* Delivery Tracker Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-brand-50/60 dark:from-slate-800 dark:to-slate-850 border border-emerald-200/80 dark:border-slate-700 text-left space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>⚡ Arriving in ~{placedOrder.estimatedDeliveryMins} Mins</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                  Express Delivery
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="truncate">{placedOrder.deliveryAddress}</span>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200/40 dark:border-slate-700 text-[10px] font-bold text-center">
                <div className="text-emerald-600 dark:text-emerald-400">✓ Confirmed</div>
                <div className="text-brand-600 dark:text-brand-400 animate-pulse">Packing...</div>
                <div className="text-slate-400">On the way</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleGoToHistory}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>View in History</span>
              </button>

              <button
                onClick={closeOrderCheckout}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CHECKOUT REVIEW SCREEN */
          /* ========================================================================= */
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Delivery address */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" /> Delivery Address:
                </span>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  {isEditingAddress ? 'Save' : 'Change'}
                </button>
              </div>

              {isEditingAddress ? (
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-brand-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  rows={2}
                />
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {deliveryAddress}
                </p>
              )}
            </div>

            {/* Itemized summary */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Items In Order ({activeItems.length})
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {activeItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60"
                  >
                    <span className="truncate pr-2 font-medium text-slate-800 dark:text-slate-200">
                      {item.quantity} {item.unit} • {item.name}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white flex-shrink-0">
                      ₹{item.estimatedPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Payment Method
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'UPI'
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950 text-brand-700 dark:text-brand-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Zap className="w-4 h-4 text-brand-600" />
                  <span>UPI / GPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'Card'
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950 text-brand-700 dark:text-brand-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-brand-600" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'COD'
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950 text-brand-700 dark:text-brand-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Truck className="w-4 h-4 text-brand-600" />
                  <span>Cash on Delivery</span>
                </button>
              </div>
            </div>

            {/* Bill breakdown */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Item Subtotal ({activeItems.length} items)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Express Delivery (25 Mins)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-base text-brand-600 dark:text-brand-400">₹{total}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="pt-2">
              <button
                onClick={handleConfirmOrder}
                disabled={isPlacingOrder || activeItems.length === 0}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 active:scale-[0.98] text-white text-sm font-extrabold shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? (
                  <span>Placing Your Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order (₹{total})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Safe & Contactless Instant Grocery Delivery</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
