import { PlantInformationInterface } from "../interfaces/plantInformationInterface";

export const StorageService = {
    setItem(item: any, key: string) {
        localStorage.setItem(key, JSON.stringify(item));
    },
    setPlantInformation(item: PlantInformationInterface) {
        localStorage.setItem("plantInformation", JSON.stringify(item));
    },
    getPlantInformation(): PlantInformationInterface | null {
        let data = localStorage.getItem("plantInformation");
        if (data) {
            return JSON.parse(data);
        } else {
            return null;
        }
    },
    getItem(identify:string): any | null {
        let data = localStorage.getItem(identify);
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