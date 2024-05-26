import InitiativeService from "../LocalStorage/services/InitiativeService.js";
import SuggestionService from "../LocalStorage/services/SuggestionService.js";

const suggestionService = new SuggestionService();

/* class InitiativeQueryModel {
    id;
    sugestionId;
    local;
    status;
    createdOn;
    date;
    duration;
    maxParticipants;
    minParticipants;
    riskLevel;
    eventType;
    isDeleted;
} */

/* export class SugestionQueryModel {
    id;
    eventName;
    orderBy;
    orderKey;
    type;
    tipo;
    local;
    date;
    email;
    description;
    isApproved;
    isDeleted;
    createdOn;
    numParticipants;
    rejectedReason;
    status;
}
 */

window.onload = async function () {
  // create fake sugestions
  const suggestionServic = new SuggestionService();

  if (
    suggestionServic.getAllSuggestions({
      orderBy: "date",
      orderKey: "asc",
    }).length === 0
  ) {
    const suggestions = [
      {
        eventName: "Event 1",
        orderBy: "date",
        orderKey: "asc",
        type: "food_safety",
        local: "Local 1",
        date: new Date(),
        email: "algo@gmail.com",
        description: "Description 1",
        isApproved: true,
      },
      {
        eventName: "Event 2",
        orderBy: "date",
        orderKey: "asc",
        type: "healthy_diets",
        local: "Local 2",
        date: new Date(),
        email: "algo2@gmail.com",
        description: "Description 2",
        isApproved: true,
      },
    ];
    await suggestions.forEach(async (suggestion) => {
      await suggestionServic.createSuggestion(suggestion);
    });
  }

  // create fake initiatives
  const initiativeService = new InitiativeService();

  if (
    initiativeService.getAllInitiatives({
      orderKey: "date",
      orderBy: "asc",
    }).length === 0
  ) {
    const initiatives = [
      {
        sugestionId: "2",
        local: "Local 1",
        status: "pending",
        createdOn: new Date(),
        date: new Date("September 11, 2014"),
        duration: 60,
        maxParticipants: 10,
        minParticipants: 0,
        riskLevel: "low",
        eventType: "food_safety",
        isDeleted: false,
      },
      {
        sugestionId: "2",
        local: "Local 2",
        status: "pending",
        createdOn: new Date(),
        date: new Date("September 11, 2024"),
        duration: 60,
        maxParticipants: 10,
        minParticipants: 0,
        riskLevel: "low",
        eventType: "healthy_diets",
        isDeleted: false,
      },
      {
        sugestionId: 1,
        local: "Local 3",
        status: "pending",
        createdOn: new Date(),
        date: new Date("September 11, 2001"),
        duration: 60,
        maxParticipants: 10,
        minParticipants: 0,
        riskLevel: "low",
        eventType: "zero_waste",
        isDeleted: false,
      },
      {
        sugestionId: 1,
        local: "Local 4",
        status: "pending",
        createdOn: new Date(),
        date: new Date("September 11, 2024"),
        duration: 60,
        maxParticipants: 10,
        minParticipants: 0,
        riskLevel: "low",
        eventType: "food_rescue",
        isDeleted: false,
      },
    ];
    initiatives.forEach(async (initiative) => {
      await initiativeService.createInitiative(initiative);
    });
  }

  //routes da landing page
  const urlParams = new URLSearchParams(window.location.search);
  const eventType = urlParams.get("event_type");
  const time = urlParams.get("time");
  const initiativeInput = urlParams.get("initiative");

  console.log({ eventType, time });
  if (eventType) {
    const eventTypeDropdown = document.getElementById("event_type");
    eventTypeDropdown.value = eventType;

    if (time) {
      const timeDropdown = document.getElementById("time");
      timeDropdown.value = time;

      if (initiativeInput) {
        const initiativeInputField =
          document.getElementsByName("initiative")[0];
        initiativeInputField.value = initiativeInput;

        queryInitiatives(initiativeInput, eventType, time);
      } else {
        queryInitiatives("", eventType, time);
      }
    } else {
      if (initiativeInput) {
        const initiativeInputField =
          document.getElementsByName("initiative")[0];
        initiativeInputField.value = initiativeInput;

        queryInitiatives(initiativeInput, eventType, "");
      } else {
        queryInitiatives("", eventType, "");
      }
    }
  } else {
    if (time) {
      const timeDropdown = document.getElementById("time");
      timeDropdown.value = time;

      if (initiativeInput) {
        const initiativeInputField =
          document.getElementsByName("initiative")[0];
        initiativeInputField.value = initiativeInput;

        queryInitiatives(initiativeInput, "", time);
      } else {
        queryInitiatives("", "", time);
      }
    } else {
      if (initiativeInput) {
        const initiativeInputField =
          document.getElementsByName("initiative")[0];
        initiativeInputField.value = initiativeInput;

        queryInitiatives(initiativeInput, "", "");
      } else {
        queryInitiatives("", "", "");
      }
    }
  }
};

function queryInitiatives(initiativeInput, eventType, time) {
  const initiativeService = new InitiativeService();

  const query =
    String(eventType).trim().length === 0
      ? {
          orderBy: "date",
          orderKey: "asc",
        }
      : {
          eventType: eventType,
          orderKey: "date",
          orderBy: "asc",
        };

  const initiatives = initiativeService.getAllInitiatives(query);

  console.log({ initiatives });

  const suggestionServic = new SuggestionService();
  const suggestions = suggestionServic.getAllSuggestions({
    orderBy: "date",
    orderKey: "asc",
  });

  console.log({ suggestions });

  const container = document.getElementById("initiative-list");
  container.innerHTML = "";

  //header certo
  let header = document.createElement("div");
  header.className = "section-heading col-lg-12 row";
  if (String(time).trim().length !== 0) {
    if (time === "closed") {
      header.innerHTML = `
      <h4>Our <em>Closed</em> Initiatives</h4>
      <h6>Use the time filter for more options</h6>`;
    } else {
      header.innerHTML = `
      <h4>Our <em>Open</em> Initiatives</h4>
      <h6>Use the time filter for more options</h6>`;
    }
  } else {
    header.innerHTML = `
    <h4><em>All</em> Our Initiatives</h4>
    <h6>Use the time filter for more options</h6>`;
  }
  container.appendChild(header);

  initiatives.forEach((initiative) => {
    let suggestionRel;
    try {
      suggestionRel = suggestionService.getAllSuggestions({
        id: initiative.sugestionId,
        orderBy: "date",
        orderKey: "asc",
      })[0];
      if (!suggestionRel) {
        console.log("Nao ha sugestao relacionada a esta iniciativa");
        return;
      }
    } catch (e) {
      console.log("Nao ha sugestao relacionada a esta iniciativa");
      return;
    }

    //ver o nome e o form
    if (String(initiativeInput).trim().length !== 0) {
      if (
        !String(suggestionRel.eventName)
          .trim()
          .toLowerCase()
          .includes(String(initiativeInput).trim().toLowerCase())
      )
        return;
    }

    //ver se ja passou a data do evento
    if (String(time).trim().length !== 0) {
      const now = new Date();
      if (new Date(initiative.date) > now) {
        if (time === "closed") return;
      } else {
        if (time === "open") return;
      }
    }

    //sacar os icones conforme o tipo de evento
    let iconRef = "";
    let photoRef = "";
    switch (initiative.eventType) {
      case "food_safety":
        iconRef = "assets/images/types/shield-shaded.svg";
        photoRef = "assets/images/types/popular-01.png";
        break;
      case "healthy_diets":
        iconRef = "assets/images/types/heart-half.svg";
        photoRef = "assets/images/types/popular-02.png";
        break;
      case "zero_waste":
        iconRef = "assets/images/types/bootstrap-reboot.svg";
        photoRef = "assets/images/types/popular-03.png";
        break;
      case "food_rescue":
        iconRef = "assets/images/types/truck.svg";
        photoRef = "assets/images/types/popular-04.png";
        break;
      default:
        console.log("Invalid event type");
        iconRef = "";
        photoRef = "";
        break;
    }

    //num de participantes
    const numParticipants = initiativeService.getParticipants(initiative.id).length;

    const div = document.createElement("div");
    div.className = "initiative-item";
    div.innerHTML = `
      <div class="col-lg-12">
        <div class="initiative-item" style="margin-bottom: 0px">
          <div class="top-content">
            <span class="award">Register before</span>
            <span class="price">${new Date(initiative.date)
              //.setDate(initiative.date - 7)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}</span>
          </div>
          <img src="assets/images/logo.png" alt="logo" style="width: 278px"/>
          <h4>${suggestionRel.eventName}</h4>
          <div class="info">
          <span class="participants">
            <img src="assets//images/icon-03.png" alt="" style="height: 24px"/><br />
            ${numParticipants} participantes
          </span>
          <span class="date">
            <img src="${iconRef}" alt="" /><br />
            ${initiative.eventType}
            </span>
        </div>
          <div class="border-button">
            <a href="initiative-details.html?id=${
              initiative.id
            }">Register Now!</a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

document
  .getElementById("search-form")
  .addEventListener("change", function (event) {
    event.preventDefault();

    const initiativeInput = document.getElementsByName("initiative")[0].value;
    const eventType = document.getElementById("event_type").value;
    const time = document.getElementById("time").value;

    console.log({ initiativeInput, eventType, time });
    queryInitiatives(initiativeInput, eventType, time);
  });
