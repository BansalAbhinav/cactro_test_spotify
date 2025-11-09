import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-center mb-8">
        Spotify Portfolio API
      </h1>
      
      <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl">
        This portfolio website showcases Spotify API integration. 
        View my top tracks, currently playing song, and followed artists.
      </p>

      <div className="space-y-6">
        <Link
          href="/spotify"
          className="block bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-xl font-semibold text-center transition-colors"
        >
          🎵 View Spotify Data
        </Link>
        
        <Link
          href="/api/spotify"
          className="block bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-xl font-semibold text-center transition-colors"
        >
          📊 View Raw JSON API
        </Link>
      </div>

      <div className="mt-12 text-center text-gray-400">
        <p>API Endpoints:</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li><code>/api/spotify</code> - Get all data (top tracks, now playing, followed artists)</li>
          <li><code>/api/spotify?action=top-tracks</code> - Get top 10 tracks</li>
          <li><code>/api/spotify?action=now-playing</code> - Get currently playing song</li>
          <li><code>/api/spotify?action=followed-artists</code> - Get followed artists</li>
        </ul>
      </div>
    </div>
  );
}
