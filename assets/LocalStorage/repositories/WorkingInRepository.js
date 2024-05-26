import { Repository } from "./RepositoryInterface.js";
export default class WorkingInRepository {
    localStorage = window.localStorage;
    prefix = "working_in-";
    last_id = "working_in_last_id";
    repo = new Repository();
    constructor(localStorage) {
        localStorage = localStorage;
    }
    create(working_in) {
        return this.repo.create(working_in, this.localStorage, this.prefix, this.last_id);
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
//# sourceMappingURL=WorkingInRepository.js.map