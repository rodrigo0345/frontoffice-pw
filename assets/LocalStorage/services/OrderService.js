import FoodListRepository from "../repositories/FoodListRepository";
import FoodModelRepository from "../repositories/FoodModelRepository";
import InitiativeRepository from "../repositories/InitiativeRepository";
import JobRepository from "../repositories/JobRepository";
import OrderRepository from "../repositories/OrderRepository";
import SuggestionRepository from "../repositories/SuggestionRepository";
import UserRepository from "../repositories/UserRepository";
import WorkingInRepository from "../repositories/WorkingInRepository";
export default class OrdersService {
    initiativeRepository = new InitiativeRepository();
    suggestionRepository = new SuggestionRepository();
    workingInRepository = new WorkingInRepository();
    jobRepository = new JobRepository();
    usersRepository = new UserRepository();
    foodRepository = new FoodModelRepository();
    foodListRepository = new FoodListRepository();
    orderRepository = new OrderRepository();
    constructor() { }
    makeOrder(order, listOfFood) {
        if (listOfFood.length === 0) {
            throw new Error("You must select at least one food item.");
        }
        // get the food
        const foods = [];
        listOfFood.forEach((foodId) => {
            const food = this.foodRepository.find({ id: foodId.foodId });
            if (!food) {
                throw new Error("Food not found.");
            }
            foods.push(food);
        });
        order.price = foods.reduce((acc, food) => acc +
            food.price *
                (listOfFood.find((f) => f.foodId === food.id)?.quantity ?? 0), 0);
        order.isDeleted = false;
        order.status = "pending";
        // verifica se o usuário existe
        const initiative = this.initiativeRepository.find({
            id: order.initiativeId,
        });
        if (!initiative) {
            throw new Error("Initiative not found.");
        }
        const result = this.orderRepository.create(order);
        foods.forEach((food) => {
            const f = listOfFood.find((f) => f.foodId === food.id);
            if (!f)
                throw new Error("Food not found.");
            this.foodListRepository.create({
                id: 0,
                orderId: result.id,
                foodId: food.id,
                quantity: f.quantity,
            });
        });
        return result;
    }
    pickOrder(id) {
        const order = this.orderRepository.find({ id });
        if (!order) {
            throw new Error("Order not found.");
        }
        if (order.status === "completed") {
            throw new Error("Order already completed.");
        }
        if (order.status === "cancelled") {
            throw new Error("Order was cancelled, request a new one.");
        }
        order.status = "completed";
        return this.orderRepository.update(id, order);
    }
    cancelOrder(id) {
        const order = this.orderRepository.find({ id });
        if (!order) {
            throw new Error("Order not found.");
        }
        if (order.status === "completed") {
            throw new Error("Order already completed.");
        }
        if (order.status === "cancelled") {
            throw new Error("Order was already cancelled.");
        }
        order.status = "cancelled";
        return this.orderRepository.update(id, order);
    }
}
//# sourceMappingURL=OrderService.js.map