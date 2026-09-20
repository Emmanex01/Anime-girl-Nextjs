import AccountMenuServer from '../account/account-menu-wrapper';
import { Navbar } from './Navbar'
import { getMenu } from '@/lib/shopify';

const NavbarWrapper = async () => {
    const navLinks = await getMenu("main-menu");
  return (
    <div className="bg-yellow-300">
      <Navbar navLinks={navLinks} accountMenu={<AccountMenuServer />} />
    </div>
  )
}

export default NavbarWrapper
