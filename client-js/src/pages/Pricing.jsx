import React, { useState } from "react";
import qrImage from '../assets/qr.png'
import toast from 'react-hot-toast'
import {useDispatch} from 'react-redux'
import { buyCredits } from "../features/auth/authThunk";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const creditPlans = [
  {
    id: "basic",
    name: "Starter Pack",
    credits: 10,
    amount: 50,
    offer: "₹5 = 1 credit",
  },
  {
    id: "popular",
    name: "Growth Pack",
    credits: 30,
    amount: 125,
    offer: "Save ₹25",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 50,
    amount: 200,
    offer: "Save ₹50",
  },
];

const dispatch = useDispatch()

      const handlePaymentSubmit = async () => {
        const result = await dispatch(buyCredits({ planId: selectedPlan.id, transactionNumber: transactionId })).unwrap()
    
        toast(result.message)
      }



  return (
    <section className="relative min-h-screen bg-black text-white px-6 py-24 font-poppins">
      {/* Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-lime-400/10 blur-[160px]" />
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-lime-400 text-sm font-bold uppercase tracking-widest">
          Credit Plans
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mt-4">
          Buy Credits via UPI
        </h1>
        <p className="text-white/60 mt-4">
          Fixed plans · Manual admin verification
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {creditPlans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className={`
              cursor-pointer rounded-3xl p-6 border transition-all backdrop-blur-xl
              ${
                selectedPlan?.id === plan.id
                  ? "border-lime-400 shadow-[0_0_40px_rgba(163,230,53,0.4)]"
                  : "border-white/10 hover:border-lime-400/40"
              }
            `}
          >
            {plan.popular && (
              <div className="mb-3 inline-block px-3 py-1 text-xs font-bold bg-lime-400 text-black rounded-full">
                Most Popular
              </div>
            )}

            <h3 className="text-xl font-semibold">{plan.name}</h3>

            <p className="text-4xl font-bold mt-4">₹{plan.amount}</p>

            <p className="text-lime-400 mt-2">
              {plan.credits} Credits
            </p>

            <p className="text-white/60 text-sm mt-2">
              {plan.offer}
            </p>
          </div>
        ))}
      </div>

      {/* Payment Section */}
      {selectedPlan && (
        <div className="max-w-xl mx-auto mt-20 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Payment Details
          </h2>

          {/* Auto-filled fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <p className="text-white/50 text-sm">Amount</p>
              <p className="text-xl font-bold">₹{selectedPlan.amount}</p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <p className="text-white/50 text-sm">Credits</p>
              <p className="text-xl font-bold">
                {selectedPlan.credits}
              </p>
            </div>
          </div>

          {/* QR */}
          <div className="flex justify-center mb-6">
            <img
  src={qrImage}
  alt="UPI QR"
  className="max-w-full h-auto rounded-4xl border border-white/10"
/>
          </div>

          {/* Transaction ID */}
          <input
            type="text"
            placeholder="Enter Transaction / UTR Number (12-digits)"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl bg-black/40
              border border-white/10 text-white
              placeholder:text-white/40 focus:outline-none
              focus:border-lime-400 mb-4
            "
          />

          {/* Warning */}
          <p className="text-xs text-red-400 mb-6">
            ⚠️ Amount must exactly match the selected plan.  
            Any mismatch will be rejected with no refund.
          </p>

          {/* Submit */}
          <button
            disabled={!transactionId  || transactionId.length < 12}
            onClick={handlePaymentSubmit}
            className="
              w-full py-3 rounded-full font-semibold
              bg-lime-400 text-black hover:bg-lime-300
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            Submit for Verification
          </button>
        </div>
      )}
    </section>
  );
};

export default Pricing;
