import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-light text-gray-400">© {new Date().getFullYear()} BeyondMedium. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://beyondmedium.com" className="text-sm font-light text-gray-400 hover:text-white">
              beyondmedium.com
            </a>
            <a href="mailto:connect@beyondmedium.com" className="text-sm font-light text-gray-400 hover:text-white">
              Email
            </a>
            <a href="#" className="text-sm font-light text-gray-400 hover:text-white">
              Berlin
            </a>
            <Link href="/admin/login" className="text-xs font-light text-gray-600 hover:text-gray-400">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

