export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="inline-block bg-white p-3 rounded-2xl shadow-sm">
              <img src="/logo.png" alt="SevaSetu Logo" className="h-24 w-auto object-contain" />
            </div>
            <p className="mt-4 text-gray-400 max-w-sm">
              Connecting Hearts to Causes. Find, trust, and support verified NGOs, Temples, and Charities.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/" className="text-base text-gray-400 hover:text-orange-500">
                  Home
                </a>
              </li>
              <li>
                <a href="/organizations" className="text-base text-gray-400 hover:text-orange-500">
                  Discover NGOs
                </a>
              </li>
              <li>
                <a href="/register" className="text-base text-gray-400 hover:text-orange-500">
                  Register Organization
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-orange-500">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-orange-500">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-orange-500">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} SevaSetu. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            * SevaSetu is a listing platform and does not route funds. All donations go directly to organizations.
          </p>
        </div>
      </div>
    </footer>
  );
}
