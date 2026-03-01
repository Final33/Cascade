import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gray-200/50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mr-4">
          {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-2 -mt-20">
                <Image
                  src="/clusionlogo.png"
                  alt="Clusion"
                  width={200}
                  height={100}
                  className="object-contain -mb-6 -ml-5"
                />
              </Link>
              <p className="text-gray-600 text-xl leading-relaxed max-w-md mb-8 -mt-8">
                The debate ecosystem
              </p>
            <div className="flex items-center gap-4">
              <a
                href="https://discord.gg/clusion"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all duration-200 hover:scale-[1.05]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/clusion"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all duration-200 hover:scale-[1.05]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/clusion"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all duration-200 hover:scale-[1.05]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.864 3.708 13.713 3.708 12.416s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.275c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.708c-.49 0-.928-.438-.928-.928s.438-.928.928-.928.928.438.928.928-.438.928-.928.928zm-3.323 9.708c-2.297 0-4.151-1.854-4.151-4.151s1.854-4.151 4.151-4.151 4.151 1.854 4.151 4.151-1.854 4.151-4.151 4.151z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/students" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">For Students</Link></li>
              <li><Link href="/coaches" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">For Coaches</Link></li>
              <li><Link href="/judges" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">For Judges</Link></li>
              <li><Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Pricing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="https://discord.gg/clusion" target="_blank" rel="noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Discord Community</a></li>
              <li><a href="mailto:support@clusion.com" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Contact Us</a></li>
              <li><Link href="/tos" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Terms of Service</Link></li>
              <li><a href="/privacy" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xl font-black tracking-tight">
                <span className="text-[#01459f]">Clu</span><span className="text-gray-900">sion</span>
              </span>
              <div className="text-gray-600 text-sm">
                © {currentYear} Clusion. All rights reserved.
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-600 font-medium">The debate ecosystem</span>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
}


