import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-center mb-8">
        Spotify Portfolio API
      </h1>
      
      <p className="text-xl text-gray-300 text-center mb-8 max-w-2xl">
        This portfolio website showcases Spotify API integration. 
        View my top tracks, currently playing song, and followed artists.
      </p>

      {/* Important Notice */}
      <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-6 mb-8 max-w-3xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-yellow-300 mb-2">Important Notice</h3>
            <p className="text-gray-300 mb-3">
              This project uses Spotify Live API with tokens valid for only 1 hour. 
              By the time you visit, the token may have expired and data might not load.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://drive.google.com/file/d/1w21tPQe4ZimrWqX82rXAZlUXc8alfdQZ/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                🎬 Watch Demo Video
              </a>
              <span className="text-gray-400 text-sm self-center">
                See the project in action with live data
              </span>
            </div>
          </div>
        </div>
      </div>

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
