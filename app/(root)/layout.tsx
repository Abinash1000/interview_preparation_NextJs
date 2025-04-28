import { isAuthenticated, logout } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const RootLayout = async ({children}: {children: ReactNode}) => {
  const isUserAuthencited = await isAuthenticated();
  
  if (!isUserAuthencited) redirect('/sign-in')
  
  return (
    <div className='root-layout'>
      <nav className='flex items-center justify-between p-4 border-b'>
        <Link href="/" className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='Logo' width={38} height={32}/>
          <h2 className='text-primary-100 max-sm:text-xl'>Interview Preparation</h2>
        </Link>
        
        <form action={async () => {
          'use server'
          await logout();
          redirect('/sign-in');
        }}>
          <Button 
            type="submit" 
            variant="ghost" 
            className="flex items-center gap-2 hover:bg-red-50 cursor-pointer outline-red-500"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span className="text-red-500">Sign out</span>
          </Button>
        </form>
      </nav>
      
      <main>
        {children}
      </main>
    </div> 
  )
}

export default RootLayout