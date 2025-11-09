import base64
import sys
import urllib.parse
import requests

CLIENT_ID = "SPOTIFY_CLIENT_SECRET"
CLIENT_SECRET = "SPOTIFY_CLIENT_SECRET"
REDIRECT_URI = "SPOTIFY_URL"

SCOPES = [
    "user-read-private",
    "user-read-email", 
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-follow-read",
    "user-read-recently-played",
    "streaming",
    "app-remote-control",
    "user-library-read",
    "user-library-modify",
    "playlist-read-private",
    "playlist-read-collaborative",
]

if REDIRECT_URI.startswith("https://localhost"):
    print("Note: Browsers usually don't serve HTTPS on localhost. "
          "Use http://localhost:... and add it to your Spotify app Redirect URIs.", file=sys.stderr)
if not (REDIRECT_URI.startswith("https://") or REDIRECT_URI.startswith("http://localhost")):
    raise ValueError("Redirect URI must use https:// or be http://localhost/... and must EXACTLY match your app setting.")

scope_str = " ".join(SCOPES)
params = {
    "client_id": CLIENT_ID,
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": scope_str,
    "show_dialog": "true",
}
auth_url = "https://accounts.spotify.com/authorize?" + urllib.parse.urlencode(params, quote_via=urllib.parse.quote)
print("\nOpen this URL in your browser and authorize the app:\n")
print(auth_url)

code = input("\nPaste the 'code' from the redirect URL: ").strip()
if not code:
    sys.exit("No code provided.")

token_url = "https://accounts.spotify.com/api/token"

basic = f"{CLIENT_ID}:{CLIENT_SECRET}".encode("ascii")
auth_header = base64.b64encode(basic).decode("ascii")
headers = {"Authorization": f"Basic {auth_header}", "Content-Type": "application/x-www-form-urlencoded"}

data = {
    "grant_type": "authorization_code",
    "code": code,
    "redirect_uri": REDIRECT_URI,
}

resp = requests.post(token_url, data=data, headers=headers, timeout=30)
try:
    token_json = resp.json()
except Exception:
    token_json = {"raw": resp.text}

print("\nToken response:")
print(token_json)

if resp.ok:
    access_token = token_json.get("access_token")
    granted_scopes = token_json.get("scope", "")
    print("\nAccess token acquired.")
    print("Granted scopes:", granted_scopes)
    me = requests.get(
        "https://api.spotify.com/v1/me",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=30
    )
    print("\nGET /v1/me ->", me.status_code)
    print(me.json() if me.headers.get("content-type","").startswith("application/json") else me.text)
else:
    print("\nFailed to exchange code. Status:", resp.status_code)
