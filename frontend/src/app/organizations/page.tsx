'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { Organization, PaginatedOrganizations } from '@/types';

function OrganizationsList() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const city = searchParams.get('city') || '';

  const [data, setData] = useState<PaginatedOrganizations | null>(null);
  const [loading, setLoading] = useState(true);

  // States for local form filtering
  const [queryInput, setQueryInput] = useState(search);
  const [typeInput, setTypeInput] = useState(type);
  const [cityInput, setCityInput] = useState(city);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedOrganizations>(`/organizations`, {
        params: { search, type, city, limit: 12 }
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [search, type, city]);

  const updateFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (queryInput) params.set('search', queryInput);
    if (typeInput) params.set('type', typeInput);
    if (cityInput) params.set('city', cityInput);
    window.history.pushState(null, '', `?${params.toString()}`);
    // Manually trigger fetch since Next.js app router doesn't always strictly re-render client components 
    // unless using router.push, but let's keep it simple
    window.location.search = params.toString(); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Organizations</h1>
        <p className="mt-2 text-gray-600">Find verified NGOs, temples, and charities to support.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <form onSubmit={updateFilters} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-20">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Name, details..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="NGO">NGO</option>
                  <option value="Temple">Temple</option>
                  <option value="Trust">Trust</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Apply Filters
              </button>
              
              {(search || type || city) && (
                <button
                  type="button"
                  onClick={() => window.location.href = '/organizations'}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-2"
                >
                  Clear All
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-80">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-200 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.organizations.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-100 shadow-sm">
              <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No organizations found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search filters.</p>
            </div>
          ) : (
             <>
              <p className="text-sm text-gray-500 mb-4">
                Showing {data?.organizations.length} of {data?.pagination.total} results
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.organizations.map((org) => (
                  <Link href={`/organizations/${org._id}`} key={org._id} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                    <div className="relative h-48 w-full bg-gray-100">
                      {org.images?.[0] ? (
                        <img
                          src={org.images[0]}
                          alt={org.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                          No Image
                        </div>
                      )}
                      {org.isVerified && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-sm" title="Verified Organization">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        {org.type}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center space-x-3 mb-2">
                        {org.logo ? (
                          <img src={org.logo} alt="Logo" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                            {org.name.charAt(0)}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{org.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                        {org.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mb-4 border-t border-gray-50 pt-3">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {org.city}, {org.state}
                      </div>
                      <div className="mt-auto w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-orange-700 bg-orange-50 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <OrganizationsList />
    </Suspense>
  );
}
