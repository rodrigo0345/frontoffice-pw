import { Repository } from "./RepositoryInterface.js";
export default class MediaModelRepository {
    repo = new Repository();
    localStorage = window.localStorage;
    prefix = "media-";
    last_id = "media_last_id";
    constructor(localStorage) {
        localStorage = localStorage;
    }
    create(media) {
        return this.repo.create(media, this.localStorage, this.prefix, this.last_id);
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
//# sourceMappingURL=MediaModelRepository.js.map