import { Repository } from "./RepositoryInterface.js";
export default class StockRepository {
    localStorage = window.localStorage;
    prefix = "stock-";
    last_id = "stock_last_id";
    repo = new Repository();
    constructor(localStorage) {
        localStorage = localStorage;
    }
    create(stock) {
        return this.repo.create(stock, this.localStorage, this.prefix, this.last_id);
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
//# sourceMappingURL=StockRepository.js.map