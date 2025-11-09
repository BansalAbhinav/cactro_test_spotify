'use client';

import React, { useState, useEffect } from 'react';

interface Track {
  name: string;
  artists: { name: string }[];
  uri: string;
  album?: { name: string };
  duration_ms?: number;
}

interface NowPlaying {
  track: Track;
  is_playing: boolean;
  progress_ms?: number;
}

interface Artist {
  name: string;
  followers: { total: number };
  genres?: string[];
}

interface SpotifyData {
  topTracks: Track[];
  nowPlaying: NowPlaying | null;
  followedArtists: Artist[];
}

export default function SpotifyPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchSpotifyData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/spotify');
      const result = await response.json();
      setData(result);
      if (!result.success) {
        setError(result.message || 'Failed to fetch Spotify data');
      }
    } catch (err) {
      setError('Failed to fetch Spotify data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecificData = async (action: string, params?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `/api/spotify?action=${action}${params ? `&${params}` : ''}`;
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(`Failed to fetch ${action} data`);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchSpotifyData();
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-xl">Loading Spotify data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
              🎵 Spotify API Dashboard
            </h1>
            <p className="text-gray-300">Interactive Spotify Web API Integration</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-800/50 rounded-xl p-2">
          {[
            { id: 'dashboard', label: '📊 Dashboard', desc: 'All Data' },
            { id: 'top-tracks', label: '🔥 Top Tracks', desc: 'Your Most Played' },
            { id: 'now-playing', label: '🎵 Now Playing', desc: 'Current Song' },
            { id: 'artists', label: '👥 Artists', desc: 'Followed Artists' },
            { id: 'api', label: '🔧 API Test', desc: 'Raw Endpoints' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-lg transition-all flex-1 min-w-0 ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <div className="text-sm font-medium">{tab.label}</div>
              <div className="text-xs opacity-75">{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
            <p className="text-red-300">❌ {error}</p>
            <button 
              onClick={fetchSpotifyData}
              className="mt-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Now Playing Card */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🎵 Now Playing
                <button
                  onClick={() => fetchSpecificData('now-playing')}
                  disabled={loading}
                  className="ml-auto text-sm bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg disabled:opacity-50"
                >
                  {loading ? '⏳' : '🔄'} Refresh
                </button>
              </h2>
              
              {data?.data?.nowPlaying ? (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{data.data.nowPlaying.track?.name}</h3>
                    <p className="text-gray-300">
                      {data.data.nowPlaying.track?.artists?.map((artist: any) => artist.name).join(', ')}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {data.data.nowPlaying.track?.album?.name}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        data.data.nowPlaying.is_playing 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {data.data.nowPlaying.is_playing ? '▶️ Playing' : '⏸️ Paused'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-xl">🎵 No music currently playing</p>
                  <p className="text-sm mt-2">Start playing music on Spotify to see it here</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="text-2xl font-bold text-green-400">{data?.data?.topTracks?.length || 0}</div>
                <div className="text-gray-300">Top Tracks</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="text-2xl font-bold text-blue-400">{data?.data?.followedArtists?.length || 0}</div>
                <div className="text-gray-300">Followed Artists</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="text-2xl font-bold text-purple-400">
                  {data?.data?.nowPlaying ? '1' : '0'}
                </div>
                <div className="text-gray-300">Now Playing</div>
              </div>
            </div>
          </div>
        )}

        {/* Top Tracks Tab */}
        {activeTab === 'top-tracks' && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">🔥 Your Top Tracks</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchSpecificData('top-tracks', 'limit=10')}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm"
                >
                  🔄 Refresh
                </button>
                <button
                  onClick={() => fetchSpecificData('top-tracks', 'limit=50')}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm"
                >
                  Load 50
                </button>
              </div>
            </div>
            
            {data?.data?.topTracks && data.data.topTracks.length > 0 ? (
              <div className="space-y-2">
                {data.data.topTracks.map((track: Track, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all group">
                    <div className="text-green-400 font-bold w-8 text-center">{index + 1}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{track.name}</h3>
                      <p className="text-gray-300 text-sm truncate">
                        {track.artists?.map(artist => artist.name).join(', ')}
                      </p>
                      <p className="text-gray-400 text-xs truncate">{track.album?.name}</p>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {track.duration_ms && formatDuration(track.duration_ms)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-xl">🎵 No top tracks found</p>
                <p className="text-sm mt-2">Listen to more music on Spotify to see your top tracks</p>
              </div>
            )}
          </div>
        )}

        {/* Now Playing Tab */}
        {activeTab === 'now-playing' && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">🎵 Currently Playing</h2>
              <button
                onClick={() => fetchSpecificData('now-playing')}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm"
              >
                🔄 Refresh
              </button>
            </div>
            
            {data?.data?.nowPlaying ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">{data.data.nowPlaying.track?.name}</h3>
                  <p className="text-xl text-gray-300 mb-1">
                    {data.data.nowPlaying.track?.artists?.map((artist: any) => artist.name).join(', ')}
                  </p>
                  <p className="text-gray-400">{data.data.nowPlaying.track?.album?.name}</p>
                </div>
                
                <div className="text-center">
                  <span className={`inline-block px-4 py-2 rounded-full ${
                    data.data.nowPlaying.is_playing 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {data.data.nowPlaying.is_playing ? '▶️ Playing' : '⏸️ Paused'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">🎵</div>
                <p className="text-xl">No music currently playing</p>
                <p className="text-sm mt-2">Start playing music on Spotify to see it here</p>
              </div>
            )}
          </div>
        )}

        {/* Artists Tab */}
        {activeTab === 'artists' && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">👥 Followed Artists</h2>
              <button
                onClick={() => fetchSpecificData('followed-artists')}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm"
              >
                🔄 Refresh
              </button>
            </div>
            
            {data?.data?.followedArtists && data.data.followedArtists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.data.followedArtists.map((artist: Artist, index: number) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-all">
                    <h3 className="font-semibold mb-2">{artist.name}</h3>
                    <p className="text-gray-300 text-sm mb-1">
                      👥 {artist.followers?.total?.toLocaleString()} followers
                    </p>
                    {artist.genres && artist.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {artist.genres.slice(0, 2).map((genre, idx) => (
                          <span key={idx} className="text-xs bg-gray-600 px-2 py-1 rounded">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-xl">👥 No followed artists found</p>
                <p className="text-sm mt-2">Follow some artists on Spotify to see them here</p>
              </div>
            )}
          </div>
        )}

        {/* API Test Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">🔧 API Endpoint Testing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { action: 'top-tracks', label: '🔥 Top Tracks', params: 'limit=10' },
                  { action: 'now-playing', label: '🎵 Now Playing', params: '' },
                  { action: 'followed-artists', label: '👥 Followed Artists', params: '' },
                  { action: 'user-info', label: '👤 User Info', params: '' }
                ].map((endpoint) => (
                  <button
                    key={endpoint.action}
                    onClick={() => fetchSpecificData(endpoint.action, endpoint.params)}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded-lg text-left disabled:opacity-50"
                  >
                    <div className="font-medium">{endpoint.label}</div>
                    <div className="text-xs opacity-75">GET /api/spotify?action={endpoint.action}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={fetchSpotifyData}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg disabled:opacity-50"
                >
                  {loading ? '⏳' : '📊'} Get All Data
                </button>
              </div>
            </div>

            {/* Raw JSON Response */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">📋 Raw API Response</h3>
              <div className="bg-black rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-xs text-green-400">
                  {data ? JSON.stringify(data, null, 2) : 'No data loaded yet...'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
