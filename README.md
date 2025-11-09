# Spotify Portfolio API

A Next.js application that integrates with the Spotify API to showcase your music listening habits. This portfolio website displays your top tracks, currently playing song, and followed artists with options to control playback.

## 🎵 Features

✅ **Show Top 10 Tracks** - Display your most played tracks  
✅ **Currently Playing Song** - Show what's playing right now  
✅ **Followed Artists** - List artists you follow on Spotify  
✅ **Playback Control** - Stop currently playing song  
✅ **Track Playback** - Start playing any of your top tracks  
✅ **JSON API** - Clean REST API endpoints for data access  
✅ **Beautiful UI** - Clean, Spotify-themed interface  

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd spotify-portfolio-api
npm install
```

### 2. Set Up Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Get your Client ID and Client Secret
4. Generate an access token with these scopes:
   - `user-read-private`
   - `user-read-email`  
   - `user-top-read`
   - `user-read-currently-playing`
   - `user-follow-read`
   - `user-modify-playback-state`
   - `user-read-playback-state`

### 3. Environment Setup

Create a `.env.local` file:

```env
# Spotify API Configuration
SPOTIFY_ACCESS_TOKEN="your_access_token_here"
SPOTIFY_CLIENT_ID="your_client_id_here"
SPOTIFY_CLIENT_SECRET="your_client_secret_here"

# Environment
NODE_ENV=development
```

### 4. Run the Application

```bash
# Development
npm run dev

# Production Build
npm run build
npm start
```

## 📊 API Endpoints

### Main Endpoint
- **GET** `/api/spotify` - Returns all data (top tracks, now playing, followed artists)

### Specific Data Endpoints
- **GET** `/api/spotify?action=top-tracks` - Get top 10 tracks
- **GET** `/api/spotify?action=now-playing` - Get currently playing song  
- **GET** `/api/spotify?action=followed-artists` - Get followed artists
- **GET** `/api/spotify?action=user` - Get user profile info

### Playback Control
- **POST** `/api/spotify` with `{"action": "stop"}` - Stop/pause current playback
- **POST** `/api/spotify` with `{"action": "play", "trackUri": "spotify:track:ID"}` - Play specific track

### Query Parameters for Top Tracks
- `limit` - Number of tracks (1-50, default: 10)
- `time_range` - Time period (`short_term`, `medium_term`, `long_term`, default: `short_term`)

Example: `/api/spotify?action=top-tracks&limit=5&time_range=long_term`

## 🎯 Example API Response

```json
{
  "success": true,
  "message": "Spotify data retrieved successfully",
  "data": {
    "topTracks": [
      {
        "id": "4iV5W9uYEdYUVa79Axb7Rh",
        "name": "Watermelon Sugar",
        "artists": [{"name": "Harry Styles"}],
        "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
        "popularity": 90
      }
    ],
    "nowPlaying": {
      "item": {
        "name": "As It Was",
        "artists": [{"name": "Harry Styles"}]
      },
      "is_playing": true
    },
    "followedArtists": [
      {
        "id": "6KImCVD70vtIoJWnq6nGn3",
        "name": "Harry Styles",
        "followers": {"total": 42000000}
      }
    ]
  },
  "timestamp": "2025-11-09T10:30:00.000Z"
}
```

## 🔧 Technical Details

### Built With
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **spotify-web-api-node** - Spotify API client

### Project Structure
```
├── app/
│   ├── api/spotify/route.ts    # Main API endpoint
│   ├── spotify/page.tsx        # Spotify data page  
│   ├── page.tsx               # Home page
│   └── layout.tsx             # App layout
├── lib/utils/
│   ├── spotify.ts             # Spotify API functions
│   └── helpers.ts             # API response helpers
└── .env.local                 # Environment variables
```

### Key Functions (lib/utils/spotify.ts)
- `getTopTracks()` - Fetch user's top tracks
- `getCurrentlyPlaying()` - Get now playing track
- `getFollowedArtists()` - Get followed artists  
- `pausePlayback()` - Stop current playback
- `startPlayback()` - Play specific track

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- Set environment variables
- Run `npm run build`
- Serve the `.next` directory

## ⚠️ Important Notes

### Access Token Expiration
Spotify access tokens expire after 1 hour. For production:
1. Implement OAuth 2.0 flow for automatic token refresh
2. Or manually update the token in environment variables

### Scopes Required
Your access token must include these scopes:
- `user-top-read` - For top tracks
- `user-read-currently-playing` - For now playing  
- `user-follow-read` - For followed artists
- `user-modify-playback-state` - For playback control

### Rate Limits
Spotify API has rate limits. The app handles common errors gracefully.

## 🎵 Usage Examples

### View All Data
Visit `/spotify` for a beautiful interface, or `/api/spotify` for raw JSON.

### Get Top Tracks Only
```bash
curl https://your-domain.com/api/spotify?action=top-tracks&limit=5
```

### Control Playback
```bash
# Stop current song
curl -X POST https://your-domain.com/api/spotify \
  -H "Content-Type: application/json" \
  -d '{"action": "stop"}'

# Play a specific track  
curl -X POST https://your-domain.com/api/spotify \
  -H "Content-Type: application/json" \
  -d '{"action": "play", "trackUri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"}'
```

## 🛠️ Development

### Adding New Features
1. Add functions to `lib/utils/spotify.ts`
2. Update API route in `app/api/spotify/route.ts`  
3. Update UI in `app/spotify/page.tsx`

### Error Handling
The app handles common Spotify API errors:
- 401 Unauthorized (expired token)
- 404 No active device  
- 429 Rate limit exceeded
- 204 No content (nothing playing)

## 📝 License

MIT License - feel free to use this in your own portfolio!

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch  
5. Open a Pull Request

---

**Created by [Your Name]** | [Portfolio](https://your-portfolio.com) | [GitHub](https://github.com/yourusername)
