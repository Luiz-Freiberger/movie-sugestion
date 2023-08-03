//https://developer.themoviedb.org/reference/movie-popular-list

async function getMovies(){
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTBhYzRkNjM4NjYxMzA2ZGZjYjEyYjc4MmQwY2VjNiIsInN1YiI6IjY0Y2JmMTE4MmYyNjZiMDBhZDY4NTk4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GFTOiUD4UvAy5SH8CeESDmwQCbEm2j1ZEDPoG-6Og3o'
    }
  };
  
try {
  return  fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
    .then(response => response.json())
} catch (error) {
  
}
  
}
//puxar info
//https://api.themoviedb.org/3/movie/{movie_id}
async function getMoreInfo(id){
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTBhYzRkNjM4NjYxMzA2ZGZjYjEyYjc4MmQwY2VjNiIsInN1YiI6IjY0Y2JmMTE4MmYyNjZiMDBhZDY4NTk4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GFTOiUD4UvAy5SH8CeESDmwQCbEm2j1ZEDPoG-6Og3o'
    }
  };
  try {
    const data = await fetch('https://api.themoviedb.org/3/movie/'+ id, options)
    .then(response => response.json())
    
    return data
  } catch (error) {
    console.log(error)
  }
  
}
//assistir trailer
//https://api.themoviedb.org/3/movie/{movie_id}/videos

async function watch(e) {
  const movie_id = e.currentTarget.dataset.id
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTBhYzRkNjM4NjYxMzA2ZGZjYjEyYjc4MmQwY2VjNiIsInN1YiI6IjY0Y2JmMTE4MmYyNjZiMDBhZDY4NTk4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GFTOiUD4UvAy5SH8CeESDmwQCbEm2j1ZEDPoG-6Og3o'
    }
  };

  try {
    const data = await  fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos`, options)
    .then(response => response.json())

    const {results}= data

    const youtubeVideo = results.find(
      video => video.type === "Trailer")

      window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, 'blank')
}
 catch (error) {
    console.log(error)
  }
}



function createMovieLayout({
  id,
  title,
  stars,
  image,
  time,
  year
}){
  return `
  <div class="movie">
          
          <div class="title">
            <span>${title}</span>
            <div>
              <img src="./assets/Star.svg" alt="icone de estrela">
              <p>${stars}</p>
            </div>
          </div>
          
          <div class="poster">
            <img src="https://image.tmdb.org/t/p/w500${image}" alt="Imagem de ${title}">
          </div>
          
          <div class="info">
            <div class="duration">
              <img src="./assets/Clock.svg" alt="icone de relogio">

              <span>${time}<span>
            </div>
              <div class="year">
                <img src="./assets/CalendarBlank.svg" alt="icone de calendario">

                <span>${year}</span>
              </div>
          </div>
          <button onclick="watch(event)" data-id="${id}">
            <img src="./assets/Play.svg" alt="icone de play">

            <span>Assistir Trailer</span>
          </button>
    </div>
  `
}

function select3Videos(results) {
  const random = ()=> Math.floor(Math.random() * results.length)
  
  let selectedVideos = new Set()
  while(selectedVideos.size < 3){
    selectedVideos.add(results[random()].id)
  }
  return [...selectedVideos]
}
function minutesToHourMinutesAndSeconds(minutes){
  const date = new Date(null)
  date.setMinutes(minutes)
  return date.toISOString().slice(11, 19)
}


async function start(){
  //pegar as sugestoes de filme da api
  const {results} = await getMovies()
  //pegar randomicamente 3 filmes
  const best3 = select3Videos(results).map(async movie => {
  //pegar informaçoes extras

    const info = await getMoreInfo(movie)
    
    const props ={
      id: info.id,
      title: info.title,
      stars: Number(info.vote_average).toFixed(1),
      image: info.poster_path,
      time: minutesToHourMinutesAndSeconds(info.runtime),
      year: info.release_date.slice(0, 4)
    }
    return createMovieLayout(props)
  })
    const output = await Promise.all(best3)

  //organizar os dados para ...
  
  //substituir o conteudo dos 
  document.querySelector('.movies').innerHTML = output.join("")
}
 start()
