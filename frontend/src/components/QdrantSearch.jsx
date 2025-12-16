import React, { useState } from 'react';
import './QdrantSearch.css';
import searchAPI from './QdrantSearch/searchAPI';

const QdrantSearch = ({ backendUrl = 'http://localhost:8000' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await searchAPI(query, backendUrl);
      setResults(data.results || []);
    } catch (err) {
      setError(`Failed to retrieve results: ${err.message}`);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to highlight query terms in the result content
  const highlightText = (text, query) => {
    if (!query) return text;

    const queryTerms = query.trim().split(/\s+/).filter(term => term.length > 0);
    if (queryTerms.length === 0) return text;

    const regex = new RegExp(`(${queryTerms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="qdrant-search-container">
      <h1>Qdrant Semantic Search</h1>

      <form onSubmit={handleSearch} className="search-form">
        <div className="input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="search-input"
          />
          <button type="submit" disabled={loading} className="search-button">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {results.length > 0 ? (
        <div className="results-container">
          <h2>Search Results</h2>
          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-content">
                  {highlightText(result.content, query)}
                </div>
                <div className="result-meta">
                  <div className="result-source">
                    <strong>Source:</strong>
                    <a
                      href={result.source}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.source}
                    </a>
                  </div>
                  <div className="result-score">
                    <strong>Similarity:</strong> {(result.score * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !loading && query && (
        <div className="no-results">
          No results found for your query
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching through documents...</p>
        </div>
      )}
    </div>
  );
};

export default QdrantSearch;