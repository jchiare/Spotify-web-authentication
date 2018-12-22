
function get_wikipedia_data(artist){
    axios.get("https://en.wikipedia.org//w/api.php?action=query&format=json&list=search&continue=&srsearch=" + artist + "&srwhat=text&srprop=timestamp&origin=*")
    .then(function(response){
        console.log(response.data.query.search);
    })
};

const insert_html = document.querySelector('#wikipedia-link');

