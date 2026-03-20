import Link from 'next/link';
import { Search, Heart, ShieldCheck, MapPin } from 'lucide-react';

export default function Home() {
  const categories = ['NGO', 'Temple', 'Education', 'Health', 'Food'];

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative bg-orange-600 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-50"
            src="/hero_bg.png"
            alt="Hero Background"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              Connecting <span className="text-orange-200">Hearts</span> to Causes
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-orange-100">
              Find, trust, and support verified NGOs, Temples, and Charities. 100% of your donation goes directly to the organization.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <form action="/organizations" className="w-full flex h-14 sm:h-16 shadow-lg rounded-md overflow-hidden">
                <div className="relative flex-grow bg-white">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    className="block w-full h-full pl-12 pr-3 border-none bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-lg"
                    placeholder="Search by name, city, or cause..."
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 h-full border-none text-lg font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/organizations?type=${cat}`}
                  className="px-4 py-2 border border-orange-200 text-sm font-medium rounded-full text-white hover:bg-orange-500 hover:border-orange-500 transition-colors backdrop-blur-sm bg-white/10"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose SevaSetu?</h2>
            <p className="mt-4 text-lg text-gray-500">
              We provide a transparent bridge between donors and organizations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 text-orange-600 mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-gray-500">
                Organizations go through an approval process. Look for the "Verified" badge for established entities.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 text-orange-600 mb-6">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Local Discovery</h3>
              <p className="text-gray-500">
                Find NGOs, temples, and trusts in your city or anywhere across India.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 text-orange-600 mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Impact</h3>
              <p className="text-gray-500">
                0% commission. Your donations go straight to the organization's linked bank account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900">Are you an Organization?</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl">
              Create a free microsite, verify your identity, and start receiving direct donations from supporters globally.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-all"
            >
              Register your Organization
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
