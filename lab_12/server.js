// Import required modules
var express = require('express');
var SpotifyWebApi = require('spotify-web-api-node');

var app = express();
app.use(express.static('public'));

// Spotify API configuration
var spotifyApi = new SpotifyWebApi({
    clientId: '506d295d1ff445218b85c0d9322a6c88',
    clientSecret: 'f4957541df4d485994b2d0b448b04d49',
});

// Authenticate and set access token
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        console.log('Access token expires in ' + data.body['expires_in']);
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function (err) {
        console.error('Error retrieving access token', err.message);
    }
);

// Root route
app.get('/', function (req, res) {
    res.send('<h1>Welcome to the Spotify API Integration!</h1><p>Use the following routes:</p><ul><li><a href="/searchLove">Search for "love"</a></li><li><a href="/search?searchterm=hello">Search for a custom term</a></li><li><a href="/topTracks/{artistId}">Get top tracks for an artist (replace {artistId})</a></li><li><a href="/relatedArtists/{artistId}">Get related artists (replace {artistId})</a></li><li><a href="/searchAPI?searchterm=hello">Get simplified JSON results</a></li></ul>');
});

// Basic search route for hardcoded term
app.get('/searchLove', function (req, res) {
    getTracks('love', res);
});

// Route for user-specified search term
app.get('/search', function (req, res) {
    var searchTerm = req.query.searchterm;
    getTracks(searchTerm, res);
});

// Route to get top tracks for an artist
app.get('/topTracks/:artistId', function (req, res) {
    var artistId = req.params.artistId;
    getTopTracks(artistId, res);
});

// Route to get related artists for an artist
app.get('/relatedArtists/:artistId', function (req, res) {
    var artistId = req.params.artistId;
    getRelated(artistId, res);
});

// Route for simplified JSON results
app.get('/searchAPI', function (req, res) {
    var searchTerm = req.query.searchterm;
    getTracksAPI(searchTerm, res);
});

// Async function to search tracks
async function getTracks(searchTerm, res) {
    spotifyApi.searchTracks(searchTerm).then(
        function (data) {
            var tracks = data.body.tracks.items;
            var HTMLResponse = "";

            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];
                HTMLResponse +=
                    "<div>" +
                    `<h2>${track.name}</h2>` +
                    `<h4>${track.artists[0].name}</h4>` +
                    `<img src="${track.album.images[0].url}">` +
                    `<a href="${track.external_urls.spotify}">Track Details</a>` +
                    "</div>";
            }
            res.send(HTMLResponse);
        },
        function (err) {
            console.error(err);
            res.status(500).send('Error searching tracks');
        }
    );
}

// Async function to fetch top tracks for an artist
async function getTopTracks(artistId, res) {
    spotifyApi.getArtistTopTracks(artistId, 'GB').then(
        function (data) {
            res.send(data.body);
        },
        function (err) {
            console.error('Error fetching top tracks', err);
            res.status(500).send('Error fetching top tracks');
        }
    );
}

// Async function to fetch related artists
async function getRelated(artistId, res) {
    spotifyApi.getArtistRelatedArtists(artistId).then(
        function (data) {
            res.send(data.body);
        },
        function (err) {
            console.error('Error fetching related artists', err);
            res.status(500).send('Error fetching related artists');
        }
    );
}

// Async function to return simplified JSON results
async function getTracksAPI(searchTerm, res) {
    spotifyApi.searchTracks(searchTerm).then(
        function (data) {
            var tracks = data.body.tracks.items;
            var JSONResponse = [];

            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];
                JSONResponse.push({
                    trackName: track.name,
                    artist: track.artists[0].name,
                    image: track.album.images[0].url,
                    url: track.external_urls.spotify,
                });
            }
            res.send(JSONResponse);
        },
        function (err) {
            console.error(err);
            res.status(500).send('Error fetching tracks');
        }
    );
}

// Start the server
app.listen(8080, function () {
    console.log('Server running on port 8080');
});