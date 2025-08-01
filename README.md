# Spotify Finder

A simple vanilla JavaScript app that searches Spotify for albums released in a selected genre over a custom date range.

## Usage

1. Obtain a Spotify access token using the [Client Credentials Flow](https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow).  One way is with curl:

   ```bash
   curl -X POST -H "Authorization: Basic <base64(client_id:client_secret)>" \
        -d grant_type=client_credentials \
        https://accounts.spotify.com/api/token
   ```

   Copy the returned `access_token` and place it in `index.html` as the value of `SPOTIFY_ACCESS_TOKEN`.
   The token expires after one hour; the page automatically reloads when that happens.
2. Open `index.html` in a browser.
3. Select a genre, adjust the start and end dates if needed, and click **Search** to view recent albums.
