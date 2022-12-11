import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ThemeToggleButton } from '../ThemeToggleButton'

const navlinks = [
  { label: 'Home', href: '/', routeIdentifier: '/' },
  { label: 'Upload/Retrieve', href: '/input', routeIdentifier: '/input' },
  { label: 'Sample', href: '/result/123', routeIdentifier: '/result' },
]

const NavLink = ({ label, href, routeIdentifier }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const inactiveLinkStyle = "block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 cursor-pointer";
  const activeLinkStyle = "block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white cursor-pointer";

  return (
    <div 
      onClick={() => navigate(href)}
      className={location.pathname === routeIdentifier ||
        (href !== '/' && location.pathname.includes(routeIdentifier)) ?
          activeLinkStyle :
          inactiveLinkStyle} 
      aria-current="page">
      {label}
    </div>
  )
}

const Navbar = () => {
  // const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  let drawerIsOpen = false;
  
  const toggleDrawer = (close) => {
    // document.getElementbyId must be inside this function to get the element after the component is mounted
    const drawer = document.getElementById('navbar-sticky');

    if (close === true || drawerIsOpen) {
      drawer.classList.add('hidden');
      // setDrawerIsOpen(false);
      drawerIsOpen = false;
    } else {
      drawer.classList.remove('hidden');
      // setDrawerIsOpen(true);
      drawerIsOpen = true;
    }

  }

  return (
    <nav id="navbar" className="bg-transparent backdrop-blur px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b border-gray-400 dark:border-gray-600">
      <div id="container" className="container flex flex-wrap items-center justify-between mx-auto">
        <a id="logo" href="/" className="flex items-center">
            <img src="/favicon.ico" className="h-6 mr-3 sm:h-9" alt="Flowbite Logo" />
            <span id="title" className="self-center text-xl font-bold whitespace-nowrap dark:text-teal-500">VidAssembly</span>
        </a>
        <div className="flex md:order-2">
          {/* <div> needed to maintain ThemeToggleButton styling */}
          <div id='theme-toggle-button'>
            {/* need the following line of code to fix the ui bug of opening the navbar drawer in light mode removing the ThemeToggleButton */}
            <ThemeToggleButton />
          </div>
          
          {/* Hamburger Menu Icon */}
          <button
            data-collapse-toggle="navbar-sticky" 
            type="button" 
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
            aria-controls="navbar-sticky" 
            aria-expanded="false"
            onClick={toggleDrawer}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        {/* Links */}
        <div className="items-center justify-between w-full md:flex md:w-auto md:order-1 hidden" id="navbar-sticky">
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-sky-100 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navlinks.map(navlink => (
              <li key={navlink.label} onClick={() => toggleDrawer(true)}>
                <NavLink label={navlink.label} href={navlink.href} routeIdentifier={navlink.routeIdentifier} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar