'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AdminStats, PaginatedOrganizations } from '@/types';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, ShieldCheck, Trash2, ShieldOff } from 'lucide-react';

export default function AdminPage() {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [data, setData] = useState<PaginatedOrganizations | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

  useEffect(() => {
    if (isInitialized && !user) router.push('/login');
    if (user && user.role !== 'admin') router.push('/');

    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user, isInitialized, page, filter, router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, orgsRes] = await Promise.all([
        api.get<AdminStats>('/admin/stats'),
        api.get<PaginatedOrganizations>(`/admin/organizations`, {
          params: { status: filter === 'all' ? '' : filter, page, limit: 10 }
        })
      ]);
      setStats(statsRes.data);
      setData(orgsRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
    try {
      await api.patch(`/admin/organizations/${id}/status`, { status });
      toast.success('Status updated');
      fetchAdminData();
    } catch {
      toast.error('Failed to change status');
    }
  };

  const toggleVerification = async (id: string) => {
    try {
      await api.patch(`/admin/organizations/${id}/verify`);
      toast.success('Verification toggled');
      fetchAdminData();
    } catch {
      toast.error('Failed to toggle verification');
    }
  };

  const deleteOrg = async (id: string) => {
    if (confirm('DANGER! Cannot be undone. Delete organization permanently?')) {
      try {
        await api.delete(`/admin/organizations/${id}`);
        toast.success('Deleted successfully');
        fetchAdminData();
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  if (!isInitialized || loading) return <div className="text-center py-20 animate-pulse">Loading admin dashboard...</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="mt-2 text-sm text-gray-700">Manage platform organizations, approvals, and general statistics.</p>
        </div>
      </div>

      {stats && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex justify-between items-center text-gray-500 text-sm font-medium">Pending Approvals</div>
              <div className="mt-1 text-3xl font-semibold text-yellow-600">{stats.pendingOrgs}</div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex justify-between items-center text-gray-500 text-sm font-medium">Live Organizations</div>
              <div className="mt-1 text-3xl font-semibold text-green-600">{stats.approvedOrgs}</div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex justify-between items-center text-gray-500 text-sm font-medium">Verified Accounts</div>
              <div className="mt-1 text-3xl font-semibold text-blue-600">{stats.verifiedOrgs}</div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex justify-between items-center text-gray-500 text-sm font-medium">Total Registered Users</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUsers}</div>
            </div>
          </div>
        </div>
      )}

      {/* Organizations Table */}
      <div className="mt-12">
        <div className="flex gap-4 mb-6">
          {['pending', 'approved', 'rejected', 'all'].map(status => (
            <button
              key={status}
              onClick={() => { setFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === status ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type / Status</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data?.organizations.map((org) => (
                <tr key={org._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center">
                          {org.name} 
                          {org.isVerified && <ShieldCheck className="w-4 h-4 ml-1 text-green-500" title="Verified"/>}
                        </div>
                        <div className="text-gray-500 text-xs">ID: {org._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="text-gray-900">{org.contactEmail}</div>
                    <div className="text-gray-500">{org.phone}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800 uppercase mr-2.5">
                      {org.type}
                    </span>
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 uppercase
                      ${org.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        org.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex items-center justify-end gap-3">
                    
                    {/* Approve / Reject Actions */}
                    {org.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusChange(org._id, 'approved')} className="text-green-600 hover:text-green-900" title="Approve">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleStatusChange(org._id, 'rejected')} className="text-red-600 hover:text-red-900" title="Reject">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Revoke/Approve if already resolved */}
                    {org.status === 'approved' && (
                      <button onClick={() => handleStatusChange(org._id, 'pending')} className="text-yellow-600 hover:text-yellow-900 text-xs font-bold ring-1 px-2 py-1 rounded ring-yellow-400">
                        Revoke Approval
                      </button>
                    )}

                    {org.status === 'rejected' && (
                       <button onClick={() => handleStatusChange(org._id, 'pending')} className="text-yellow-600 hover:text-yellow-900 text-xs font-bold ring-1 px-2 py-1 rounded ring-yellow-400">
                       Re-evaluate
                     </button>
                    )}

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button onClick={() => toggleVerification(org._id)} className={org.isVerified ? 'text-gray-400 hover:text-gray-600' : 'text-blue-500 hover:text-blue-700'} title={org.isVerified ? 'Unverify' : 'Verify'}>
                      {org.isVerified ? <ShieldOff className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </button>

                    <button onClick={() => deleteOrg(org._id)} className="text-red-600 hover:text-red-900 ml-2" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {data?.organizations.length === 0 && (
                <tr><td colSpan={4} className="py-10 text-center text-gray-500">No organizations found.</td></tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 bg-gray-50 mt-auto">
              <div>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100"
                >
                  Previous
                </button>
                <button
                  disabled={page === data.pagination.pages}
                  onClick={() => setPage(page + 1)}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100"
                >
                  Next
                </button>
              </div>
              <p className="text-sm text-gray-700">Page {data.pagination.page} of {data.pagination.pages}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
