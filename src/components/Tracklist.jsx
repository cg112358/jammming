import Track from './Track';

export default function Tracklist({ tracks, onAdd, onRemove, isRemoval }) {
  return (
    <div className="tracklist">
      {tracks.map(t => (
        <Track
          key={t.id}
          track={t}
          onAdd={onAdd}
          onRemove={onRemove}
          isRemoval={isRemoval}
        />
      ))}
    </div>
  );
}
