import { createContext, useEffect, useState } from "react";
import { BayInterface, PlantInformationInterface } from "../interfaces/plantInformationInterface";
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
    const [loading, setLoading] = useState<boolean>(false);
    const client = mqtt.connect("wss://test.mosquitto.org:8081");
    let oldTopicName = "";
    function formatTime(seconds:any) {
        const date = new Date(seconds * 1000); // Converter segundos para milissegundos
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const secs = date.getUTCSeconds();
      
        // Formatar para dois dígitos
        const formatNumber = (num:any) => num.toString().padStart(2, '0');
      
        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(secs)}`;
      }
    useEffect(() => {
        if (client) {
            if (!connectedSingleton)
                client.on('connect', () => {
                    console.log("Mqtt Conectado com sucesso -> broker:wss://test.mosquitto.org:8081");
                    connectedSingleton = true;
                });
            client.on('error', (err) => {
                console.log('Connection error: ', err);
                connectedSingleton = false;
                client.end();
            });
            client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                const messageJson = JSON.parse(message.toString());
                let bayConfig: BayInterface[] | undefined = plantInformation.bay;
                if (messageJson && bayConfig) {
                    messageJson.forEach((element:any) => {
                        bayConfig[element.idBay].id = element.idBay;
                        bayConfig[element.idBay].lightTimePickerDefault = formatTime(element.lightTimePickerDefault);
                        bayConfig[element.idBay].lightTimePicker = formatTime(element.lightTimePicker);
                        bayConfig[element.idBay].umySensorValueDefault = element.umySensorValueDefault;
                        bayConfig[element.idBay].umySensorValue = element.umySensorValue;
                    });
                setPlantInformation({...plantInformation});
                }
            });
        }
    }, [client]);

    useEffect(() => {
        if (plantInformation.topicName && plantInformation.topicName != "" && client && connected == false) {
            setLoading(true);
            client.subscribe(plantInformation.topicName + "-ESP", (err) => {
                if (!err) {
                    client.publish(plantInformation.topicName, "Hello mqtt: message connection from" + plantInformation.topicName);
                    console.log(plantInformation);
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
            StorageService.setPlantInformation(plantInformation);
        }
        oldTopicName = plantInformation.topicName;
    }, [plantInformation])
    return (
        <PlantInformationContext.Provider value={{ plantInformation, setPlantInformation, connected }}>
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