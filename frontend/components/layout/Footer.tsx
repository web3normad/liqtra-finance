import Link from 'next/link'
export function Footer() {
  return (
    <footer className="bg-card border-t border-gray-800 py-6 px-6">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <p className="text-gray-400 text-sm">
            © 2025 Liqtra Finance. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/docs" className="text-gray-400 hover:text-white text-sm transition-colors">
              Docs
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <p className="text-gray-500 text-xs">
            Built with ❤️ on Ethereum
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}