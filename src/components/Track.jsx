export default function Track({ track, onAdd, onRemove, isRemoval }) {
  return (
    <div className="track">
      <div>
        <h3>{track.name}</h3>
        <p>{track.artist} • {track.album}</p>
      </div>
      {isRemoval ? (
        <button aria-label="Remove track" onClick={() => onRemove(track)}>-</button>
      ) : (
        <button aria-label="Add track" onClick={() => onAdd(track)}>+</button>
      )}
    </div>
  );
}
