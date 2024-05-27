import InitiativeService from "../LocalStorage/services/InitiativeService.js";
import UserService from "../LocalStorage/services/UserService.js";
import SuggestionService from "../LocalStorage/services/SuggestionService.js";

window.onload = ({}) => {
  const initiativeService = new InitiativeService({});
  const userService = new UserService({});
  const openInitiatives = initiativeService
    .getAllInitiatives({ status: "approved" })
    .filter((init) => {
      return new Date(init.date) > new Date();
    });
  const fsInit = openInitiatives.filter(
    (init) => init.eventType === "food_safety"
  ).length;
  const hdInit = openInitiatives.filter(
    (init) => init.eventType === "healthy_diets"
  ).length;
  const zwInit = openInitiatives.filter(
    (init) => init.eventType === "zero_waste"
  ).length;
  const fdInit = openInitiatives.filter(
    (init) => init.eventType === "food_rescue"
  ).length;
  const nParticipants = initiativeService
    .getAllInitiatives({ status: "approved" })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue.maxParticipants;
    }, 0);
  if (document.getElementById("nParticipants")) {
    document.getElementById("nParticipants").innerHTML =
      nParticipants + "<br>Participants";
  }
  const nEvents = initiativeService.getAllInitiatives({
    status: "approved",
  }).length;
  if (document.getElementById("nEvents")) {
    document.getElementById("nEvents").innerHTML = nEvents + "<br>Events";
  }
  const nWorkers = userService.listUsers({}).length;
  if (document.getElementById("nWorkers")) {
    document.getElementById("nWorkers").innerHTML =
      nWorkers + "<br>Workers";
  }
  const pastInitiatives = initiativeService
    .getAllInitiatives({
      status: "approved",
      orderBy: "date",
      orderKey: "asc",
    })
    .filter((init) => {
      return new Date(init.date) < new Date();
    });
  const formatEventType = (eventType) => {
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
        return "Unknown";
    }
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const populatePastEvents = (initiatives) => {
    initiatives.forEach((init, index) => {
      if (index < 3) {
        document.getElementById(`pEventsParticipants${index}`).innerText =
          init.maxParticipants + " participants";
        document.getElementById(`pEventsType${index}`).innerText =
          formatEventType(init.eventType);
        document.getElementById(`pEventsDate${index}`).innerText =
          formatDate(init.date);
        document.getElementById(`pEventsLocal${index}`).innerText =
          init.local;
      }
    });
  };
  const createListItem = (label, value) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${label}:</span> ${value}`;
    return li;
  };
  const populateCarousel = (initiatives) => {
    initiatives.forEach((init, index) => {
      if (index < 9) {
        const titleElement = document.getElementById(
          `carousel-title${index}`
        );
        const ul = document.getElementById(`carousel-list${index}`);
        if (titleElement && ul) {
          titleElement.innerText = formatEventType(init.eventType);
          ul.innerHTML = ""; // Clear any existing content
          ul.appendChild(createListItem("Location", init.local));
          ul.appendChild(createListItem("Date", formatDate(init.date)));
          ul.appendChild(
            createListItem(
              "Participants",
              `${init.maxParticipants} participants`
            )
          );
        }
      }
    });
  };
  /* TODO carousel disfunctional
  $(document).ready(function () {
    const initiatives = initiativeService.getAllInitiatives({
      status: "approved",
    });
    populateCarousel(initiatives);
    $(".owl-carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      items: 3,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
      },
    });
  });
  $(".owl-carousel").on("translated.owl.carousel", function (event) {
    const items = event.item.count; // Number of items in the carousel
    for (let i = 0; i < items; i++) {
      const item = $(".owl-item").eq(i).find(".item");
      if (item.find(".content").html().trim() === "") {
        // If content is empty, repopulate it
        const init = initiatives[i];
        if (init) {
          const titleElement = item.find("h4");
          const ul = item.find("ul");
          if (titleElement && ul) {
            titleElement.innerText = formatEventType(init.eventType);
            ul.html(""); // Clear any existing content
            ul.append(createListItem("Location", init.local));
            ul.append(createListItem("Date", formatDate(init.date)));
            ul.append(
              createListItem(
                "Participants",
                `${init.maxParticipants} participants`
              )
            );
          }
        }
      }
    }
  });
  */
  if (document.getElementById("pEventsParticipants0")) {
    populatePastEvents(pastInitiatives);
  }
  if (
    document.getElementById(
      "carousel-title0" ||
        "carousel-title1" ||
        "carousel-title2" ||
        "carousel-title3" ||
        "carousel-title4" ||
        "carousel-title5" ||
        "carousel-title6" ||
        "carousel-title7" ||
        "carousel-title8"
    )
  ) {
    populateCarousel(pastInitiatives);
  }
  if (document.getElementById("fs-init")) {
    document.getElementById("fs-init").innerText = fsInit;
  }
  if (document.getElementById("hd-init")) {
    document.getElementById("hd-init").innerText = hdInit;
  }
  if (document.getElementById("zw-init")) {
    document.getElementById("zw-init").innerText = zwInit;
  }
  if (document.getElementById("fd-init")) {
    document.getElementById("fd-init").innerText = fdInit;
  }
  const updateMaxParticipants = (eventType, elementId) => {
    const maxParticipants = openInitiatives
      .filter((init) => init.eventType === eventType)
      .reduce((max, init) => Math.max(max, init.maxParticipants), 0);
    if (document.getElementById(elementId)) {
      document.getElementById(
        elementId
      ).innerHTML = `<i class="fa-solid fa-user"></i> ${maxParticipants}`;
    }
  };
  updateMaxParticipants("food_safety", "foodSafetyMaxParticipants");
  updateMaxParticipants("healthy_diets", "healthyDietsMaxParticipants");
  updateMaxParticipants("zero_waste", "zeroWasteMaxParticipants");
  updateMaxParticipants("food_rescue", "foodRescueMaxParticipants");
};

document.getElementById("suggestionForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const suggestionService = new SuggestionService({});

    const eventName = document.getElementById("eventName").value;
    const email = document.getElementById("email").value;
    const eventType = document.getElementById("initiativeType").value;
    const numParticipants = document.getElementById("numParticipants").value;
    const budget = document.getElementById("budget").value;
    const local = document.getElementById("local").value;
    const description = document.getElementById("description").value;

  console.log({
    budgetElement: budget,
    numParticipantsElement: numParticipants,
  })

    const suggestion = {
        eventName,
        eventType,
        status: "Pending",
        createdOn: new Date(),
        rejectedReason: "",
        email,
        local,
        description,
        isApproved: false,
        isDeleted: false,
        budget,
        numParticipants 
    };
    try {
        suggestionService.createSuggestion(suggestion);
        alert("Suggestion submitted successfully!");
    } catch (error) {
        console.error(error);
        alert("An error occurred while submitting your suggestion. Please try again later.");
    }
});
