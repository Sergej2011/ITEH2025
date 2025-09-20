import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Product { 
  id: number
  title: string
  description: string
  price: number
  currency: string 
  image_path?: string
  status: string
  user?: {
    name: string
  }
  categories?: Array<{
    id: number
    name: string
  }>
}

interface ProductCardProps {
  product: Product
  showActions?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  deleting?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showActions = false, 
  onEdit, 
  onDelete,
  deleting = false
}) => {
  const { user } = useAuth()
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: currency === 'RSD' ? 'RSD' : 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card product-card h-100">
        {product.image_path ? (
          <img 
            src={product.image_path} 
            className="card-img-top product-image" 
            alt={product.title}
          />
        ) : (
          <div className="card-img-top product-image bg-light d-flex align-items-center justify-content-center">
            <i className="fas fa-image fa-3x text-muted"></i>
          </div>
        )}
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title product-title">{product.title}</h5>
          <p className="card-text product-description">{product.description}</p>
          
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="h4 text-primary product-price">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className={`badge ${
                product.status === 'active' ? 'bg-success' : 'bg-secondary'
              }`}>
                {product.status === 'active' ? 'Aktivan' : 'Neaktivan'}
              </span>
            </div>
            
            {product.user && (
              <p className="text-muted small mb-3">
                <i className="fas fa-user me-1"></i>
                Prodavac: {product.user.name}
              </p>
            )}
            
            {product.categories && product.categories.length > 0 && (
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-1">
                  {product.categories.map((category) => (
                    <span key={category.id} className="badge bg-secondary small">
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="d-flex gap-2">
              <Link 
                to={`/products/${product.id}`} 
                className="btn btn-primary btn-sm flex-fill"
              >
                <i className="fas fa-eye me-1"></i>
                Pogledaj
              </Link>
              
              {showActions && (
                <>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => onEdit?.(product)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onDelete?.(product)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </>
              )}
              
              {/* Admin dugme za brisanje - prikazuje se samo admin korisnicima */}
              {user?.role === 'admin' && !showActions && (
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onDelete?.(product)}
                  disabled={deleting}
                  title="Obriši proizvod (samo admin)"
                >
                  {deleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Brisanje...
                    </>
                  ) : (
                    <i className="fas fa-trash"></i>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
