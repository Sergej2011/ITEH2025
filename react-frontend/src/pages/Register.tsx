import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
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
    setSuccess('')

    // Validacija
    if (formData.password !== formData.password_confirmation) {
      setError('Lozinke se ne poklapaju')
      return
    }

    if (formData.password.length < 8) {
      setError('Lozinka mora imati najmanje 8 karaktera')
      return
    }

    setLoading(true)

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone || undefined
      )
      setSuccess('Uspešno ste se registrovali! Preusmeravanje...')
      setTimeout(() => navigate('/'), 2000)
    } catch (error: any) {
      console.error('Registration error:', error)
      setError(error.message || 'Došlo je do greške. Pokušajte ponovo.')
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
                <i className="fas fa-user-plus me-2 text-primary"></i>
                Registruj se
              </h2>
              <p className="text-muted">Kreiraj svoj nalog i počni da kupuješ/prodaješ</p>
            </div>
 
            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <i className="fas fa-exclamation-triangle me-3"></i>
                <div>
                  <strong>Greška:</strong> {error}
                </div>
              </div>
            )}
 
            {success && (
              <div className="alert alert-success d-flex align-items-center" role="alert">
                <i className="fas fa-check-circle me-3"></i>
                <div>
                  <strong>Uspeh:</strong> {success}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <i className="fas fa-user me-1"></i>
                  Ime i prezime
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Unesite ime i prezime"
                />
              </div>

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
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <i className="fas fa-phone me-1"></i>
                  Telefon (opciono)
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+381 60 123 4567"
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
                  placeholder="Najmanje 8 karaktera"
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password_confirmation" className="form-label">
                  <i className="fas fa-lock me-1"></i>
                  Potvrdi lozinku
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  placeholder="Ponovite lozinku"
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
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registracija...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>
                      Registruj se
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted">
                Već imaš nalog?{' '}
                <Link to="/login" className="text-primary fw-bold">
                  Prijavi se ovde
                </Link>
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
