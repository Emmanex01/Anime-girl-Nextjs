import React from 'react'
import { Navbar } from './Navbar'
import { getMenu } from '@/lib/shopify';

const NavbarWrapper = async () => {
    const navLinks = await getMenu("main-menu");
  return (
    <div>
      <Navbar navLinks={navLinks} />
    </div>
  )
}

export default NavbarWrapper
