import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../services/api'
import CurrencyConverter from '../components/CurrencyConverter'

const Home: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Simulacija statističkih podataka
      setStats({
        totalProducts: 150,
        totalUsers: 89,
        totalOrders: 234
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h1 className="display-4 fw-bold mb-4">
                Kupuj i Prodaj Online
              </h1>
              <p className="lead mb-4">
                Najveća platforma za kupovinu i prodaju u Srbiji. 
                Pronađi ono što tražiš ili prodaј ono što ne koristiš.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/products" className="btn btn-light btn-lg">
                  <i className="fas fa-search me-2"></i>
                  Pretraži Proizvode
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-user-plus me-2"></i>
                  Registruj se
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Currency Converter Section */}
      <section className="py-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Zašto odabrati nas?</h2>
              <p className="lead text-muted">
                Pružamo vam sve što vam treba za uspešnu kupovinu i prodaju
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h4>Sigurnost</h4>
                <p className="text-muted">
                  Svi transakcije su sigurne i zaštićene. Vaši podaci su u bezbednim rukama.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h4>Mobilna aplikacija</h4>
                <p className="text-muted">
                  Kupuj i prodaj bilo gde, bilo kada. Naša aplikacija radi na svim uređajima.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fas fa-headset"></i>
                </div>
                <h4>24/7 Podrška</h4>
                <p className="text-muted">
                  Naš tim je uvek tu da vam pomogne. Kontaktirajte nas bilo kada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Naši brojevi</h2>
              <p className="lead text-muted">
                Brojke koje govore o našem uspehu
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="stat-item">
                <span className="stat-number">{stats.totalProducts}</span>
                <div className="stat-label">Aktivnih proizvoda</div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="stat-item">
                <span className="stat-number">{stats.totalUsers}</span>
                <div className="stat-label">Registrovanih korisnika</div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="stat-item">
                <span className="stat-number">{stats.totalOrders}</span>
                <div className="stat-label">Uspešnih transakcija</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3">
                Spremni da počnete?
              </h2>
              <p className="lead mb-4">
                Registrujte se danas i počnite da kupujete ili prodajete
              </p>
              <Link to="/register" className="btn btn-light btn-lg">
                <i className="fas fa-rocket me-2"></i>
                Registruj se besplatno
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
