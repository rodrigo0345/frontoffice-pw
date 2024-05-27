import InitiativeRepository from "../repositories/InitiativeRepository.js";
import SuggestionRepository from "../repositories/SuggestionRepository.js";
export default class SuggestionService {
  suggestionRepository = new SuggestionRepository();
  initiativeRepository = new InitiativeRepository();
  constructor() { }
  createSuggestion(suggestion) {
    if (suggestion.eventName === "") {
      throw new Error("Event Name is required.");
    }

    if (suggestion.email === "") {
      throw new Error("Email is required.");
    }

    if (suggestion.description === "") {
      throw new Error("Description is required.");
    }

    if (suggestion.local === "") {
      throw new Error("Local is required.");
    }

    if (suggestion.numParticipants <= 0) {
      throw new Error("Number of Participants is required.");
    }

    if (isNaN(Number(suggestion.numParticipants))) {
      throw new Error("Number of Participants must be a number.");
    }

    if (isNaN(Number(suggestion.budget))) {
      throw new Error("Budget must be a number.");
    }

    if (suggestion.budget <= 0) {
      throw new Error("Budget is required.");
    }

    if (
      suggestion.eventName === "" ||
      suggestion.email === "" ||
      suggestion.description === "" ||
      suggestion.local === "" ||
      suggestion.numParticipants <= 0 ||
      isNaN(Number(suggestion.numParticipants)) ||
      isNaN(Number(suggestion.budget)) ||
      suggestion.budget <= 0
    ) {
      throw new Error(
        "Event Name, Email and Description, Local, Number of Participants are required.",
      );
    }
    if (suggestion.date <= new Date()) {
      throw new Error("Invalid Date");
    }
    if (
      suggestion.eventType !== "food_rescue" &&
      suggestion.eventType !== "healthy_diets" &&
      suggestion.eventType !== "food_safety" &&
      suggestion.eventType !== "zero_waste"
    ) {
      throw new Error("Event type needs to be valid");
    }
    suggestion.createdOn = new Date();
    suggestion.isApproved = false;
    suggestion.isDeleted = false;
    return this.suggestionRepository.create(suggestion);
  }
  find(query) {
    return this.suggestionRepository.find(query);
  }
  // nao cria a iniciativa automaticamente
  approveSuggestion(id) {
    const suggestion = this.suggestionRepository.find({ id });
    if (!suggestion) {
      throw new Error("Suggestion not found.");
    }
    suggestion.isApproved = true;
    suggestion.status = "Approved";
    return this.suggestionRepository.update(id, suggestion);
  }
  rejectSuggestion(id) {
    const suggestion = this.suggestionRepository.find({ id });
    if (!suggestion) {
      throw new Error("Suggestion not found.");
    }
    suggestion.isApproved = false;
    suggestion.status = "Rejected";
    return this.suggestionRepository.update(id, suggestion);
  }
  getAllSuggestions(query) {
    return this.suggestionRepository.all(query);
  }
}
//# sourceMappingURL=SuggestionService.js.map
