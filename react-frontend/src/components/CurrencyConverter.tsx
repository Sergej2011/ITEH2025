import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'

interface CurrencyConverterProps {
  onConvert?: (convertedPrice: number, currency: string) => void
  initialAmount?: number
  initialCurrency?: string
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  onConvert,
  initialAmount = 1000,
  initialCurrency = 'RSD'
}) => {
  const [amount, setAmount] = useState(initialAmount.toString())
  const [fromCurrency, setFromCurrency] = useState(initialCurrency)
  const [toCurrency, setToCurrency] = useState('EUR')
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currencies, setCurrencies] = useState<string[]>(['RSD', 'EUR', 'USD'])

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = async () => {
    // Koristimo fiksnu listu valuta umesto poziva API-ja
    setCurrencies(['RSD', 'EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'NOK', 'SEK'])
  }

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Unesite validnu količinu')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const response = await apiService.get(`/currency/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
      const result = response.data || response
      
      setConvertedAmount(result.converted)
      
      if (onConvert) {
        onConvert(result.converted, toCurrency)
      }
    } catch (error: any) {
      console.error('Failed to convert currency:', error)
      setError('Greška pri konverziji valute')
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setAmount(value)
      setError('')
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setConvertedAmount(null)
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-exchange-alt me-2"></i>
          Konverter valuta
        </h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <div className="row">
          <div className="col-md-5">
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Količina</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="fromCurrency" className="form-label">Od</label>
              <select
                className="form-select"
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="col-md-1 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={swapCurrencies}
              title="Zameni valute"
            >
              <i className="fas fa-exchange-alt"></i>
            </button>
          </div>
          
          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="toCurrency" className="form-label">U</label>
              <select
                className="form-select"
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="d-grid">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConvert}
            disabled={loading || !amount || parseFloat(amount) <= 0}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Konvertovanje...
              </>
            ) : (
              <>
                <i className="fas fa-calculator me-2"></i>
                Konvertuj
              </>
            )}
          </button>
        </div>

        {convertedAmount !== null && (
          <div className="mt-3 p-3 bg-light rounded">
            <div className="text-center">
              <h4 className="text-primary mb-1">
                {parseFloat(amount).toLocaleString()} {fromCurrency}
              </h4>
              <i className="fas fa-arrow-down text-muted mb-2"></i>
              <h3 className="text-success mb-0">
                {convertedAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} {toCurrency}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrencyConverter