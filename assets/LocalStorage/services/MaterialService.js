import MaterialRepository from "../repositories/MaterialRepository";
export default class MaterialService {
    materialRepository = new MaterialRepository();
    constructor() { }
    createMaterial(material) {
        if (isNaN(Number(material.quantity))) {
            throw new Error('Invalid material quantity. Quantity must be a number.');
        }
        return this.materialRepository.create(material);
    }
    updateMaterial(id, data) {
        if (isNaN(Number(data.quantity))) {
            throw new Error('Invalid material quantity. Quantity must be a number.');
        }
        return this.materialRepository.update(id, data);
    }
    deleteMaterial(id) {
        return this.materialRepository.delete(id);
    }
    findMaterial(query) {
        return this.materialRepository.find(query);
    }
    allMaterial(query) {
        return this.materialRepository.all(query);
    }
}
//# sourceMappingURL=MaterialService.js.map