import { Repository } from "./RepositoryInterface.js";
export default class UserRepository {
    localStorage = window.localStorage;
    prefix = "user-";
    last_id = "user_last_id";
    repo = new Repository();
    constructor(localStorage) {
        localStorage = localStorage;
    }
    create(user) {
        return this.repo.create(user, this.localStorage, this.prefix, this.last_id);
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
//# sourceMappingURL=UserRepository.js.map