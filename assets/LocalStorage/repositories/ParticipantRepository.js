import { Repository } from "./RepositoryInterface.js";
export default class ParticipantRepository {
    localStorage = window.localStorage;
    prefix = "participant-";
    last_id = "participant_last_id";
    repo = new Repository();
    constructor(localStorage) {
        localStorage = localStorage;
    }
    create(participant) {
        return this.repo.create(participant, this.localStorage, this.prefix, this.last_id);
    }
    update(id, data) {
        return this.repo.update(id, data, this.localStorage, this.prefix);
    }
    delete(id) {
        return this.repo.delete(id, this.localStorage, this.prefix);
    }
    find(query) {
        return this.repo.find(query, this.localStorage, this.prefix);
    }
    all(query) {
        return this.repo.all(query, this.localStorage, this.prefix);
    }
}
//# sourceMappingURL=ParticipantRepository.js.map