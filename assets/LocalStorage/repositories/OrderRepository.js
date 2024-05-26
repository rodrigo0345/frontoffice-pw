import { Repository } from "./RepositoryInterface.js";
export default class OrderRepository {
    localStorage = window.localStorage;
    prefix = "order-";
    last_id = "order_last_id";
    repo = new Repository();
    constructor(localStorage) {
        localStorage = localStorage;
    }
    checkIfAnyOrderArrived() {
        const orders = this.all({});
        const now = new Date();
        orders.forEach((order) => {
            if (order.status === "completed" ||
                order.isDeleted === true ||
                order.status === "cancelled")
                return;
            if (new Date(order.deliveryDate).getTime() <= now.getTime()) {
                this.update(order.id, { ...order, status: "completed" });
            }
        });
    }
    create(order) {
        this.checkIfAnyOrderArrived();
        return this.repo.create(order, this.localStorage, this.prefix, this.last_id);
    }
    update(id, data) {
        return this.repo.update(id, data, this.localStorage, this.prefix);
    }
    delete(id) {
        this.checkIfAnyOrderArrived();
        return this.repo.delete(id, this.localStorage, this.prefix);
    }
    find(query) {
        this.checkIfAnyOrderArrived();
        return this.repo.find(query, this.localStorage, this.prefix);
    }
    all(query) {
        return this.repo.all(query, this.localStorage, this.prefix);
    }
}
//# sourceMappingURL=OrderRepository.js.map