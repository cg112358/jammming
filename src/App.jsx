import { useState } from 'react';
import './index.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
// import { mockTracks } from './data/mockTracks';
import { Spotify } from './spotify';

export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // TEMP search using mock data (for reference only)
  /*
  const handleSearch = (term) => {
    const q = term.trim().toLowerCase();
    if (!q) { setSearchResults([]); return; }

    const results = mockTracks.filter(t => {
      const name   = t.name.toLowerCase();
      const artist = t.artist.toLowerCase();
      const album  = t.album.toLowerCase();
      return name.includes(q) || artist.includes(q) || album.includes(q);
    });
    setSearchResults(results);
  };
  */

  // ✅ Real search using Spotify API
  const handleSearch = async (term) => {
    const q = term.trim();
    if (!q) { setSearchResults([]); return; }
    const results = await Spotify.search(q);
    setSearchResults(results);
  };

  const addTrack = (track) => {
    setPlaylistTracks(prev =>
      prev.some(t => t.id === track.id) ? prev : [...prev, track]
    );
  };

  const removeTrack = (track) => {
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
  };

  const updatePlaylistName = (name) => setPlaylistName(name);

  // ✅ Save playlist to Spotify
  const savePlaylist = async () => {
    if (!playlistTracks.length) return;

    const uris = playlistTracks.map(t => t.uri ?? `spotify:track:${t.id}`);
    const name = (playlistName || 'New Playlist').trim();

    try {
      const playlistId = await Spotify.savePlaylist(name, uris);
      console.log('Saved playlist:', playlistId);

      // optional: keep search results, just clear the draft
      setPlaylistName('New Playlist');
      setPlaylistTracks([]);
      // TODO: show a toast “Saved to Spotify ✓”
    } catch (err) {
      console.error('Save failed:', err);
      // TODO: show a toast “Could not save playlist”
    }
  };


  // ✅ Return is now correctly inside App()
  return (
    <main className="container">
      <h1>Jammming</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="columns">
        <SearchResults results={searchResults} onAdd={addTrack} />
        <Playlist
          name={playlistName}
          tracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </main>
  );
}
