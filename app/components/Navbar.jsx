import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full h-[10vh] fixed bg-white z-50 flex items-center justify-between px-5'>
      <h1>Impuls</h1>
      <ul className='flex items-center gap-5'>
        <li><Link href="/">Dashbiard</Link></li>
        <li><Link href="/barcha-jixozlar">Barcha jixozlar</Link></li>
        <li><Link href="/binolar">Binolar</Link></li>
        <li><Link href="/sozlamalar">Sozlamalar</Link></li>
      </ul>
    </div>
  )
}

export default Navbar