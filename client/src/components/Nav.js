import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { auth } from '../firebase';
import Search from './Search';

const Nav = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;

  const logout = (e) => {
    e.preventDefault();
    auth.signOut();
    dispatch({
      type: 'LOGGED_IN_USER',
      payload: null,
    });
    history.push('/login');
  };

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
            <Link className='nav-link' to='/users'>Users</Link>
          </li>

          {!user && (
            <>
              <li className='nav-item'>
                <Link className='nav-link' to='/login'>Login</Link>
              </li>

              <li className='nav-item'>
                <Link className='nav-link' to='/register'>Register</Link>
              </li>
            </>)}

          {user && (
            <>
              <li className='nav-item'>
                <Link className='nav-link' to='/profile'>{user && user.email.split('@')[0]}</Link>
              </li>

              <li className='nav-item'>
                <a href='/logout' className='nav-link' onClick={e => logout(e)}>Logout</a>
              </li>
            </>)}
        </ul>

        <div className="ml-auto">
          <Search />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
