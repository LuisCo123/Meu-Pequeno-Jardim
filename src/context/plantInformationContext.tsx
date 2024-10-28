import { createContext, useEffect, useState } from "react";
import { PlantInformationInterface } from "../interfaces/plantInformationInterface";
import mqtt from "mqtt";
import { StorageService } from "../services/storageService";

interface PlantContextType {
    plantInformation: PlantInformationInterface;
    setPlantInformation: React.Dispatch<React.SetStateAction<PlantInformationInterface>>;
    connected: boolean
}

const defaultValue: PlantContextType = {
    plantInformation: {
        topicName: "",
    },
    setPlantInformation: () => { },
    connected: false
};
let connectedSingleton = false;
export const PlantInformationContext = createContext<PlantContextType>(defaultValue);
export const PlantInformationProvider = ({ children }: { children: any }) => {

    const [plantInformation, setPlantInformation] = useState<PlantInformationInterface>({ topicName: "" });
    const [connected, setConnected] = useState<boolean>(false);
    const client = mqtt.connect("wss://test.mosquitto.org:8081");
    let oldTopicName = "";
    useEffect(() => {
        if (client) {
            if (!connectedSingleton)
                client.on('connect', () => {
                    console.log("Mqtt Conectado com sucesso -> broker:wss://test.mosquitto.org:8081");
                    connectedSingleton = true;
                });
            client.on('error', (err) => {
                console.log('Connection error: ', err);
                connectedSingleton=false;
                client.end();
            });
            client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                console.log(payload);
            });
        }
    }, [client]);

    useEffect(() => {
        if (plantInformation.topicName && plantInformation.topicName != "" && client) {

            client.subscribe(plantInformation.topicName, (err) => {
                if (!err) {
                    client.publish(plantInformation.topicName, "Hello mqtt: message connection from"+plantInformation.topicName );
                    StorageService.setItem(plantInformation,"plantInformation");
                    setConnected(true);
                }
            });
        } else if (plantInformation.topicName == "") {
            if (oldTopicName != plantInformation.topicName)
                client.unsubscribe(oldTopicName, (err) => {
                    if (!err) {
                        console.log("unsubscribe from: ", oldTopicName);
                    } else
                        console.log(err);
                });
            setConnected(false);
        }
        oldTopicName = plantInformation.topicName;
    }, [plantInformation])
    return (
        <PlantInformationContext.Provider value={{ plantInformation, setPlantInformation, connected }}>
            {children}
        </PlantInformationContext.Provider>
    )
}
export default PlantInformationProvider;