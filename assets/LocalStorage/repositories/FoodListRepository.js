import { Repository } from "./RepositoryInterface.js";
export default class FoodListRepository {
    repo = new Repository();
    localStorage = window.localStorage;
    prefix = "food-list-";
    last_id = "food_list_last_id";
    constructor(localStorage) {
        localStorage = localStorage;
    }
    create(initiative) {
        return this.repo.create(initiative, this.localStorage, this.prefix, this.last_id);
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
//# sourceMappingURL=FoodListRepository.js.map