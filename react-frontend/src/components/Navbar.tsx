import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar: React.FC = () => { 
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Zatvori dropdown kada se klikne van njega
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-shopping-cart me-2"></i>
          C2C E-commerce
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>
                Početna
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <i className="fas fa-box me-1"></i>
                Proizvodi
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    <i className="fas fa-shopping-bag me-1"></i>
                    Porudžbine
                  </Link>
                </li>
                {(user.role === 'admin' || user.role === 'moderator') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/products/new">
                      <i className="fas fa-plus me-1"></i>
                      Dodaj proizvod
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown" ref={dropdownRef}>
                <button 
                  className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ border: 'none', background: 'none' }}
                >
                  <i className="fas fa-user me-1"></i>
                  {user.name}
                </button>
                {isDropdownOpen && (
                  <ul className="dropdown-menu show" style={{ position: 'absolute', right: 0, left: 'auto' }}>
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <i className="fas fa-user-cog me-2"></i>
                        Profil
                      </Link>
                    </li>
                           <li>
                             <Link 
                               className="dropdown-item" 
                               to="/change-password"
                               onClick={() => setIsDropdownOpen(false)}
                             >
                               <i className="fas fa-key me-2"></i>
                               Promeni lozinku
                             </Link>
                           </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => {
                          setIsDropdownOpen(false)
                          handleLogout()
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Odjavi se
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Prijavi se
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="fas fa-user-plus me-1"></i>
                    Registruj se
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
