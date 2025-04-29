import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'

const RootLayout = async ({ children }: { children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();

  if(!isUserAuthenticated) redirect('/sign-in');
  
  return (
    <div className='root-layout'>
      <nav className='flex justify-between items-center'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='logo' width={38} height={32}/>
          <h2 className='text-primary-100'>MockAI</h2>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 text-primary-100 text-lg font-medium">
          <Link href='/' className="hover:text-primary-500 transition">Home</Link>
          <Link href='/dsa' className="hover:text-primary-500 transition">Practice DSA</Link>
          <Link href='/resume-builder' className="hover:text-primary-500 transition">Resume Builder</Link>
          <Link href='/profile' className="hover:text-primary-500 transition">Profile</Link>
        </div>
      </nav>
      { children }
    </div>
  )
}

export default RootLayout