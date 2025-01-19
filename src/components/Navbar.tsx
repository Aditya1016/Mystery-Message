'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'
const Navbar = () => {
    const { data: session } = useSession()

    const user: User = session?.user

  return (
    <nav className='p-4 md:p-6 shadow-md bg-slate-200'>
        <div className='container mx-auto flex flex-col md:flex-row items-center justify-between'>
            <a className='text-xl font-bold mb-4 md:mb-0 font-sans' href="#">Mystery Message</a>
            {
                session ? (
                    <div className='flex items-center'>
                        <span className='mr-4 font-mono'> Welcome {user?.username || user?.email}</span>
                        <button className='w-4 md:w-auto font-serif' onClick={() => signOut()}>Sign Out</button>
                    </div>
                ) : (
                    <div>
                        <Link className='w-full md:w-auto font-mono' href="/sign-in">Sign In</Link>
                    </div>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar