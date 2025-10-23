import Tracklist from './Tracklist';

export default function Playlist({ name, tracks, onRemove, onNameChange, onSave }) {
  return (
    <section>
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="New Playlist"
        aria-label="Playlist name"
      />
      <Tracklist tracks={tracks} onRemove={onRemove} isRemoval={true} />
      <button onClick={onSave} disabled={!tracks.length}>Save to Spotify</button>
    </section>
  );
}
