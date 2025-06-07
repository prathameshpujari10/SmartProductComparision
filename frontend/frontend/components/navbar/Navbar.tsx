"use client"

import { useSpring, animated, config } from 'react-spring'
import { Button } from "@/components/ui/button"
import Link from 'next/link'



export default function Navbar() {
  const logoAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.wobbly,
  })
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <animated.h1  className="text-2xl font-bold text-blue-400">
          SmartProduct
          </animated.h1>
          <div className="flex space-x-4">
          <Link href="/">
            <Button variant="ghost" className="text-gray-300 hover:text-gray-900 hover:bg-white">Home</Button>
          </Link>
          <Link href="/about" passHref>  
            <Button variant="ghost" className="text-gray-300 hover:text-gray-900 hover:bg-white">About</Button>
          </Link>
          <Link href="/contact" passHref>
            <Button variant="ghost" className="text-gray-300 hover:text-gray-900 hover:bg-white">Contact</Button>
          </Link>
          </div>
        </nav>
      </header>

    
    </div>
  )
}

