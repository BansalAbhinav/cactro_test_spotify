# 🎵 Spotify Portfolio API

A Next.js application that integrates with Spotify Web API to showcase music listening habits. Built for portfolio demonstration with a clean REST API and beautiful dashboard interface.

## 🌟 Live Demo

- **🔗 Live Project**: [Live Link](https://cactro-test-spotify.vercel.app/)
- **🎬 Demo Video**: [Watch on Google Drive](https://drive.google.com/file/d/1w21tPQe4ZimrWqX82rXAZlUXc8alfdQZ/view?usp=sharing)

## ✨ Features

✅ **Top Tracks Display** - Your most played songs with full details  
✅ **Currently Playing** - Real-time currently playing track  
✅ **Followed Artists** - Artists you follow on Spotify  
✅ **User Profile** - Your Spotify profile information  
✅ **REST API** - Clean JSON endpoints for all data  
✅ **Interactive Dashboard** - Beautiful Spotify-themed UI  
✅ **Free Account Compatible** - Works without Premium subscription  

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/spotify-portfolio-api
cd spotify-portfolio-api
npm install
```

### 2. Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `https://your-domain.com` (or `http://localhost:3000` for development)
4. Get your credentials and generate access token

**Required Scopes:**
- `user-read-private` - User profile
- `user-top-read` - Top tracks  
- `user-read-currently-playing` - Now playing
- `user-follow-read` - Followed artists

### 3. Environment Setup

Create `.env.local`:

```env
SPOTIFY_ACCESS_TOKEN="your_access_token_here"
SPOTIFY_CLIENT_ID="your_client_id_here"  
SPOTIFY_CLIENT_SECRET="your_client_secret_here"
NODE_ENV=development
```

### 4. Run Application

```bash
npm run dev    # Development server
npm run build  # Production build
```

## 🎯 API Endpoints

### Get All Data
```
GET /api/spotify
```

### Specific Data
```
GET /api/spotify?action=top-tracks&limit=10
GET /api/spotify?action=now-playing
GET /api/spotify?action=followed-artists  
GET /api/spotify?action=user
```

## 📊 Example Response

```json
{
  "success": true,
  "message": "Spotify data retrieved successfully",
  "data": {
    "topTracks": [
      {
        "name": "Blinding Lights",
        "artists": [{"name": "The Weeknd"}],
        "album": {"name": "After Hours"},
        "duration_ms": 200040,
        "uri": "spotify:track:0VjIjW4GlULA3ZrjFt1rig"
      }
    ],
    "nowPlaying": {
      "track": {"name": "Save Your Tears"},
      "is_playing": true
    },
    "followedArtists": [
      {
        "name": "Drake",
        "followers": {"total": 40000000},
        "genres": ["canadian hip hop", "rap"]
      }
    ]
  }
}
```

## �️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development  
- **Tailwind CSS** - Styling framework
- **Spotify Web API** - Music data source

## 📁 Project Structure

```
├── app/
│   ├── api/spotify/route.ts    # Main API endpoint
│   ├── spotify/page.tsx        # Dashboard UI
│   └── layout.tsx             # App layout
├── lib/utils/
│   ├── spotify.ts             # Spotify API functions  
│   └── helpers.ts             # Response utilities
└── test.py                    # Token generation script
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
```
SPOTIFY_ACCESS_TOKEN=your_token
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

## ⚠️ Important Notes

- **Token Expiry**: Access tokens expire every hour - update manually or implement refresh flow
- **Free Account**: Works with free Spotify accounts (no Premium required)
- **Rate Limits**: Handles API rate limiting gracefully
- **CORS**: Configured for browser access

## 💡 Usage Examples

### Browser
- Dashboard: `https://your-domain.com/spotify`
- API: `https://your-domain.com/api/spotify`

### cURL
```bash
# Get top tracks
curl "https://your-domain.com/api/spotify?action=top-tracks&limit=5"

# Get currently playing
curl "https://your-domain.com/api/spotify?action=now-playing"
```

## 🎯 Perfect For

- **Portfolio Projects** - Showcase API integration skills
- **Music Applications** - Foundation for Spotify-based apps
- **Learning** - Understanding REST APIs and OAuth
- **Data Analysis** - Accessing personal music data

---

**Built by [Abhinav Bansal]** | [Portfolio](https://abhinav-bansal-portfolio.vercel.app) | [GitHub](https://github.com/yourusername)
