import FoodListRepository from "../repositories/FoodListRepository.js";
import FoodModelRepository from "../repositories/FoodModelRepository.js";
import InitiativeRepository from "../repositories/InitiativeRepository.js";
import JobRepository from "../repositories/JobRepository.js";
import MaterialRepository from "../repositories/MaterialRepository.js";
import MediaModelRepository from "../repositories/MediaModelRepository.js";
import OrderRepository from "../repositories/OrderRepository.js";
import SuggestionRepository from "../repositories/SuggestionRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import ParticipantRepository from "../repositories/ParticipantRepository.js";
import WorkingInRepository from "../repositories/WorkingInRepository.js";
export default class InitiativeService {
    initiativeRepository = new InitiativeRepository();
    suggestionRepository = new SuggestionRepository();
    workingInRepository = new WorkingInRepository();
    jobRepository = new JobRepository();
    usersRepository = new UserRepository();
    participantRepository = new ParticipantRepository();
    orderRepository = new OrderRepository();
    foodListRepository = new FoodListRepository();
    foodRepository = new FoodModelRepository();
    materialsRepository = new MaterialRepository();
    mediaModelRepository = new MediaModelRepository();
    constructor() { }
    // the duration is in minutes
    createInitiative(initiative) {
        return this.initiativeRepository.create(initiative);
    }
    createInitiativeFromSuggestion(initiative) {
        // get the suggestion
        const result = this.suggestionRepository.find({
            id: initiative.sugestionId,
        });
        if (!result)
            throw new Error("Suggestion not found.");
        // aprova a sugestão automaticamente
        result.isApproved = true;
        // save the new changes to the suggestion
        this.suggestionRepository.update(result.id, result);
        // pass the suggestion to the initiative
        initiative.createdOn = new Date();
        initiative.isDeleted = false;
        initiative.sugestionId = result.id;
        initiative.eventType = result.eventType;
        initiative.local =
            initiative.local.trim() === "" ? result.local : initiative.local;
        initiative.maxParticipants =
            initiative.maxParticipants || result.numParticipants;
        initiative.minParticipants = 0;
        initiative.status = "pending";
        return this.initiativeRepository.create(initiative);
    }
    deleteInitiative(id) {
        return this.initiativeRepository.delete(id);
    }
    updateInitiative(id, data) {
        return this.initiativeRepository.update(id, data);
    }
    getAllInitiatives(query) {
        this.orderRepository.checkIfAnyOrderArrived();
        return this.initiativeRepository.all(query);
    }
    addWorker(initiativeId, workerId) {
        const initiative = this.initiativeRepository.find({ id: initiativeId });
        if (!initiative)
            throw new Error("Initiative not found.");
        const user = this.usersRepository.find({ id: workerId });
        if (!user)
            throw new Error("User not found.");
        if (user.jobId === 0)
            throw new Error("User does not have a job set yet.");
        // check if the user has a job and if is worker
        const job = this.jobRepository.find({ id: user.jobId });
        if (!job || user.role !== "worker")
            throw new Error("User is not a worker or does not have a job set yet.");
        // verifica que este utilizador não está já a trabalhar nesta iniciativa
        const workingInCheck = this.workingInRepository.find({
            initiativeId,
            userId: workerId,
        });
        if (workingInCheck)
            throw new Error("Worker already working here.");
        const w = {
            id: 0,
            initiativeId,
            userId: workerId,
            isDeleted: false,
            isPresent: false,
        };
        const workingIn = this.workingInRepository.create(w);
        if (!workingIn)
            throw new Error("Error adding worker.");
        return user;
    }
    removeWorker(initiativeId, workerId) {
        const workingIn = this.workingInRepository.find({
            initiativeId,
            userId: workerId,
        });
        if (!workingIn)
            return false;
        return this.workingInRepository.delete(workingIn.id);
    }
    getCalculatedCost(initiativeId) {
        const initiative = this.initiativeRepository.find({ id: initiativeId });
        if (!initiative)
            throw new Error("Initiative not found.");
        const sumWorkerCost = this.getStaffCost(initiativeId);
        // TODO: adicionar o custo das encomendas
        const orderList = this.orderRepository
            .all({ initiativeId })
            .filter((order) => order.status !== "cancelled");
        const foodPrice = orderList.reduce((acc, curr) => {
            return acc + curr.price;
        }, 0);
        const materialPrice = this.getMaterialCost(initiativeId);
        return sumWorkerCost + foodPrice + materialPrice;
    }
    getOrders(initiativeId, filterCancelled = true) {
        const initiative = this.initiativeRepository.find({ id: initiativeId });
        if (!initiative)
            throw new Error("Initiative not found.");
        let orderList = this.orderRepository.all({
            initiativeId,
            isDeleted: false,
        });
        if (filterCancelled)
            orderList = orderList.filter((order) => order.status !== "cancelled");
        return orderList;
    }
    getOrder(orderId, initiativeId) {
        return this.orderRepository.find({
            id: orderId,
            initiativeId: initiativeId,
        });
    }
    getFoodFromOrder(orderId) {
        const foodList = this.foodListRepository.all({ orderId });
        return foodList.map((food) => {
            const f = this.foodRepository.find({ id: food.foodId });
            if (!f)
                throw new Error("Food not found.");
            return f;
        });
    }
    isWorkerPresent(initiativeId, workerId) {
        const workingIn = this.workingInRepository.find({
            initiativeId,
            userId: workerId,
        });
        if (!workingIn)
            return false;
        return workingIn.isPresent;
    }
    getAvailableFood(initiativeId) {
        const initiative = this.initiativeRepository.find({ id: initiativeId });
        if (!initiative)
            throw new Error("Initiative not found.");
        const foodList = this.orderRepository
            .all({ initiativeId })
            .filter((order) => order.status === "completed")
            .map((order) => {
            return this.foodListRepository.all({ orderId: order.id });
        })
            .flat()
            .map((list) => {
            return this.foodRepository.find({ id: list.foodId });
        })
            .filter((food) => food !== null);
        return foodList;
    }
    createOrder(order, food) {
        const created = this.orderRepository.create(order);
        food.forEach((f) => {
            this.foodListRepository.create({
                id: 0,
                orderId: created.id,
                foodId: f.food.id,
                quantity: f.quantity,
            });
        });
        return created;
    }
    getRiskLevel(initiativeId) {
        // TODO
        const orderList = this.orderRepository
            .all({ initiativeId, isDeleted: false })
            .filter((order) => order.status !== "cancelled");
        const riskLevel = orderList.reduce((acc, curr) => {
            // get the food list
            const foodList = this.foodListRepository.all({ orderId: curr.id });
            const foodNumber = foodList.length;
            const foodListRisk = foodList.reduce((acc, curr) => {
                const food = this.foodRepository.find({ id: curr.foodId });
                console.log({ food });
                if (!food)
                    return acc;
                return acc + food.risk;
            }, 0);
            console.log({ foodListRisk, foodNumber, orderList: orderList.length });
            return acc + foodListRisk / foodNumber / orderList.length;
        }, 0);
        return riskLevel;
    }
    getNumInitiative(query) {
        return this.initiativeRepository.all(query).length;
    }
    addParticipant(initiativeId, participant) {
        // check if the initiative exists
        const initiative = this.initiativeRepository.find({ id: initiativeId });
        if (!initiative)
            throw new Error("Initiative not found.");
        // check if the participant is already in the initiative
        const participantCheck = this.participantRepository.find({
            email: participant.email,
            initiaveId: initiativeId,
        });
        if (participantCheck)
            throw new Error("Participant already in the initiative.");
        // check if the initiative is full
        const participants = this.participantRepository.all({ initiaveId: initiativeId });
        if (participants.length >= initiative.maxParticipants)
            throw new Error("Initiative is full.");
        // add the participant to the initiative
        participant.initiaveId = initiativeId;
        this.participantRepository.create(participant);
        return true;
    }
    removeParticipant(initiativeId, participantId) {
        const participant = this.participantRepository.find({ id: participantId, initiaveId: initiativeId });
        if (!participant)
            return false;
        return this.participantRepository.delete(participantId);
    }
    getParticipants(initiativeId) {
        return this.participantRepository.all({ initiaveId: initiativeId });
    }
    getStaffCost(initiativeId) {
        const workers = this.workingInRepository.all({ initiativeId });
        const cost = workers.reduce((acc, curr) => {
            const user = this.usersRepository.find({ id: curr.userId });
            if (!user)
                return acc;
            const job = this.jobRepository.find({ id: user.jobId });
            if (!job)
                return acc;
            return acc + job.costPerHour;
        }, 0);
        return cost;
    }
    getUsedMaterials(initiativeId) {
        const materials = this.materialsRepository.all({ initiativeId });
        return materials;
    }
    addMaterial(material) {
        return this.materialsRepository.create(material);
    }
    getMaterialCost(initiativeId) {
        const materials = this.materialsRepository.all({ initiativeId });
        return materials.reduce((acc, curr) => {
            return acc + curr.price * curr.quantity;
        }, 0);
    }
    getWorkers(initiativeId) {
        const workingIn = this.workingInRepository.all({ initiativeId });
        return workingIn
            .map((w) => {
            return this.usersRepository.find({ id: w.userId });
        })
            .filter((u) => u !== null);
    }
    addImage(initiativeId, imageFile) {
        // Convert the image file to a base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const media = {
                id: 0, // The id will be set by the repository
                initiativeId,
                data: base64String,
                isDeleted: false,
            };
            // Save the media model using the repository
            return this.mediaModelRepository.create(media);
        };
        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
        else {
            return null; // Handle the case where no file is selected
        }
    }
    getImages(initiativeId) {
        return this.mediaModelRepository.all({ initiativeId });
    }
    deleteImage(mediaId) {
        return this.mediaModelRepository.delete(mediaId);
    }
}
//# sourceMappingURL=InitiativeService.js.map