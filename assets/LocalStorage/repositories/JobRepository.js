import { Repository } from "./RepositoryInterface.js";
export default class JobRepository {
    localStorage = window.localStorage;
    prefix = "job-";
    last_id = "job_last_id";
    repo = new Repository();
    constructor(localStorage) {
        localStorage = localStorage;
    }
    create(job) {
        return this.repo.create(job, this.localStorage, this.prefix, this.last_id);
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
//# sourceMappingURL=JobRepository.js.map