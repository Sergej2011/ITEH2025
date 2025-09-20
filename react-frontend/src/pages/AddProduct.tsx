import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
 
interface Category {
  id: number
  name: string
}

const AddProduct: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'RSD',
    status: 'active',
    category_ids: [] as number[]
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCategories()
  }, [user, navigate])

  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/categories')
      setCategories(response.data || response || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }))
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Naslov je obavezan'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Naslov mora imati najmanje 3 karaktera'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Opis je obavezan'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Opis mora imati najmanje 10 karaktera'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Cena mora biti veća od 0'
    }

    if (formData.category_ids.length === 0) {
      newErrors.categories = 'Morate izabrati najmanje jednu kategoriju'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setSuccess(false)
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      }

      await apiService.post('/products', productData)
      
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'RSD',
        status: 'active',
        category_ids: []
      })
      
      // Redirect to products page after 2 seconds
      setTimeout(() => {
        navigate('/products')
      }, 2000)
      
    } catch (error: any) {
      console.error('Failed to create product:', error)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: 'Greška pri kreiranju proizvoda. Pokušajte ponovo.' })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="page-container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">
                <i className="fas fa-plus me-2"></i>
                Dodaj novi proizvod
              </h2>
            </div>
            <div className="card-body p-4">
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Proizvod je uspešno kreiran! Preusmjeravamo vas na stranicu proizvoda...
                  <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
              )}

              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Naslov proizvoda <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Unesite naslov proizvoda"
                      />
                      {errors.title && (
                        <div className="invalid-feedback">
                          {errors.title}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Aktivan</option>
                        <option value="sold">Prodat</option>
                        <option value="inactive">Neaktivan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Opis proizvoda <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detaljno opišite vaš proizvod..."
                  />
                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">
                        Cena <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <div className="invalid-feedback">
                          {errors.price}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="currency" className="form-label">Valuta</label>
                      <select
                        className="form-select"
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                      >
                        <option value="RSD">RSD (Dinar)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="USD">USD (Dolar)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Kategorije <span className="text-danger">*</span>
                  </label>
                  {errors.categories && (
                    <div className="text-danger small mb-2">
                      {errors.categories}
                    </div>
                  )}
                  <div className="row">
                    {categories.map((category) => (
                      <div key={category.id} className="col-md-6 col-lg-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={formData.category_ids.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                          />
                          <label className="form-check-label" htmlFor={`category-${category.id}`}>
                            {category.name}
                          </label>
                        </div>
                      </div>
                    ))}
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
                        Kreiranje...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Kreiraj proizvod
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/products')}
                    disabled={loading}
                  >
                    <i className="fas fa-times me-2"></i>
                    Otkaži
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProduct