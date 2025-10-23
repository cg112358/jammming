import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(term.trim()); }} className="searchbar">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search by song title"
        aria-label="Search term"
      />
      <button type="submit">Search</button>
    </form>
  );
}
