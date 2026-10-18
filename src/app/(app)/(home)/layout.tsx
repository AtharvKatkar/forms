import React from 'react'

import HomeHeader from '@/features/home/components/home-header'

interface HomeLayoutProps {
    children: React.ReactNode
}

function HomeLayout({
    children
}: HomeLayoutProps) {
  return (
    <div className='flex flex-col min-h-screen'>
        <HomeHeader />
        <main className='flex-1'>
        {children}
        </main>
    </div>
  )
}

export default HomeLayout