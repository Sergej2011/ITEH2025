import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        navigate('/')
      } else {
        setError('Neispravni podaci za prijavu')
      }
    } catch (error) {
      setError('Došlo je do greške. Pokušajte ponovo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="auth-form">
              <div className="text-center mb-4">
                <h2 className="fw-bold">
                  <i className="fas fa-sign-in-alt me-2 text-primary"></i>
                  Prijavi se
                </h2>
                <p className="text-muted">Dobrodošli nazad! Unesite svoje podatke za prijavu.</p>
              </div>
 
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )} 

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <i className="fas fa-envelope me-1"></i>
                  Email adresa
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="unesite@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <i className="fas fa-lock me-1"></i>
                  Lozinka
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Unesite lozinku"
                  autoComplete="current-password"
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Prijavljivanje...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Prijavi se
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted mb-2">
                Nemaš nalog?
              </p>
              <Link to="/register" className="btn btn-outline-primary">
                <i className="fas fa-user-plus me-2"></i>
                Registruj se ovde
              </Link>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
