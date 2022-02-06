import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  // console.log('nav');

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <Link className='navbar-brand' to='/'>Navbar</Link>

      <button
        className='navbar-toggler'
        type='button'
        data-mdb-toggle='collapse'
        data-mdb-target='#navbarTogglerDemo03'
        aria-controls='navbarTogglerDemo03'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <i className='fas fa-bars' />
      </button>

      <div className='collapse navbar-collapse' id='navbarTogglerDemo03'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item'>
            <Link className='nav-link' to='/login'>Login</Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/register'>Register</Link>
          </li>
        </ul>

        <div className="ml-auto">
          <form className="form-inline my-2 my-lg-0" >
            <input
              type='search'
              className='form-control'
              placeholder='Type query'
              aria-label='Search'
            />
            <button
              className='btn btn-outline-primary'
              type='button'
              data-mdb-ripple-color='dark'
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
