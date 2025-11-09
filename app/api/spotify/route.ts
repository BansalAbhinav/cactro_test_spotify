import { NextRequest, NextResponse } from 'next/server';
import {
  getUserAccessToken,
  getTopTracks,
  getCurrentlyPlaying,
  getFollowedArtists,
  getCurrentUser,
} from '../../../lib/utils/spotify';
import { createApiResponse, createErrorResponse } from '../../../lib/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    const accessToken = getUserAccessToken();
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'top-tracks') {
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const timeRange = (url.searchParams.get('time_range') || 'short_term') as 'short_term' | 'medium_term' | 'long_term';
      
      try {
        const tracks = await getTopTracks(accessToken, limit, timeRange);
        return createApiResponse(true, 'Top tracks retrieved successfully', { tracks });
      } catch (error: any) {
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
    return createErrorResponse(
      error.message || 'Failed to retrieve Spotify data',
      500
    );
  }
}

