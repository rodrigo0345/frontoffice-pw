import FoodRepository from "../repositories/FoodModelRepository";
export default class FoodService {
    foodRepository = new FoodRepository();
    constructor() { }
    createFood(food) {
        if (isNaN(Number(food.price)) || isNaN(Number(food.risk))) {
            throw new Error('Price and Risk need to be a number');
        }
        if (!(0 < food.risk && food.risk <= 5)) {
            throw new Error('Risk needs to be between 0 and 5  ');
        }
        return this.foodRepository.create(food);
    }
    updateFood(id, data) {
        if (isNaN(Number(data.price)) || isNaN(Number(data.risk))) {
            throw new Error('Price and Risk need to be a number');
        }
        if (!(0 < data.risk && data.risk <= 5)) {
            throw new Error('Risk needs to be between 0 and 5  ');
        }
        return this.foodRepository.update(id, data);
    }
    deleteFood(id) {
        return this.foodRepository.delete(id);
    }
    findFood(query) {
        return this.foodRepository.find(query);
    }
    listFood(query) {
        return this.foodRepository.all(query);
    }
}
//# sourceMappingURL=FoodService.js.map