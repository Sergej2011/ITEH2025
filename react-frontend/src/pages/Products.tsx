import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import { apiService } from '../services/api'
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

const Products: React.FC = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleting, setDeleting] = useState<number | null>(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    minPrice: '',
    maxPrice: '',
    categoryId: '',
    sortBy: 'created_at',
    sortDir: 'desc'
  })
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    console.log('Fetching products due to dependency change')
    fetchProducts()
  }, [currentPage, searchQuery, filters])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(filters.status && { status: filters.status }),
        ...(filters.minPrice && { min_price: filters.minPrice }),
        ...(filters.maxPrice && { max_price: filters.maxPrice }),
        ...(filters.categoryId && { category_id: filters.categoryId }),
        sort_by: filters.sortBy,
        sort_dir: filters.sortDir
      })
      
      const response = await apiService.get(`/products?${params}`) as any
      console.log('Products response:', response) // Debug log
      setProducts(response.data || response || [])
      setTotalPages(response.last_page || response.total_pages || 1)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/categories') as any
      setCategories(response.data || response || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      minPrice: '',
      maxPrice: '',
      categoryId: '',
      sortBy: 'created_at',
      sortDir: 'desc'
    })
    setCurrentPage(1)
  }

  const handleDeleteProduct = async (product: Product) => {
    if (!user || user.role !== 'admin') {
      alert('Samo admin može da briše proizvode!')
      return
    }

    if (!confirm(`Da li ste sigurni da želite da obrišete proizvod "${product.title}"?`)) {
      return
    }

    try {
      setDeleting(product.id)
      await apiService.deleteProduct(product.id)
      
      // Ukloni proizvod iz liste
      setProducts(prev => prev.filter(p => p.id !== product.id))
      
      // Ažuriraj totalPages ako je potrebno
      setTotalPages(() => {
        const remainingProducts = products.length - 1
        const productsPerPage = 12
        return Math.ceil(remainingProducts / productsPerPage)
      })
      
      console.log('Product deleted successfully')
      alert('Proizvod je uspešno obrisan!')
    } catch (error: any) {
      console.error('Failed to delete product:', error)
      alert('Greška pri brisanju proizvoda: ' + (error.message || 'Nepoznata greška'))
    } finally {
      setDeleting(null)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="products-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-5">
            <h1 className="display-5 fw-bold">
              <i className="fas fa-box me-2 text-primary"></i>
              Proizvodi
            </h1>
            <p className="lead text-muted">Pregledajte sve dostupne proizvode</p>
          </div>

          {/* Search Bar and Filters */}
          <div className="row mb-4">
            <div className="col-lg-6">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="col-lg-6 text-end">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="fas fa-filter me-2"></i>
                {showFilters ? 'Sakrij filtere' : 'Prikaži filtere'}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="fas fa-filter me-2"></i>
                  Filteri i sortiranje
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {/* Status Filter */}
                  <div className="col-md-3">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">Svi statusi</option>
                      <option value="active">Aktivni</option>
                      <option value="sold">Prodat</option>
                      <option value="inactive">Neaktivan</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div className="col-md-3">
                    <label className="form-label">Kategorija</label>
                    <select 
                      className="form-select"
                      value={filters.categoryId}
                      onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                    >
                      <option value="">Sve kategorije</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="col-md-3">
                    <label className="form-label">Minimalna cena</label>
                    <input 
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Maksimalna cena</label>
                    <input 
                      type="number"
                      className="form-control"
                      placeholder="∞"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>

                  {/* Sorting */}
                  <div className="col-md-4">
                    <label className="form-label">Sortiraj po</label>
                    <select 
                      className="form-select"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="created_at">Datum kreiranja</option>
                      <option value="price">Cena</option>
                      <option value="title">Naslov</option>
                      <option value="status">Status</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Poredak</label>
                    <select 
                      className="form-select"
                      value={filters.sortDir}
                      onChange={(e) => handleFilterChange('sortDir', e.target.value)}
                    >
                      <option value="desc">Opadajući</option>
                      <option value="asc">Rastući</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="col-md-4 d-flex align-items-end">
                    <button 
                      className="btn btn-outline-danger w-100"
                      onClick={clearFilters}
                    >
                      <i className="fas fa-times me-2"></i>
                      Obriši filtere
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Učitavanje...</span>
              </div>
              <p className="mt-3 text-muted">Učitavanje proizvoda...</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <>
              {products.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
                  <h3 className="text-muted">Nema proizvoda</h3>
                  <p className="text-muted">
                    {searchQuery 
                      ? 'Nema rezultata za vašu pretragu' 
                      : 'Još nema proizvoda. Budite prvi koji će dodati proizvod!'
                    }
                  </p>
                  {!searchQuery && (
                    <Link to="/products/new" className="btn btn-primary">
                      <i className="fas fa-plus me-2"></i>
                      Dodaj prvi proizvod
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="row">
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        onDelete={handleDeleteProduct}
                        deleting={deleting === product.id}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav className="mt-5">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
