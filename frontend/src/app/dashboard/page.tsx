'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Organization, OrgType } from '@/types';
import toast from 'react-hot-toast';
import { UploadCloud, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'NGO' as OrgType,
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactEmail: '',
    phone: '',
    razorpayAccountId: '',
    razorpayKeyId: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (isInitialized && !user) router.push('/login');
    if (user?.role === 'admin') router.push('/admin');

    if (user && user.role === 'organization') {
      fetchMyOrg();
    }
  }, [user, isInitialized, router]);

  const fetchMyOrg = async () => {
    try {
      const res = await api.get<Organization>('/organizations/my');
      setOrg(res.data);
      // Populate form
      setFormData({
        name: res.data.name,
        type: res.data.type,
        description: res.data.description,
        address: res.data.address,
        city: res.data.city,
        state: res.data.state,
        pincode: res.data.pincode,
        contactEmail: res.data.contactEmail,
        phone: res.data.phone,
        razorpayAccountId: res.data.razorpayAccountId || '',
        razorpayKeyId: res.data.razorpayKeyId || '',
      });
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      if (logoFile) data.append('logo', logoFile);
      if (imageFiles) {
        Array.from(imageFiles).forEach(file => {
          data.append('images', file);
        });
      }

      if (org) {
        const res = await api.put(`/organizations/${org._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(res.data.message);
        fetchMyOrg();
      } else {
        const res = await api.post('/organizations', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(res.data.message);
        fetchMyOrg();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to sync profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isInitialized || loading) {
    return <div className="p-20 text-center animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Organization Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Manage your public listing and payment details.</p>
      </div>

      {org && (
        <div className="mb-8 bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50 border-b">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Status Overview</h3>
            </div>
            <div>
              {org.status === 'approved' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Live & Approved
                </span>
              )}
              {org.status === 'pending' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <Clock className="mr-1.5 h-4 w-4" /> Pending Approval
                </span>
              )}
              {org.status === 'rejected' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <AlertCircle className="mr-1.5 h-4 w-4" /> Rejected - Please update profile
                </span>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Your profile is <strong className="font-semibold">{org.status}</strong>. 
              {org.isVerified && <span className="ml-2 text-green-600 font-medium">✨ You are a Verified Organization.</span>}
            </p>
            {org.status === 'approved' && (
              <a href={`/organizations/${org._id}`} target="_blank" rel="noreferrer" className="text-orange-600 hover:text-orange-900 font-medium text-sm">
                View Public Profile →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg border border-gray-100">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Profile Details</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Organization Name *</label>
                <div className="mt-1">
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type *</label>
                <div className="mt-1">
                  <select name="type" value={formData.type} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border">
                    <option value="NGO">NGO</option>
                    <option value="Temple">Temple</option>
                    <option value="Trust">Trust</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Food">Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Public Email *</label>
                <div className="mt-1">
                  <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <div className="mt-1">
                  <textarea name="description" rows={4} required value={formData.description} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Registered Address *</label>
                <div className="mt-1">
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City *</label>
                <div className="mt-1">
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">State *</label>
                <div className="mt-1">
                  <input type="text" name="state" required value={formData.state} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pincode *</label>
                <div className="mt-1">
                  <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <div className="mt-1">
                  <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
                </div>
              </div>

              {/* Payment Settings */}
              <div className="sm:col-span-2 mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md leading-6 font-medium text-gray-900 mb-4">Payment Integration (Razorpay)</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Add your Razorpay Key ID so users can donate directly to your account.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Razorpay Key ID</label>
                    <div className="mt-1">
                      <input type="text" name="razorpayKeyId" placeholder="rzp_live_xxx..." value={formData.razorpayKeyId} onChange={handleChange} className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white text-gray-900" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Uploads */}
              <div className="sm:col-span-2 mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md leading-6 font-medium text-gray-900 mb-4">Media (Optional)</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                    <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                    <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(e.target.files)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:bg-orange-300"
              >
                {submitting ? 'Saving...' : org ? 'Update Profile' : 'Submit for Approval'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
