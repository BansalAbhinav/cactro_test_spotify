import { NextRequest, NextResponse } from 'next/server';
import {
  getUserAccessToken,
  getTopTracks,
  getCurrentlyPlaying,
  getFollowedArtists,
  pausePlayback,
  startPlayback,
  createPlaylistWithTracks,
  getCurrentUser,
} from '../../../lib/utils/spotify';
import { createApiResponse, createErrorResponse } from '../../../lib/utils/helpers';

// GET /api/spotify - Get top tracks, currently playing, and followed artists
export async function GET(request: NextRequest) {
  try {
    // Only use token from environment variable (.env.local)
    const accessToken = getUserAccessToken();
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    // Handle different actions
    if (action === 'top-tracks') {
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const timeRange = (url.searchParams.get('time_range') || 'short_term') as 'short_term' | 'medium_term' | 'long_term';
      
      console.log(`Fetching top tracks with limit: ${limit}, timeRange: ${timeRange}`);
      
      try {
        const tracks = await getTopTracks(accessToken, limit, timeRange);
        console.log(`Retrieved ${tracks?.length || 0} tracks:`, tracks);
        return createApiResponse(true, 'Top tracks retrieved successfully', { tracks, debug: { limit, timeRange, count: tracks?.length || 0 } });
      } catch (error: any) {
        console.error('Error in top-tracks:', error);
        return createErrorResponse(`Failed to get top tracks: ${error.message}`, 500);
      }
    }

    if (action === 'user') {
      const user = await getCurrentUser(accessToken);
      return createApiResponse(true, 'User info retrieved successfully', { user });
    }

    if (action === 'now-playing') {
      const playing = await getCurrentlyPlaying(accessToken);
      return createApiResponse(true, 'Currently playing track retrieved successfully', { playing });
    }

    if (action === 'followed-artists') {
      const artists = await getFollowedArtists(accessToken);
      return createApiResponse(true, 'Followed artists retrieved successfully', { artists });
    }

    if (action === 'test-token') {
      try {
        const user = await getCurrentUser(accessToken);
        return createApiResponse(true, 'Token is valid', { user: user.display_name });
      } catch (error: any) {
        return createErrorResponse(`Token error: ${error.message}`, 401);
      }
    }

    // Default: return all data
    try {
      const [tracks, playing, artists] = await Promise.all([
        getTopTracks(accessToken, 10, 'short_term'),
        getCurrentlyPlaying(accessToken).catch(() => null),
        getFollowedArtists(accessToken),
      ]);

      return createApiResponse(true, 'Spotify data retrieved successfully', {
        topTracks: tracks,
        nowPlaying: playing,
        followedArtists: artists,
      });
    } catch (error: any) {
      // If one fails, try to get what we can
      const tracks = await getTopTracks(accessToken, 10, 'short_term').catch(() => []);
      const playing = await getCurrentlyPlaying(accessToken).catch(() => null);
      const artists = await getFollowedArtists(accessToken).catch(() => []);

      return createApiResponse(true, 'Spotify data retrieved with some errors', {
        topTracks: tracks,
        nowPlaying: playing,
        followedArtists: artists,
      });
    }
  } catch (error: any) {
    console.error('Spotify API error:', error);
    return createErrorResponse(
      error.message || 'Failed to retrieve Spotify data',
      500
    );
  }
}

// POST /api/spotify - Control playback (stop or play)
export async function POST(request: NextRequest) {
  try {
    // Only use token from environment variable (.env.local)
    const accessToken = getUserAccessToken();
    const body = await request.json().catch(() => ({}));
    const { action, trackUri } = body;

    if (action === 'stop' || action === 'pause') {
      await pausePlayback(accessToken);
      return createApiResponse(true, 'Playback stopped successfully');
    }

    if (action === 'play') {
      if (!trackUri) {
        return createErrorResponse('trackUri is required for play action', 400);
      }
      await startPlayback(accessToken, trackUri);
      return createApiResponse(true, 'Playback started successfully');
    }

    if (action === 'create-playlist') {
      const { name, trackUris, description, public: publicPlaylist } = body;
      
      if (!name) {
        return createErrorResponse('name is required for create-playlist action', 400);
      }
      
      if (!trackUris || !Array.isArray(trackUris) || trackUris.length === 0) {
        return createErrorResponse('trackUris array is required for create-playlist action', 400);
      }

      const playlist = await createPlaylistWithTracks(
        accessToken,
        name,
        trackUris,
        description || 'Playlist created via API',
        publicPlaylist || false
      );

      return createApiResponse(true, 'Playlist created successfully', { playlist });
    }

    return createErrorResponse('Invalid action. Use "stop", "pause", "play", or "create-playlist"', 400);
  } catch (error: any) {
    console.error('Spotify playback error:', error);
    return createErrorResponse(
      error.message || 'Failed to control playback',
      500
    );
  }
}

