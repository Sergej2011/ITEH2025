import React, { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
} 

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,  
  placeholder = "Pretraži proizvode...",
  className = ""
}) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className={`search-form ${className}`}>
      <div className="input-group">
        <input
          type="text"
          className="form-control search-bar"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          className="btn btn-outline-secondary" 
          type="button"
          onClick={handleClear}
          disabled={!query}
        >
          <i className="fas fa-times"></i>
        </button>
        <button className="btn btn-primary" type="submit">
          <i className="fas fa-search me-1"></i>
          Pretraži
        </button>
      </div>
    </form>
  )
}

export default SearchBar
