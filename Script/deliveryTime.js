/* Randomfunktion för tiden */
function randomTime() {
  const min = Math.floor(Math.random() * 20);
  const sek = Math.floor(Math.random() * 20);

  const formatmin = min < 10 ? "0" + min : min;
  const formatsek = sek < 10 ? "0" + sek : sek;

  return formatmin + ":" + formatsek;
}

/* Kopplar med p taggarna i htmlkoden på statuspage */
const statusTime = document.querySelector(".status__time");
const statusDistance = document.querySelector(".status__distance");



/* Timer för nedräkning av tiden */
function updateTimer() {
  const time = statusTime.textContent.split(":");
  let minutes = parseInt(time[0]);
  let seconds = parseInt(time[1]);

  if (seconds === 0) {
    if (minutes === 0) {
      return;
    }
    minutes--;
    seconds = 59;
  } else {
    seconds--;
  }

  statusTime.textContent = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  setTimeout(updateTimer, 1000);
}

statusTime.innerHTML = randomTime();
updateTimer();

function getPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    statusDistance.textContent = "Geolocation stöds inte av din webbläsare.";
  }
}


/* Funktion för att visa användaren plats i realtid. Den skrivs sedan ut på <p> taggen status__distance . */
function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  statusDistance.textContent = "Din position är: Latitud " + latitude + ", Longitud " + longitude;
}

getPosition();