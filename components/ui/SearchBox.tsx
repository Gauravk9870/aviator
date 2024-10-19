"use client"

import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement your search logic here
    console.log('Searching for:', searchTerm)
  }

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <form onSubmit={handleSearch} className="relative hidden sm:block flex-grow mx-4">
      <div className="header-search bg-gray-800 rounded-md flex items-center">
        <input
          className="js-search-box-input header-search-input w-full bg-transparent text-white placeholder-gray-400 px-4 py-2 focus:outline-none"
          placeholder="Search for casinos, games, and more"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-ga-id-change="general_header_general_search"
        />
        <button
          type="submit"
          className="menu-link-search p-2 text-white hover:text-gray-300 focus:outline-none"
          data-ga-id="general_header_btn_searchBtn"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="js-header-search-close header-search-close p-2 text-white hover:text-gray-300 focus:outline-none"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
      <input id="search-box--site-url" name="pageCountryId" type="hidden" value="102" />
    </form>
  )
}