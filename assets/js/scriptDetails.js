import InitiativeService from "../LocalStorage/services/InitiativeService.js";
import SuggestionService from "../LocalStorage/services/SuggestionService.js";

window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const initiativeId = params.get("id");

  console.log(initiativeId);
  if (initiativeId) {
    displayInitiativeDetails(initiativeId);
  } else {
    console.error("Erro no id da iniciativa.");
  }
  populateInitiatives();
  document.getElementById("enrollForm").addEventListener("submit", submitEnrollment);
};

function displayInitiativeDetails(initiativeId) {
  const suggestionService = new SuggestionService();
  const initiativeService = new InitiativeService();

  const initiatives = initiativeService.getAllInitiatives({
    orderKey: "date",
    orderBy: "asc",
  });
  const initiative = initiativeService.getAllInitiatives({
    id: Number(initiativeId),
    orderKey: "date",
    orderBy: "asc",
  })[0];
  //console.log(initiatives);
  console.log(initiative);

  let suggestionRel;
  try {
    suggestionRel = suggestionService.getAllSuggestions({
      id: (initiative.sugestionId),
      orderBy: "date",
      orderKey: "asc",
    })[0];
    if (!suggestionRel) {
      console.log("Nao ha sugestao relacionada a esta iniciativa");
      return;
    }
  } catch (e) {
    console.log("Erro: Nao ha sugestao relacionada a esta iniciativa");
    return;
  }
  console.log(suggestionRel);

  //Mostrar os detalhes --------------------------------
  //Nome
  document.getElementById("name-space").innerHTML = `${suggestionRel.eventName}`;
  
  //Tempo
  const now = new Date();
  let time;
  const formDiv = document.getElementById("form-div");
  if (new Date(initiative.date) > now) {
    time = "Open";
    //counter
    const intervalId = setInterval(updateCountdown(initiative), 60000);
    formDiv.classList.remove('hide');
  } else {
    time = "Closed";
    document.querySelector('.counter').innerHTML = "<h1 style=\"color: #fff;\">The event has ended!</h1>";
    //esconder form de inscricao
    formDiv.classList.add('hide');
  }

  //tag
  document.getElementById("open").innerHTML = `<span class="open">${time} Initiative</span>`;

  //Data formatada
  const date = new Date(initiative.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });  
  document.getElementById("date").innerHTML = 
  `<span>When:</span> ${date}`;

  //Participantes
  const numParticipants = initiativeService.getParticipants(initiative.id).length;
  document.getElementById("participants").innerHTML = 
  `<span>Participants:</span> ${numParticipants}`;

  //Local
  document.getElementById("local").innerHTML = 
  `<span>Where:</span> ${initiative.local}`;

  let eventType;
  switch (initiative.eventType) {
    case "food_safety":
      eventType = "Food Safety";
      break;
    case "healthy_diets":
      eventType = "Healthy Diets";
      break;
    case "zero_waste":
      eventType = "Zero Waste";
      break;
    case "food_rescue":
      eventType = "Food Rescue";
      break;
    default:
      console.log("ETipo de evento nao reconhecido");
  }
  //Descricao
  document.getElementById("description").innerHTML = 
  `<h4>Initiative Information</h4>
  <h6>Initiative Details</h6>
  <p>Initiative type: ${eventType}</p>
  <p>Duration: ${initiative.duration} minutes</p>
  <p>Participants: ${initiative.minParticipants} - ${initiative.maxParticipants} people</p>

  <h6 class="second-title">Description</h6>
  <p>${suggestionRel.description}</p>`;

}

function updateCountdown(initiative) {
  const endDate = new Date(initiative.date);
  const now = new Date();
  const diff = endDate - now;

  if (diff > 0) {
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor(diff % (1000 * 60 * 60 * 24 * 30) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    //const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    //console.log(days, hours, minutes);

    document.getElementById("months").innerHTML = months;
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    //document.getElementById("seconds").innerHTML = seconds;
  } else {
    document.querySelector('.counter').innerHTML = "<h1 style=\"color: #00bdfe;\">Initiative has ended!</h1>";
    clearInterval(intervalId);
  }
}

function formatEventType(eventType) {
  switch (eventType) {
    case "food_safety":
      return "Food Safety";
      case "healthy_diets":
      return "Healthy Diets";
      case "zero_waste":
      return "Zero Waste";
    case "food_rescue":
      return "Food Rescue";
    default:
      return "Unknown Event Type";
  }
}

function populateInitiatives() {
  const initiativeService = new InitiativeService({});
  const openInitiatives = initiativeService.getAllInitiatives({
    orderKey: "date",
    orderBy: "asc",
    status: "approved",
  }).filter((init) => {
    return new Date(init.date) > new Date();
  });
  
  const container = document.getElementById("initiatives-container");
  
  openInitiatives.slice(0, 4).forEach((initiative, index) => {
    
    const eventType = formatEventType(initiative.eventType);
    
    const initiativeHTML = `
    <div class="col-lg-3 col-sm-6">
      	<div class="waiting-item h-100">
          <img src="assets/images/waiting-0${index + 1}.jpg" alt="" />
          <div class="down-content">
          <div>
            <ul class="row row-cols-2">
              <li class="left-info">
                <h4>${eventType}</h4>
              </li>
              <li class="right-info">
                <p>${new Date(initiative.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  })}
                </p>
              </li>
            </ul>
            <ul class="row row-cols-2">
              <li class="left-info">
                <p>${initiative.local}</p>
              </li>
            </ul>
            <div class="right-details">
              <span style="color: #7a7a7a;">
                <em>
                  ${initiative.minParticipants} - ${initiative.maxParticipants}
                </em>
                Participants
              </span>
            </div>
          </div>
          <div class="border-button pt-4 text-center">
            <a href="initiative-details.html?id=${initiative.id}">Find out more</a>
          </div>
        </div>
      </div>
    </div>`;

    container.innerHTML += initiativeHTML;
  });
}

function submitEnrollment(event) {
  event.preventDefault();

  const name = document.getElementById("enrolledName").value;
  const bday = document.getElementById("enrolledBday").value;
  const birthDate = new Date(bday);
  const email = document.getElementById("enrolledEmail").value;

  const params = new URLSearchParams(window.location.search);
  const initiativeId = params.get("id");

  if (!initiativeId) {
    console.error("Erro no id da iniciativa.");
    return;
  }

  const initiativeService = new InitiativeService();

  const participant = {
    name,
    birthDate,
    email,
    initiativeId: Number(initiativeId),
    isDeleted: false,
  };

  try {
    initiativeService.addParticipant(initiativeId, participant);
    alert("Enrollment submitted successfully!");
  } catch (error) {
    alert(
      "An error occurred while submitting your enrollment. Please try again later."
    );
  }
}