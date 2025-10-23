// src/spotify.js
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // from .env
const redirectUri = `${window.location.origin}${import.meta.env.BASE_URL}`; 
const scopes = ['playlist-modify-public','playlist-modify-private','user-read-email'];

let accessToken;

async function sha256(str) {
  const data = new TextEncoder().encode(str);
  return crypto.subtle.digest('SHA-256', data);
}
function base64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
}

async function getAccessToken() {
  if (accessToken) return accessToken;

  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    const verifier = localStorage.getItem('spotify_code_verifier');
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier
    });
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const data = await res.json();
    accessToken = data.access_token;
    // remove ?code=... from URL
    window.history.replaceState({}, document.title, redirectUri);
    return accessToken;
  }

  // start PKCE auth
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(64)));
  const challenge = base64url(await sha256(verifier));
  localStorage.setItem('spotify_code_verifier', verifier);

  const auth = new URL('https://accounts.spotify.com/authorize');
  auth.searchParams.set('client_id', clientId);
  auth.searchParams.set('response_type', 'code');
  auth.searchParams.set('redirect_uri', redirectUri);
  auth.searchParams.set('scope', scopes.join(' '));
  auth.searchParams.set('code_challenge_method', 'S256');
  auth.searchParams.set('code_challenge', challenge);
  window.location = auth.toString();
}

export const Spotify = {
  async search(term) {
    const token = await getAccessToken();
    const res = await fetch(
      `https://api.spotify.com/v1/search?type=track&limit=20&q=${encodeURIComponent(term)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    return (data.tracks?.items ?? []).map(t => ({
      id: t.id,
      name: t.name,
      artist: t.artists.map(a => a.name).join(', '),
      album: t.album.name,
      uri: `spotify:track:${t.id}`
    }));
  },

  async savePlaylist(name, uris) {
    const token = await getAccessToken();
    const me = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());

    const playlist = await fetch(`https://api.spotify.com/v1/users/${me.id}/playlists`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, public: false })
    }).then(r => r.json());

    await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ uris })
    });

    return playlist.id;
  }
};
