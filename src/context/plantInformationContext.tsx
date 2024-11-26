import { createContext, useEffect, useState } from "react";
import { BayInterface, PlantInformationInterface } from "../interfaces/plantInformationInterface";
import mqtt from "mqtt";
import { StorageService } from "../services/storageService";
import { TimeService } from "../services/timeService";
interface PlantContextType {
    plantInformation: PlantInformationInterface;
    setPlantInformation: React.Dispatch<React.SetStateAction<PlantInformationInterface>>;
    connected: boolean,
    setSendMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValue: PlantContextType = {
    plantInformation: {
        topicName: "",
    },
    setPlantInformation: () => { },
    connected: false,
    setSendMessage: () => { },
};
let connectedSingleton = false;
export const PlantInformationContext = createContext<PlantContextType>(defaultValue);
export const PlantInformationProvider = ({ children }: { children: any }) => {

    const [plantInformation, setPlantInformation] = useState<PlantInformationInterface>({ topicName: "", bay: [{ id: 0, lightTimePickerDefault: "", name: "", umySensorValueDefault: "" }, { id: 1, lightTimePickerDefault: "", name: "", umySensorValueDefault: "" }] });
    const [connected, setConnected] = useState<boolean>(false);
    const [sendMessage, setSendMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const client = mqtt.connect("wss://broker.eqmx.io:8084");
    let oldTopicName = "";

    useEffect(() => {
        if (client) {
            if (!connectedSingleton) {
                client.on('connect', () => {
                    console.log("Mqtt Conectado com sucesso -> broker:wss://test.mosquitto.org:8081");
                });
                connectedSingleton = true;
            }
            client.on('error', (err) => {
                console.log('Connection error: ', err);
                connectedSingleton = false;
                client.end();
            });
            client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                const messageJson = JSON.parse(message.toString());
                let bayConfig: BayInterface[] = plantInformation.bay;
                if (messageJson) {
                    messageJson.forEach((element: any) => {
                        bayConfig[element.idBay].id = element.idBay;
                        bayConfig[element.idBay].name = "Baia " + element.idBay;
                        bayConfig[element.idBay].lightTimePickerDefault = TimeService.formatTime(element.lightTimePickerDefault);
                        bayConfig[element.idBay].lightTimePicker = TimeService.formatTime(element.lightTimePicker);
                        bayConfig[element.idBay].umySensorValueDefault = element.umySensorValueDefault;
                        bayConfig[element.idBay].umySensorValue = element.umySensorValue;
                    });
                    setPlantInformation({ ...plantInformation });
                }
            });
        }
    }, [client]);

    useEffect(() => {
        console.log(plantInformation.bay);
        if (plantInformation.topicName && plantInformation.topicName != "" && client && connected == false) {
            setLoading(true);
            client.subscribe(plantInformation.topicName + "-ESP", (err) => {
                if (!err) {
                    StorageService.setPlantInformation(plantInformation);
                    setConnected(true);
                    setLoading(false);
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
            StorageService.removeItem("plantInformation");
        } else {
            if (sendMessage) {
                let jsonData: [{ idBay: string, umySensorValue: number, umySensorValueDefault: number, lightTimePicker: number, lightTimePickerDefault: number }] | any = [];
                plantInformation.bay?.forEach(plant => {
                    let lightTimePickerDefault = TimeService.convertToSeconds(plant.lightTimePickerDefault);
                    jsonData.push(
                        {
                            idBay: plant.id,
                            lightTimePickerDefault: lightTimePickerDefault,
                            umySensorValueDefault: +plant.umySensorValueDefault!
                        }
                    )
                })
                client.publish(plantInformation.topicName, JSON.stringify(jsonData));
                setSendMessage(!sendMessage);
            }
            StorageService.setPlantInformation(plantInformation);
        }
        oldTopicName = plantInformation.topicName;
    }, [plantInformation])
    return (
        <PlantInformationContext.Provider value={{ plantInformation, setPlantInformation, connected, setSendMessage }}>
            {loading ?
                <div className="flex w-screen h-screen justify-center items-center absolute" >
                    <div className="h-screen w-screen bg-black opacity-70 z-10 absolute">

                    </div>
                    <div className="flex flex-col items-center z-10">
                        <span className="loading loading-dots loading-lg  bg-primary"></span>
                        <span>Carregando</span>
                    </div>
                </div> : null}
            {children}
        </PlantInformationContext.Provider>
    )
}
export default PlantInformationProvider;
