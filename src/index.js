
document.addEventListener('DOMContentLoaded', () => {
 //store the films id in the const movieList
    const movieList = document.getElementById('films');
      // create an empty array to store movie data.
  let movieListData = [];//(empty array)

//create a function where you passfetch to get a hold of the movie data
    function requestMoviesFromDBjson() {
        fetch('db.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error requesting movies from db.json, check your database connection');
                }
                return res.json();
            })
            .then(data => {
                // store the movie data in data.films after converting the res to JSON, 
                movieListData = data.films;
                // call the function to display the movies on the webpage.
                visibleMovies();
            })
            .catch(error => {
//this will catch any error that occurred and brings it up in the page.
                console.error('Error fetching movies from db.json:', error);
                showError('Error loading movie data');
            });
    }

    // display the list of movies on the page through function visibleMovies
    function visibleMovies() {
        movieListData.forEach(cinema => {
            const listItem = makeMovieItems(cinema);
            //  append the list of item to the movie list on the wpage.
           movieList.appendChild(listItem);
        });
    }

    //  create a list item element for a movie.
    function makeMovieItems(cinema) {
        const listItem = document.createElement('li');
   listItem.textContent = cinema.title;

         listItem.dataset.cinemaId = cinema.id;

     listItem.classList.add('movie', 'item');

        listItem.addEventListener('click', () => updateMovieDetails(cinema.id));
        // return the created list item.
        return listItem;
    }

    function updateMovieDetails(cinemaId) {
        const cinema = movieListData.find(c => c.id === cinemaId);
        if (!cinema) return;

        const ticketsAvailable = cinema.capacity - cinema.tickets_sold;
        const purchaseTicketButton = document.getElementById('buy-ticket');

        purchaseTicketButton.textContent = ticketsAvailable > 0 ? 'Buy Ticket' : 'Sold Out';
        purchaseTicketButton.classList.toggle('disabled', ticketsAvailable === 0);
        purchaseTicketButton.onclick = () => {
            if (ticketsAvailable > 0) {
                purchaseTicket(cinema);
            }
        };

        displayMovieDetails(cinema);
    }
//create a function  that shows the tickets purchased
    function purchaseTicket(cinema) {
        cinema.tickets_sold++;
        updateTicketCount(cinema.id);
        updateMovieDetails(cinema.id);
    }

    // update the potrayed number of remaining tickets 
    function updateTicketCount(cinemaId) {
        const cinema = movieListData.find(c => c.id === cinemaId);
        const availableTickets = cinema.capacity - cinema.tickets_sold;
        document.getElementById('ticket-num').textContent = availableTickets;
    }

    // create a function to display the movie details
    function displayMovieDetails(cinema) {
        document.getElementById('title').textContent = cinema.title;
        document.getElementById('runtime').textContent = `${cinema.runtime} minutes`;
        document.getElementById('film-info').textContent = cinema.description;
        document.getElementById('showtime').textContent = cinema.showtime;
        document.getElementById('poster').src = cinema.poster;
        document.getElementById('poster').alt = `Poster for ${cinema.title}`;
// callin the updateTicketCount
        updateTicketCount(cinema.id);
    }

    // displaying an error message on the webpage.
    function showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = message;
        errorMessage.classList.add('ui', 'negative', 'message');
        document.body.appendChild(errorMessage);
        // I set a timeout to remove the error message after 5 seconds.
        setTimeout(() => errorMessage.remove(), 5000);
    }

    //  calling the function to fetch movie data when the DOM content is fully loaded.
    requestMoviesFromDBjson();
});
