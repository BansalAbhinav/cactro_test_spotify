import SpotifyWebApi from 'spotify-web-api-node';

const getSpotifyClient = (accessToken?: string): SpotifyWebApi => {
  const client = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
  });

  if (accessToken) {
    client.setAccessToken(accessToken);
  }

  return client;
};

export async function getAccessToken(): Promise<string> {
  const client = getSpotifyClient();
  
  try {
    const data = await client.clientCredentialsGrant();
    return data.body.access_token;
  } catch (error) {
    throw new Error('Failed to get Spotify access token');
  }
}

export async function getTopTracks(accessToken: string, limit: number = 10, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term') {
  const client = getSpotifyClient(accessToken);
  
  try {
    const validLimit = Math.min(Math.max(1, limit), 50);
    const data = await client.getMyTopTracks({ limit: validLimit, time_range: timeRange });
    return data.body.items.slice(0, validLimit);
  } catch (error: any) {
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    const message = error.body?.error?.message || error.message || 'Failed to get top tracks';
    throw new Error(`Failed to get top tracks: ${message}`);
  }
}

export async function getCurrentlyPlaying(accessToken: string) {
  const client = getSpotifyClient(accessToken);
  
  try {
    const data = await client.getMyCurrentPlayingTrack();
    if (!data.body || !data.body.item) {
      return null;
    }
    return data.body;
  } catch (error: any) {
    if (error.statusCode === 204 || error.body?.error?.status === 204) {
      return null;
    }
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    const message = error.body?.error?.message || error.message || 'Failed to get currently playing track';
    throw new Error(`Failed to get currently playing track: ${message}`);
  }
}

export async function getFollowedArtists(accessToken: string) {
  const client = getSpotifyClient(accessToken);
  
  try {
    const data = await client.getFollowedArtists({ limit: 50 });
    return data.body.artists.items;
  } catch (error: any) {
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    const message = error.body?.error?.message || error.message || 'Failed to get followed artists';
    throw new Error(`Failed to get followed artists: ${message}`);
  }
}

export async function getCurrentUser(accessToken: string) {
  const client = getSpotifyClient(accessToken);
  
  try {
    const data = await client.getMe();
    return data.body;
  } catch (error: any) {
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      throw new Error('Spotify access token is invalid or expired. Please update SPOTIFY_ACCESS_TOKEN');
    }
    const message = error.body?.error?.message || error.message || 'Failed to get current user';
    throw new Error(`Failed to get current user: ${message}`);
  }
}

export function getUserAccessToken(): string {
  const token = process.env.SPOTIFY_ACCESS_TOKEN;
  if (!token) {
    throw new Error('SPOTIFY_ACCESS_TOKEN not found in environment variables. Please set it in .env.local');
  }
  return token;
}

