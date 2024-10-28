import { PlantInformationInterface } from "../interfaces/plantInformationInterface";

export const StorageService = {
    setItem(item: PlantInformationInterface, key: string) {
        localStorage.setItem(key, JSON.stringify(item));
    },
    getPlantInformation(): PlantInformationInterface | null {
        let data = localStorage.getItem("plantInformation");
        if (data) {
            return JSON.parse(data);
        } else {
            return null;
        }
    },
    removeItem(key: string) {
        localStorage.removeItem(key);
    },
}