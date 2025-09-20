import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'

interface Product {
  id: number
  title: string
  description: string
  price: number
  currency: string 
  image_path?: string
  status: string
  user?: {
    id: number
    name: string
    email: string
    phone?: string
  }
  categories?: Array<{
    id: number
    name: string
  }>
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [messageForm, setMessageForm] = useState({
    subject: '',
    body: ''
  })
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageSuccess, setMessageSuccess] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiService.get(`/products/${id}`)
      setProduct(response.data || response)
    } catch (error: any) {
      console.error('Failed to fetch product:', error)
      setError('Greška pri učitavanju proizvoda')
    } finally {
      setLoading(false)
    }
  }

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      navigate('/login')
      return
    }

    if (!product || !messageForm.subject.trim() || !messageForm.body.trim()) {
      return
    }

    try {
      setSendingMessage(true)
      setMessageSuccess(false)
      
      await apiService.post('/messages', {
        receiver_id: product.user?.id,
        product_id: product.id,
        subject: messageForm.subject,
        body: messageForm.body
      })
      
      setMessageSuccess(true)
      setMessageForm({ subject: '', body: '' })
      
    } catch (error: any) {
      console.error('Failed to send message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (product?.user) {
      setMessageForm({
        subject: `Pitanje o proizvodu: ${product.title}`,
        body: ''
      })
    }
  }

  const handleCreateOrder = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!product) return

    try {
      await apiService.createOrder({
        product_id: product.id,
        notes: `Porudžbina proizvoda: ${product.title}`
      })
      
      alert('Porudžbina je uspešno kreirana!')
      navigate('/orders')
    } catch (error: any) {
      console.error('Failed to create order:', error)
      alert('Greška pri kreiranju porudžbine: ' + (error.message || 'Nepoznata greška'))
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
          <p className="mt-3 text-muted">Učitavanje proizvoda...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-4x text-warning mb-3"></i>
          <h3 className="text-muted">Proizvod nije pronađen</h3>
          <p className="text-muted">{error || 'Greška pri učitavanju proizvoda'}</p>
          <Link to="/products" className="btn btn-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Nazad na proizvode
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Početna</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/products">Proizvodi</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-6">
                  {product.image_path ? (
                    <img
                      src={`/storage/${product.image_path}`}
                      alt={product.title}
                      className="img-fluid rounded"
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                      <i className="fas fa-image fa-4x text-muted"></i>
                    </div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <h1 className="h2 mb-3">{product.title}</h1>
                  
                  <div className="mb-3">
                    <span className={`badge fs-6 ${
                      product.status === 'active' ? 'bg-success' :
                      product.status === 'sold' ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {product.status === 'active' ? 'Aktivan' :
                       product.status === 'sold' ? 'Prodat' : 'Neaktivan'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-primary">
                      {product.price.toLocaleString()} {product.currency}
                    </h3>
                  </div>

                  {product.categories && product.categories.length > 0 && (
                    <div className="mb-4">
                      <h6>Kategorije:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {product.categories.map((category) => (
                          <span key={category.id} className="badge bg-light text-dark">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="d-grid gap-2">
                    {product.status === 'active' && user && user.id !== product.user?.id && (
                      <button
                        className="btn btn-success btn-lg"
                        onClick={handleCreateOrder}
                      >
                        <i className="fas fa-shopping-cart me-2"></i>
                        Kupi proizvod
                      </button>
                    )}
                    
                    {product.status === 'active' && (
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={handleContactSeller}
                      >
                        <i className="fas fa-envelope me-2"></i>
                        Kontaktiraj prodavca
                      </button>
                    )}
                    
                    <Link to="/products" className="btn btn-outline-secondary">
                      <i className="fas fa-arrow-left me-2"></i>
                      Nazad na proizvode
                    </Link>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <h4>Opis proizvoda</h4>
                <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-user me-2"></i>
                Informacije o prodavcu
              </h5>
            </div>
            <div className="card-body">
              {product.user ? (
                <>
                  <h6>{product.user.name}</h6>
                  <p className="text-muted small mb-2">{product.user.email}</p>
                  {product.user.phone && (
                    <p className="text-muted small mb-3">
                      <i className="fas fa-phone me-1"></i>
                      {product.user.phone}
                    </p>
                  )}
                  
                  {user && user.id !== product.user.id && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleContactSeller}
                    >
                      <i className="fas fa-envelope me-1"></i>
                      Pošalji poruku
                    </button>
                  )}
                </>
              ) : (
                <p className="text-muted">Informacije o prodavcu nisu dostupne</p>
              )}
            </div>
          </div>

          {user && product.user && user.id !== product.user.id && (
            <div className="card shadow mt-3">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-envelope me-2"></i>
                  Pošalji poruku
                </h5>
              </div>
              <div className="card-body">
                {messageSuccess && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    Poruka je uspešno poslata!
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                  </div>
                )}

                <form onSubmit={handleMessageSubmit}>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Tema</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      value={messageForm.subject}
                      onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Tema poruke"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="body" className="form-label">Poruka</label>
                    <textarea
                      className="form-control"
                      id="body"
                      rows={4}
                      value={messageForm.body}
                      onChange={(e) => setMessageForm(prev => ({ ...prev, body: e.target.value }))}
                      placeholder="Vaša poruka..."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={sendingMessage}
                  >
                    {sendingMessage ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Slanje...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Pošalji poruku
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail