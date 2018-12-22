// Hide or Show authentication button depending if local storage is present
const authentication_button = document.querySelector('#get-access-token');
const is_spotify_auth_token = () => {
    return (localStorage.getItem('spotify_auth_token')?
            authentication_button.style.display = 'none':
            authentication_button.style.display = '')
}


// remove auth token after 1 hour (set expiration time from Spotify)
const start_spotify_auth_timer = () => {
    setTimeout(function(){
        localStorage.removeItem('spotify_auth_token');
    }, 3600 * 1000)
};


// Authentication docs in the "Implicit Grant Flow" section in https://developer.spotify.com/documentation/general/guides/authorization-guide/
const initial_authentication = () => {
    // Handle errors with authentication user. Spotify inputs error reason in the URL query section
    if (localStorage.getItem('spotify_auth_token') === null){
        if (window.location.search){
            const error_reason = /error=([a-zA-Z0-9\-\_]+)/.exec(window.location.search)[1];
            alert(`Spotify Authentication Failed because "${error_reason}"`);
        }
        // return token and start valid timer if they're no errors authentication
        if (window.location.hash){
            const get_token_key = /access_token=([a-zA-Z0-9\-\_]+)/.exec(window.location.hash);
            localStorage.setItem('spotify_auth_token',get_token_key[1]);
            start_spotify_auth_timer();
        }
    }
};


// function for API request
const url_input = document.querySelector('#spotify-song');
const current_song_API_request = () => {
    axios.get('https://api.spotify.com/v1/me/player',{
        headers:{'Authorization':'Bearer ' + localStorage.getItem('spotify_auth_token')}
    })
    .then(function (response){
        url_input.innerHTML = `${response.data.item.name} by ${response.data.item.artists[0].name}`;
        // change artist name for wikipedia search
        get_wikipedia_data(response.data.item.artists[0].name);
    }).catch (function (error){
        if (error.response.status == 401){
            localStorage.removeItem('spotify_auth_token');
            alert('Authentication failed - please re authenticate your Spotify account');
        }
    })
};

// should replace this function with the poller 
const button = document.querySelector('#button');
button.onclick = () => {
    current_song_API_request();
    is_spotify_auth_token();
}

// main 
(function(){
    // authentication logic for spotify token
    initial_authentication();
    is_spotify_auth_token();
}());