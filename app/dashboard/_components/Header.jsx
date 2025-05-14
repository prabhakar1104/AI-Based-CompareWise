"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BestChoice<span className="text-xs align-super bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full ml-1">AI</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className={`transition-colors flex items-center px-3 py-2 ${pathname === '/' ? 'text-white' : 'text-white/80 hover:text-white'}`}
          >
            <span className="mr-2">🏠</span>
            <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 after:transition-all after:duration-300 hover:after:w-full">
              Home
            </span>
          </Link>
          <Link 
            href="/dashboard" 
            className={`transition-colors flex items-center px-3 py-2 ${pathname === '/dashboard' ? 'text-white' : 'text-white/80 hover:text-white'}`}
          >
            <span className="mr-2">📊</span>
            <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 after:transition-all after:duration-300 hover:after:w-full">
              Dashboard
            </span>
          </Link>
          <Link 
            href="/how-it-works" 
            className={`transition-colors flex items-center px-3 py-2 ${pathname === '/how-it-works' ? 'text-white' : 'text-white/80 hover:text-white'}`}
          >
            <span className="mr-2">🤖</span>
            <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 after:transition-all after:duration-300 hover:after:w-full">
              How It Works
            </span>
          </Link>
        </nav>

        {/* User Controls */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            className="hidden md:flex bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
            asChild
          >
            <Link href="/dashboard">Try AI Demo</Link>
          </Button>
          <UserButton appearance={{
            elements: {
              userButtonAvatarBox: "h-8 w-8",
              userButtonOuterIdentifier: "text-white/90"
            }
          }} />
        </div>
      </div>
    </header>
  )
}