import Tracklist from './Tracklist';

export default function SearchResults({ results, onAdd }) {
  return (
    <section>
      <h2>Results</h2>
      <Tracklist tracks={results} onAdd={onAdd} isRemoval={false} />
    </section>
  );
}
