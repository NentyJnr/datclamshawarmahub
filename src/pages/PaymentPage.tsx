import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, Send, Building2, Hash, RefreshCw, 
  Lock, X, CheckCircle2, Copy, Loader2, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { useStore } from '../store/useStore';

type PaymentMethodType = 'card' | 'transfer' | 'bank' | 'ussd' | 'opay' | null;

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, activeOrder } = useStore();
  const currentOrder = activeOrder.order;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedUssd, setCopiedUssd] = useState(false);

  // Form input states for interactive dummy payments
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('GTBank');
  const [opayPhone, setOpayPhone] = useState('');

  // Amount calculation
  const amountToPay = currentOrder ? currentOrder.grandTotal : cart.getGrandTotal();
  const formattedAmount = amountToPay.toLocaleString();

  const handleCompletePayment = (methodName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        if (currentOrder) {
          activeOrder.updateOrderStatus('Preparing');
        }
        cart.clearCart();
        if (currentOrder) {
          navigate(`/track/${currentOrder.id}`);
        } else {
          navigate('/');
        }
      }, 1500);
    }, 2000);
  };

  const handleCopyText = (text: string, type: 'account' | 'ussd') => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedUssd(true);
      setTimeout(() => setCopiedUssd(false), 2000);
    }
  };

  if (!currentOrder && cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-stone-900 mb-2">No Active Payment Session</h2>
        <p className="text-stone-600 max-w-md mb-6">Please select your shawarma items and proceed through checkout.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-datclam-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-4 bg-white">
          <button
            onClick={() => navigate('/checkout')}
            className="p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            title="Back to Checkout"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Payment</h1>
        </div>

        {/* Processing / Success Full-screen Overlay inside Card */}
        {isProcessing && (
          <div className="p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900">Processing Payment...</h3>
              <p className="text-stone-500 text-sm">Securing transaction with Paystack gateway. Please do not refresh.</p>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-emerald-600">Payment Successful!</h3>
              <p className="text-stone-600 text-sm font-semibold">
                NGN {formattedAmount} paid successfully to DATCLAM SHAWARMA HUB.
              </p>
              <p className="text-xs text-stone-400">Redirecting to live order tracking...</p>
            </div>
          </div>
        )}

        {!isProcessing && !isSuccess && (
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Paystack Checkout Info Banner */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest block">
                PAYSTACK CHECKOUT
              </span>
              <p className="text-stone-600 text-sm font-medium leading-relaxed">
                Use one of the payment methods below to pay <strong className="text-stone-900 font-extrabold">NGN {formattedAmount}</strong> to <strong className="text-stone-900 font-extrabold">DATCLAM SHAWARMA HUB</strong>
              </p>
            </div>

            {/* Main Options Selection View */}
            {selectedMethod === null && (
              <div className="divide-y divide-stone-100 border-t border-b border-stone-100">
                
                {/* 1. Pay with Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-stone-50 transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold text-stone-800 group-hover:text-stone-900">Pay with Card</span>
                  </div>
                  <span className="text-stone-400 group-hover:text-stone-600 text-lg font-bold">&rsaquo;</span>
                </button>

                {/* 2. Pay with Transfer */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('transfer')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-stone-50 transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <Send className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold text-stone-800 group-hover:text-stone-900">Pay with Transfer</span>
                  </div>
                  <span className="text-stone-400 group-hover:text-stone-600 text-lg font-bold">&rsaquo;</span>
                </button>

                {/* 3. Pay with Bank */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-stone-50 transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold text-stone-800 group-hover:text-stone-900">Pay with Bank</span>
                  </div>
                  <span className="text-stone-400 group-hover:text-stone-600 text-lg font-bold">&rsaquo;</span>
                </button>

                {/* 4. Pay with USSD */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('ussd')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-stone-50 transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <Hash className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold text-stone-800 group-hover:text-stone-900">*# Pay with USSD</span>
                  </div>
                  <span className="text-stone-400 group-hover:text-stone-600 text-lg font-bold">&rsaquo;</span>
                </button>

                {/* 5. Pay with OPay */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('opay')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-stone-50 transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold text-stone-800 group-hover:text-stone-900">Pay with OPay</span>
                  </div>
                  <span className="text-stone-400 group-hover:text-stone-600 text-lg font-bold">&rsaquo;</span>
                </button>

              </div>
            )}

            {/* Sub-View 1: Pay with Card */}
            {selectedMethod === 'card' && (
              <div className="space-y-5 bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-stone-900 text-base">Enter Card Details</h3>
                  <button onClick={() => setSelectedMethod(null)} className="text-xs font-bold text-emerald-600 hover:underline">Change Method</button>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="5399 •••• •••• 4084"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl p-3 text-stone-900 font-mono text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl p-3 text-stone-900 font-mono text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl p-3 text-stone-900 font-mono text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCompletePayment('Card')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                  >
                    Pay NGN {formattedAmount}
                  </button>
                </div>
              </div>
            )}

            {/* Sub-View 2: Pay with Transfer */}
            {selectedMethod === 'transfer' && (
              <div className="space-y-5 bg-stone-50 p-6 rounded-2xl border border-stone-200 text-center">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-stone-900 text-base">Bank Transfer Details</h3>
                  <button onClick={() => setSelectedMethod(null)} className="text-xs font-bold text-emerald-600 hover:underline">Change Method</button>
                </div>

                <div className="space-y-3 bg-white p-5 rounded-xl border border-stone-200">
                  <span className="text-xs uppercase font-bold text-stone-400 tracking-wider block">Wema Bank (Paystack Checkout)</span>
                  <div className="text-3xl font-black text-stone-900 font-mono tracking-wider">
                    9928371029
                  </div>
                  <p className="text-xs text-stone-600 font-semibold">Account Name: Datclam Shawarma Hub Checkout</p>
                  
                  <button
                    type="button"
                    onClick={() => handleCopyText('9928371029', 'account')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedAccount ? 'Account Number Copied!' : 'Copy Account Number'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCompletePayment('Transfer')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                >
                  I Have Sent The Money
                </button>
              </div>
            )}

            {/* Sub-View 3: Pay with Bank */}
            {selectedMethod === 'bank' && (
              <div className="space-y-5 bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-stone-900 text-base">Select Your Bank</h3>
                  <button onClick={() => setSelectedMethod(null)} className="text-xs font-bold text-emerald-600 hover:underline">Change Method</button>
                </div>

                <div className="space-y-3">
                  {['GTBank', 'Zenith Bank', 'Access Bank', 'Kuda Bank'].map((bank) => (
                    <label
                      key={bank}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedBank === bank ? 'bg-emerald-50 border-emerald-600 font-bold text-stone-900' : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <span>{bank}</span>
                      <input
                        type="radio"
                        name="bankSelection"
                        checked={selectedBank === bank}
                        onChange={() => setSelectedBank(bank)}
                        className="accent-emerald-600"
                      />
                    </label>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleCompletePayment('Bank Direct')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-transform hover:scale-[1.01] mt-3"
                  >
                    Authorize {selectedBank} Payment
                  </button>
                </div>
              </div>
            )}

            {/* Sub-View 4: Pay with USSD */}
            {selectedMethod === 'ussd' && (
              <div className="space-y-5 bg-stone-50 p-6 rounded-2xl border border-stone-200 text-center">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-stone-900 text-base">USSD Dial Code</h3>
                  <button onClick={() => setSelectedMethod(null)} className="text-xs font-bold text-emerald-600 hover:underline">Change Method</button>
                </div>

                <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Dial code on your mobile phone:</span>
                  <div className="text-2xl font-black text-amber-600 font-mono">
                    *737*33*9928371029#
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('*737*33*9928371029#', 'ussd')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedUssd ? 'USSD Code Copied!' : 'Copy USSD Code'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCompletePayment('USSD')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                >
                  I Have Completed USSD Payment
                </button>
              </div>
            )}

            {/* Sub-View 5: Pay with OPay */}
            {selectedMethod === 'opay' && (
              <div className="space-y-5 bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-stone-900 text-base">OPay Wallet Checkout</h3>
                  <button onClick={() => setSelectedMethod(null)} className="text-xs font-bold text-emerald-600 hover:underline">Change Method</button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-1">OPay Phone Number</label>
                    <input
                      type="tel"
                      placeholder="0814 361 6974"
                      value={opayPhone}
                      onChange={(e) => setOpayPhone(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl p-3 text-stone-900 font-mono text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCompletePayment('OPay Wallet')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-transform hover:scale-[1.01] mt-2"
                  >
                    Pay NGN {formattedAmount} with OPay
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Controls: Cancel Payment & Secured Badge (Exact match to image 2) */}
            <div className="pt-4 space-y-6 text-center border-t border-stone-100">
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors border border-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-500" />
                <span>Cancel Payment</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-stone-600">
                <Lock className="w-4 h-4 text-stone-800" />
                <span>Secured by <strong className="text-stone-900 font-extrabold">paystack</strong></span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
