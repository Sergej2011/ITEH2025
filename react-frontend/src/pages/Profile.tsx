import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import { useNavigate } from 'react-router-dom'

interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  created_at: string
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [user, navigate])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/user')
      const userData = response.data || response
      setProfile(userData)
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      })
    } catch (error: any) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setErrors({})
      setSuccess('')
      
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }
      
      // Only include password fields if they're filled
      if (formData.current_password || formData.new_password) {
        updateData.current_password = formData.current_password
        updateData.new_password = formData.new_password
        updateData.new_password_confirmation = formData.new_password_confirmation
      }
      
      await apiService.put('/user', updateData)
      
      setSuccess('Profil je uspešno ažuriran!')
      setEditing(false)
      await fetchProfile() // Refresh profile data
      
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: 'Greška pri ažuriranju profila. Pokušajte ponovo.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { class: 'bg-danger', text: 'Administrator' },
      moderator: { class: 'bg-warning', text: 'Moderator' },
      user: { class: 'bg-primary', text: 'Korisnik' }
    }
    
    const config = roleConfig[role as keyof typeof roleConfig] || { class: 'bg-secondary', text: role }
    
    return (
      <span className={`badge ${config.class}`}>
        {config.text}
      </span>
    )
  }

  if (!user) {
    return null
  }

  if (loading && !profile) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
          <p className="mt-3 text-muted">Učitavanje profila...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title mb-0">
                  <i className="fas fa-user me-2"></i>
                  Moj profil
                </h2>
                {!editing && (
                  <button
                    className="btn btn-light"
                    onClick={() => setEditing(true)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Uredi profil
                  </button>
                )}
              </div>
            </div>
            <div className="card-body p-4">
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                  <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
              )}

              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {errors.general}
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Ime i prezime <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            {errors.name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Telefon</label>
                        <input
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Uloga</label>
                        <div className="form-control-plaintext">
                          {profile && getRoleBadge(profile.role)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />
                  
                  <h5 className="mb-3">Promena lozinke (opciono)</h5>
                  
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="current_password" className="form-label">Trenutna lozinka</label>
                        <input
                          type="password"
                          className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
                          id="current_password"
                          name="current_password"
                          value={formData.current_password}
                          onChange={handleInputChange}
                        />
                        {errors.current_password && (
                          <div className="invalid-feedback">
                            {errors.current_password}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="new_password" className="form-label">Nova lozinka</label>
                        <input
                          type="password"
                          className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                          id="new_password"
                          name="new_password"
                          value={formData.new_password}
                          onChange={handleInputChange}
                        />
                        {errors.new_password && (
                          <div className="invalid-feedback">
                            {errors.new_password}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="new_password_confirmation" className="form-label">Potvrdi novu lozinku</label>
                        <input
                          type="password"
                          className={`form-control ${errors.new_password_confirmation ? 'is-invalid' : ''}`}
                          id="new_password_confirmation"
                          name="new_password_confirmation"
                          value={formData.new_password_confirmation}
                          onChange={handleInputChange}
                        />
                        {errors.new_password_confirmation && (
                          <div className="invalid-feedback">
                            {errors.new_password_confirmation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Čuvanje...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Sačuvaj promene
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setEditing(false)
                        setErrors({})
                        setSuccess('')
                        fetchProfile()
                      }}
                      disabled={loading}
                    >
                      <i className="fas fa-times me-2"></i>
                      Otkaži
                    </button>
                  </div>
                </form>
              ) : (
                <div className="row">
                  <div className="col-md-6">
                    <h5>Osnovne informacije</h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Ime i prezime:</strong></td>
                          <td>{profile?.name}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{profile?.email}</td>
                        </tr>
                        <tr>
                          <td><strong>Telefon:</strong></td>
                          <td>{profile?.phone || 'Nije unet'}</td>
                        </tr>
                        <tr>
                          <td><strong>Uloga:</strong></td>
                          <td>{profile && getRoleBadge(profile.role)}</td>
                        </tr>
                        <tr>
                          <td><strong>Član od:</strong></td>
                          <td>{profile && new Date(profile.created_at).toLocaleDateString('sr-RS')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="col-md-6">
                    <h5>Akcije</h5>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setEditing(true)}
                      >
                        <i className="fas fa-edit me-2"></i>
                        Uredi profil
                      </button>
                      
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate('/change-password')}
                      >
                        <i className="fas fa-key me-2"></i>
                        Promeni lozinku
                      </button>
                      
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Odjavi se
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile