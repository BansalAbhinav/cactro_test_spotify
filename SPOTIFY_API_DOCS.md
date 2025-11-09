# 🎵 Spotify API Integration

## Overview

This project implements a comprehensive Spotify API integration that provides access to user's music data and playback controls. The API is built on top of the Spotify Web API and offers both data retrieval and playback control functionality.

## 🚀 Live Demo

**API Endpoint**: `https://your-domain.com/api/spotify`

## ✨ Features

### 📊 Data Retrieval
- **Top Tracks**: Get user's top 10 tracks with different time ranges
- **Currently Playing**: Show what's currently playing on user's Spotify
- **Followed Artists**: List all artists the user follows
- **User Profile**: Get user's Spotify profile information

### 🎮 Playback Control
- **Stop/Pause**: Stop the currently playing song
- **Play Track**: Start playing any specific track
- **Playlist Creation**: Create playlists with selected tracks

## 📡 API Endpoints

### GET `/api/spotify`

#### Default Response (All Data)
```bash
GET /api/spotify
```

Returns all user data in one request:
```json
{
  "success": true,
  "message": "Spotify data retrieved successfully",
  "data": {
    "topTracks": [...],
    "nowPlaying": {...},
    "followedArtists": [...]
  }
}
```

#### Specific Data Endpoints

**Get Top Tracks**
```bash
GET /api/spotify?action=top-tracks&limit=10&time_range=short_term
```
- `limit`: Number of tracks (1-50, default: 10)
- `time_range`: `short_term` (4 weeks), `medium_term` (6 months), `long_term` (years)

**Get Currently Playing**
```bash
GET /api/spotify?action=now-playing
```

**Get Followed Artists**
```bash
GET /api/spotify?action=followed-artists
```

**Get User Profile**
```bash
GET /api/spotify?action=user
```

**Test Token**
```bash
GET /api/spotify?action=test-token
```

### POST `/api/spotify`

#### Stop/Pause Playback
```bash
POST /api/spotify
Content-Type: application/json

{
  "action": "stop"
}
```

#### Start Playback
```bash
POST /api/spotify
Content-Type: application/json

{
  "action": "play",
  "trackUri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"
}
```

#### Create Playlist
```bash
POST /api/spotify
Content-Type: application/json

{
  "action": "create-playlist",
  "name": "My API Playlist",
  "description": "Created via API",
  "public": false,
  "trackUris": [
    "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
    "spotify:track:1xQ6trAsedVPCdbtDAmk0c"
  ]
}
```

## 🔧 Technical Implementation

### Required Spotify Scopes
```
user-read-private           # User profile access
user-top-read              # Top tracks and artists
user-read-currently-playing # Currently playing track
user-read-playback-state   # Playback state
user-modify-playback-state # Control playback
user-follow-read           # Followed artists
```

### Technology Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Spotify API**: spotify-web-api-node
- **Authentication**: Access Token (OAuth 2.0)

## 📱 Example Usage

### JavaScript/Fetch Examples

**Get All Data**
```javascript
fetch('/api/spotify')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Stop Current Song**
```javascript
fetch('/api/spotify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'stop' })
})
.then(response => response.json())
.then(data => console.log('Stopped:', data));
```

**Play a Specific Track**
```javascript
fetch('/api/spotify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    action: 'play',
    trackUri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh'
  })
})
.then(response => response.json())
.then(data => console.log('Playing:', data));
```

### cURL Examples

**Get Top Tracks**
```bash
curl "https://your-domain.com/api/spotify?action=top-tracks&limit=5"
```

**Stop Playback**
```bash
curl -X POST "https://your-domain.com/api/spotify" \
  -H "Content-Type: application/json" \
  -d '{"action":"stop"}'
```

## 📋 Response Format

All responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "statusCode": 400
}
```

## 🎯 Sample Data Structures

### Top Track Object
```json
{
  "id": "4iV5W9uYEdYUVa79Axb7Rh",
  "name": "Song Name",
  "artists": [
    {
      "id": "artist_id",
      "name": "Artist Name"
    }
  ],
  "album": {
    "id": "album_id",
    "name": "Album Name",
    "images": [...]
  },
  "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
  "external_urls": {
    "spotify": "https://open.spotify.com/track/..."
  }
}
```

### Currently Playing Object
```json
{
  "track": {
    // Track object (same as above)
  },
  "is_playing": true,
  "progress_ms": 45000,
  "device": {
    "name": "Device Name",
    "type": "Computer"
  }
}
```

### Followed Artist Object
```json
{
  "id": "artist_id",
  "name": "Artist Name",
  "genres": ["pop", "rock"],
  "followers": {
    "total": 1000000
  },
  "images": [...],
  "external_urls": {
    "spotify": "https://open.spotify.com/artist/..."
  }
}
```

## 🛠️ Setup & Deployment

### Environment Variables
```env
SPOTIFY_ACCESS_TOKEN=your_access_token_here
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### Requirements Met ✅
- ✅ **Top 10 tracks**: `GET /api/spotify?action=top-tracks`
- ✅ **Currently playing**: `GET /api/spotify?action=now-playing`
- ✅ **Followed artists**: `GET /api/spotify?action=followed-artists`
- ✅ **Stop playback**: `POST /api/spotify` with `{"action": "stop"}`
- ✅ **Play tracks**: `POST /api/spotify` with `{"action": "play", "trackUri": "..."}`
- ✅ **JSON responses**: Pretty-printed and browser-friendly
- ✅ **Portfolio integration**: Available at `/api/spotify` route

## 🎪 Interactive Demo

Visit these endpoints in your browser:

1. **All Data**: `/api/spotify`
2. **Top Tracks**: `/api/spotify?action=top-tracks&limit=5`
3. **Currently Playing**: `/api/spotify?action=now-playing`
4. **Followed Artists**: `/api/spotify?action=followed-artists`

Use tools like Postman or cURL for POST requests (playback control).

## 🔒 Security

- Uses OAuth 2.0 access tokens
- Tokens are securely stored in environment variables
- No client-side token exposure
- Rate limiting handled by Spotify API

## 📊 Error Handling

The API gracefully handles:
- Invalid or expired tokens
- Network timeouts
- Missing required parameters
- Spotify API rate limits
- Insufficient permissions

## 🎵 Live Example

```json
{
  "success": true,
  "message": "Spotify data retrieved successfully",
  "data": {
    "topTracks": [
      {
        "name": "Blinding Lights",
        "artists": [{"name": "The Weeknd"}],
        "uri": "spotify:track:0VjIjW4GlULA3ZrjFt1rig"
      }
    ],
    "nowPlaying": {
      "track": {
        "name": "Save Your Tears",
        "artists": [{"name": "The Weeknd"}]
      },
      "is_playing": true
    },
    "followedArtists": [
      {
        "name": "The Weeknd",
        "followers": {"total": 50000000}
      }
    ]
  }
}
```
