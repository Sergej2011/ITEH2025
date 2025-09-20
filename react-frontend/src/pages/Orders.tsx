import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import { Link } from 'react-router-dom'

interface Order {
  id: number
  status: string
  total_amount: number
  total_in_rsd: number
  currency: string
  notes?: string
  created_at: string
  product: {
    id: number
    title: string
    price: number
    image_path?: string
  }
  buyer?: {
    id: number
    name: string
    email: string
  }
  seller?: {
    id: number
    name: string
    email: string
  }
}

const Orders: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await apiService.getMyOrders()
      setOrders(response.data || response || [])
    } catch (error: any) {
      console.error('Failed to fetch orders:', error)
      setError('Greška pri učitavanju porudžbina')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Na čekanju' },
      confirmed: { class: 'bg-info', text: 'Potvrđena' },
      shipped: { class: 'bg-primary', text: 'Poslata' },
      delivered: { class: 'bg-success', text: 'Dostavljena' },
      cancelled: { class: 'bg-danger', text: 'Otkazana' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { class: 'bg-secondary', text: status }
    
    return (
      <span className={`badge ${config.class}`}>
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-4x text-muted mb-3"></i>
          <h3 className="text-muted">Potrebna prijava</h3>
          <p className="text-muted">Morate biti prijavljeni da biste videli svoje porudžbine.</p>
          <Link to="/login" className="btn btn-primary">
            <i className="fas fa-sign-in-alt me-2"></i>
            Prijavi se
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 fw-bold">
              <i className="fas fa-shopping-cart me-2 text-primary"></i>
              Moje porudžbine
            </h1>
          </div>


          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Učitavanje...</span>
              </div>
              <p className="mt-3 text-muted">Učitavanje porudžbina...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && (
            <>
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                  <h3 className="text-muted">Nema porudžbina</h3>
                  <p className="text-muted">
                    Još nema porudžbina.
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <Link to="/products" className="btn btn-primary">
                      <i className="fas fa-search me-2"></i>
                      Pretraži proizvode
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {orders.map((order) => (
                    <div key={order.id} className="col-lg-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="card-title mb-0">
                              <Link to={`/products/${order.product.id}`} className="text-decoration-none">
                                {order.product.title}
                              </Link>
                            </h5>
                            {getStatusBadge(order.status)}
                          </div>

                          <div className="row mb-3">
                            <div className="col-6">
                              <small className="text-muted">Proizvod:</small>
                              <div className="d-flex align-items-center">
                                {order.product.image_path ? (
                                  <img
                                    src={`/storage/${order.product.image_path}`}
                                    alt={order.product.title}
                                    className="me-2"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div className="bg-light me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <i className="fas fa-image text-muted"></i>
                                  </div>
                                )}
                                <div>
                                  <div className="fw-bold">{order.product.title}</div>
                                  <small className="text-muted">
                                    {order.product.price.toLocaleString()} {order.currency}
                                  </small>
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-6">
                              <small className="text-muted">Ukupno:</small>
                              <div className="h5 text-primary mb-0">
                                {order.total_amount.toLocaleString()} {order.currency}
                              </div>
                              {order.total_in_rsd && order.currency !== 'RSD' && (
                                <small className="text-muted">
                                  ≈ {order.total_in_rsd.toLocaleString()} RSD
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-6">
                              <small className="text-muted">Kupac:</small>
                              <div>{order.buyer?.name || 'N/A'}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Prodavac:</small>
                              <div>{order.seller?.name || 'N/A'}</div>
                            </div>
                          </div>

                          {order.notes && (
                            <div className="mb-3">
                              <small className="text-muted">Napomene:</small>
                              <div className="text-muted small">{order.notes}</div>
                            </div>
                          )}

                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              <i className="fas fa-calendar me-1"></i>
                              {formatDate(order.created_at)}
                            </small>
                            
                            <div className="btn-group btn-group-sm">
                              <Link
                                to={`/products/${order.product.id}`}
                                className="btn btn-outline-primary"
                              >
                                <i className="fas fa-eye me-1"></i>
                                Proizvod
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders