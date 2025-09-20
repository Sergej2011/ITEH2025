import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { changePassword } = useAuth()
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
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Nova lozinka i potvrda lozinke se ne poklapaju')
      return
    }

    if (formData.newPassword.length < 8) {
      setError('Nova lozinka mora imati najmanje 8 karaktera')
      return
    }

    setLoading(true)

    try {
      const success = await changePassword(formData.currentPassword, formData.newPassword)
      if (success) {
        setSuccess('Lozinka je uspešno promenjena!')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          navigate('/profile')
        }, 2000)
      } else {
        setError('Greška pri promeni lozinke. Proverite trenutnu lozinku.')
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
                  <i className="fas fa-key me-2 text-primary"></i>
                  Promeni lozinku
                </h2>
                <p className="text-muted">Unesite trenutnu lozinku i novu lozinku</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">
                    <i className="fas fa-lock me-1"></i>
                    Trenutna lozinka
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    placeholder="Unesite trenutnu lozinku"
                    autoComplete="current-password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    <i className="fas fa-key me-1"></i>
                    Nova lozinka
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Unesite novu lozinku"
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    <i className="fas fa-key me-1"></i>
                    Potvrdi novu lozinku
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Potvrdite novu lozinku"
                    autoComplete="new-password"
                    minLength={8}
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
                        Menjanje lozinke...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-key me-2"></i>
                        Promeni lozinku
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/profile')}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Nazad na profil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
