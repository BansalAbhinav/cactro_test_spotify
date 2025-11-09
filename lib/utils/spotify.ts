import SpotifyWebApi from 'spotify-web-api-node';

// Initialize Spotify API client
const getSpotifyClient = (accessToken?: string): SpotifyWebApi => {
  // CLIENT_ID and CLIENT_SECRET are optional - only needed for OAuth flow
  // For API calls with access token, they're not required
  const client = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
  });

  if (accessToken) {
    client.setAccessToken(accessToken);
  }

  return client;
};

// Get access token using client credentials flow
export async function getAccessToken(): Promise<string> {
  const client = getSpotifyClient();
  
  try {
    const data = await client.clientCredentialsGrant();
    return data.body.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get Spotify access token');
  }
}

// Get user's top tracks
export async function getTopTracks(accessToken: string, limit: number = 10, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term') {
  const client = getSpotifyClient(accessToken);
  
  try {
    // Validate limit
    const validLimit = Math.min(Math.max(1, limit), 50);
    // Note: This requires user authorization with user-top-read scope
    const data = await client.getMyTopTracks({ limit: validLimit, time_range: timeRange });
    return data.body.items.slice(0, validLimit);
  } catch (error: any) {
    console.error('Error getting top tracks:', error);
    // Handle 401 Unauthorized (expired/invalid token)
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    const message = error.body?.error?.message || error.message || 'Failed to get top tracks';
    throw new Error(`Failed to get top tracks: ${message}`);
  }
}

// Get currently playing track
export async function getCurrentlyPlaying(accessToken: string) {
  const client = getSpotifyClient(accessToken);
  
  try {
    const data = await client.getMyCurrentPlayingTrack();
    // Return null if nothing is playing
    if (!data.body || !data.body.item) {
      return null;
    }
    return data.body;
  } catch (error: any) {
    // If 204 No Content, nothing is playing
    if (error.statusCode === 204 || error.body?.error?.status === 204) {
      return null;
    }
    // Handle 401 Unauthorized (expired/invalid token)
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    console.error('Error getting currently playing:', error);
    const message = error.body?.error?.message || error.message || 'Failed to get currently playing track';
    throw new Error(`Failed to get currently playing track: ${message}`);
  }
}

// Get followed artists
export async function getFollowedArtists(accessToken: string) {
  const client = getSpotifyClient(accessToken);
  
  try {
    const data = await client.getFollowedArtists({ limit: 50 });
    return data.body.artists.items;
  } catch (error: any) {
    console.error('Error getting followed artists:', error);
    // Handle 401 Unauthorized (expired/invalid token)
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    const message = error.body?.error?.message || error.message || 'Failed to get followed artists';
    throw new Error(`Failed to get followed artists: ${message}`);
  }
}

// Pause playback
export async function pausePlayback(accessToken: string) {
  const client = getSpotifyClient(accessToken);
  
  try {
    await client.pause();
    return { success: true, message: 'Playback paused' };
  } catch (error: any) {
    console.error('Error pausing playback:', error);
    // Handle 401 Unauthorized (expired/invalid token)
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    // Handle 404 No active device
    if (error.statusCode === 404 || error.body?.error?.status === 404) {
      throw new Error('No active Spotify device found. Please start playing music on a device first');
    }
    const message = error.body?.error?.message || error.message || 'Failed to pause playback';
    throw new Error(`Failed to pause playback: ${message}`);
  }
}

// Normalize track URI to spotify:track: format
function normalizeTrackUri(trackUri: string): string {
  if (trackUri.startsWith('spotify:track:')) {
    return trackUri;
  }
  if (trackUri.startsWith('https://open.spotify.com/track/')) {
    const trackId = trackUri.split('/track/')[1]?.split('?')[0];
    if (trackId) {
      return `spotify:track:${trackId}`;
    }
  }
  // If it's just a track ID, add the prefix
  if (/^[a-zA-Z0-9]{22}$/.test(trackUri)) {
    return `spotify:track:${trackUri}`;
  }
  throw new Error('Invalid track URI format');
}

// Start playback with a track
export async function startPlayback(accessToken: string, trackUri: string) {
  const client = getSpotifyClient(accessToken);
  
  // Normalize track URI
  let normalizedUri: string;
  try {
    normalizedUri = normalizeTrackUri(trackUri);
  } catch (error: any) {
    throw new Error(`Invalid track URI: ${error.message}. Must be in format: spotify:track:TRACK_ID, https://open.spotify.com/track/TRACK_ID, or TRACK_ID`);
  }
  
  try {
    await client.play({ uris: [normalizedUri] });
    return { success: true, message: 'Playback started' };
  } catch (error: any) {
    console.error('Error starting playback:', error);
    // Handle 401 Unauthorized (expired/invalid token)
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    // Handle 404 No active device
    if (error.statusCode === 404 || error.body?.error?.status === 404) {
      throw new Error('No active Spotify device found. Please start playing music on a device first');
    }
    const message = error.body?.error?.message || error.message || 'Failed to start playback';
    throw new Error(`Failed to start playback: ${message}`);
  }
}

// Get current user info
export async function getCurrentUser(accessToken: string) {
  const client = getSpotifyClient(accessToken);
  
  try {
    const data = await client.getMe();
    return data.body;
  } catch (error: any) {
    console.error('Error getting current user:', error);
    // Handle 401 Unauthorized (expired/invalid token)
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    const message = error.body?.error?.message || error.message || 'Failed to get current user';
    throw new Error(`Failed to get current user: ${message}`);
  }
}

// Create a playlist
export async function createPlaylist(
  accessToken: string,
  name: string,
  description: string = '',
  publicPlaylist: boolean = false
) {
  const client = getSpotifyClient(accessToken);
  
  try {
    const options: any = {};
    if (description) {
      options.description = description;
    }
    if (typeof publicPlaylist === 'boolean') {
      options.public = publicPlaylist;
    }
    
    const data = await client.createPlaylist(name, options);
    return data.body;
  } catch (error: any) {
    console.error('Error creating playlist:', error);
    // Handle 401 Unauthorized (expired/invalid token)
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    const message = error.body?.error?.message || error.message || 'Failed to create playlist';
    throw new Error(`Failed to create playlist: ${message}`);
  }
}

// Add tracks to playlist
export async function addTracksToPlaylist(accessToken: string, playlistId: string, trackUris: string[]) {
  const client = getSpotifyClient(accessToken);
  
  try {
    // Normalize all track URIs
    const normalizedUris = trackUris.map(uri => {
      try {
        return normalizeTrackUri(uri);
      } catch {
        return uri; // Return as-is if normalization fails
      }
    });
    
    const data = await client.addTracksToPlaylist(playlistId, normalizedUris);
    return data.body;
  } catch (error: any) {
    console.error('Error adding tracks to playlist:', error);
    // Handle 401 Unauthorized (expired/invalid token)
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    const message = error.body?.error?.message || error.message || 'Failed to add tracks to playlist';
    throw new Error(`Failed to add tracks to playlist: ${message}`);
  }
}

// Create playlist with tracks (combined function)
export async function createPlaylistWithTracks(
  accessToken: string,
  name: string,
  trackUris: string[],
  description: string = 'Playlist created via API',
  publicPlaylist: boolean = false
) {
  try {
    // Create playlist (uses /v1/me/playlists, so no userId needed)
    const playlist = await createPlaylist(accessToken, name, description, publicPlaylist);
    
    // Add tracks to playlist
    if (trackUris.length > 0) {
      await addTracksToPlaylist(accessToken, playlist.id, trackUris);
    }
    
    return playlist;
  } catch (error: any) {
    console.error('Error creating playlist with tracks:', error);
    throw error;
  }
}

// Get user access token from environment variable only (.env.local)
export function getUserAccessToken(): string {
  const token = process.env.SPOTIFY_ACCESS_TOKEN;
  if (!token) {
    throw new Error('SPOTIFY_ACCESS_TOKEN not found in environment variables. Please set it in .env.local');
  }
  // Note: CLIENT_ID and CLIENT_SECRET are only needed for OAuth flow, not for API calls with access token
  return token;
}

