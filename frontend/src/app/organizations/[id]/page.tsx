'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Organization } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Mail, Phone, ShieldCheck, HeartPulse } from 'lucide-react';

export default function OrganizationDetailPage() {
  const { id } = useParams();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number>(500);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await api.get<Organization>(`/organizations/${id}`);
        setOrg(res.data);
      } catch (error) {
        toast.error('Failed to load organization details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrg();
  }, [id]);

  const handleDonate = async () => {
    if (!org) return;

    if (!org.razorpayAccountId && !org.razorpayKeyId) {
      toast.error('This organization has not set up direct payments yet.');
      return;
    }

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Should integrate their specific key or account logic
        amount: amount * 100, // paise
        currency: 'INR',
        name: org.name,
        description: 'Direct Donation',
        image: org.logo || 'https://via.placeholder.com/150',
        handler: async function (response: any) {
          // Send metadata to our backend for optional tracking
          try {
            await api.post('/donations', {
              orgId: org._id,
              amount: amount,
              paymentId: response.razorpay_payment_id,
            });
            toast.success(`Successfully donated ₹${amount} to ${org.name}! Thank you.`);
          } catch (err) {
            console.error('Failed to save donation metadata', err);
            // Donation was successful on razorpay's end, so show success
            toast.success('Donation successful!');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#EA580C', // orange-600
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error.description);
      });
      rzp.open();
    } catch (error) {
      toast.error('Payment initialization failed. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-32 text-gray-500 animate-pulse">Loading Organization...</div>;
  if (!org) return <div className="text-center py-32 text-red-500">Organization not found.</div>;

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 w-full bg-gray-200">
        {org.images && org.images.length > 0 ? (
          <img src={org.images[0]} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500"></div>
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 max-w-7xl mx-auto flex items-end">
          {org.logo ? (
            <img src={org.logo} alt="Logo" className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-4 border-white shadow-lg bg-white object-contain" />
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-4 border-white shadow-lg bg-orange-100 flex items-center justify-center text-4xl font-bold text-orange-600">
              {org.name.charAt(0)}
            </div>
          )}
          <div className="ml-6 pb-2 text-white">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl md:text-4xl font-extrabold shadow-sm">{org.name}</h1>
              {org.isVerified && (
                <span title="Verified Organization" className="inline-flex items-center">
                  <ShieldCheck className="text-green-400 h-8 w-8" />
                </span>
              )}
            </div>
            <p className="opacity-90 mt-1 capitalize">{org.type}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">About Us</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{org.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Gallery</h2>
              {org.images && org.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {org.images.map((img, i) => (
                    <img key={i} src={img} alt={`Gallery Image ${i + 1}`} className="rounded-lg object-cover h-40 w-full shadow-sm hover:opacity-90 transition-opacity" />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center text-gray-500 flex flex-col items-center justify-center">
                  <p className="mt-2 text-sm">No photos uploaded by {org.name} yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar / Donation / Contact */}
          <div className="space-y-8">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="text-center mb-6">
                <HeartPulse className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900">Make a Donation</h3>
                <p className="text-sm text-gray-500 mt-1">100% of your money goes directly to {org.name}</p>
              </div>

              <div className="space-y-4">
                <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 shadow-sm">
                  <span className="flex items-center px-4 bg-gray-50 text-gray-500 border-r text-lg font-medium">₹</span>
                  <input 
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1 px-4 py-3 outline-none text-lg font-bold text-gray-900"
                  />
                </div>
                
                <div className="flex gap-2">
                  {[500, 1000, 2000].map(val => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`flex-1 py-1.5 rounded-full text-sm font-medium border ${amount === val ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleDonate}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold rounded-xl shadow-md transition-transform active:scale-95"
                >
                  Donate Now
                </button>
                <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Secured by Razorpay
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">{org.address}, {org.city}, {org.state} - {org.pincode}</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <a href={`mailto:${org.contactEmail}`} className="text-orange-600 hover:underline break-all">{org.contactEmail}</a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <a href={`tel:${org.phone}`} className="text-orange-600 hover:underline">{org.phone}</a>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
