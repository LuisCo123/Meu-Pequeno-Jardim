import { BiArrowBack, BiCheck, BiEdit } from "react-icons/bi"
import { useContext, useEffect, useState } from "react";
import { BsSun } from "react-icons/bs";
import { GiWaterDrop } from "react-icons/gi";
import { animated, useSpring } from '@react-spring/web'
import { StorageService } from "../../services/storageService";
import { PlantInformationInterface } from "../../interfaces/plantInformationInterface";
import { PlantInformationContext } from "../../context/plantInformationContext";
import { CardComponent } from "../../components/cardsComponent";
export const DataSheetPage = () => {
    const { plantInformation, setPlantInformation, connected } = useContext(PlantInformationContext);
    // const [mqttConnected, setMqttConnected] = useState<boolean>(false);

    const [springs1, api1] = useSpring(() => ({
        from: {
            y: 0,
            opacity: 0
        },
        config: {
            duration: 1000
        }
    }))
    const [springs2, api2] = useSpring(() => ({
        from: {
            y: 0,
            opacity: 0
        },
        config: {
            duration: 1000
        }
    }))

    const connect = (plantInformationStorage:PlantInformationInterface) => {
        setPlantInformation(plantInformationStorage)
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        connect({...plantInformation,topicName:e.target.identify.value});
    }
    const voltar = () => {
        connect({topicName:""});
    }
    useEffect(() => {
        let plantInformationStorage: PlantInformationInterface | null = StorageService.getPlantInformation();
        if (plantInformationStorage) {
            connect(plantInformationStorage);
        }
    }, [])
    useEffect(() => {
        if (connected) {
            api2.start({
                from: { opacity: 0 }
            })
            api1.start({
                from: {
                    y: -60,
                    opacity: 0
                },
                to: {
                    y: 0,
                    opacity: 1
                },
                onRest: (e) => {
                    if (e.finished) {
                        api2.start({
                            from: {
                                y: -60,
                                opacity: 0
                            },
                            to: {
                                y: 0,
                                opacity: 1
                            },
                        })
                    }
                }
            })
        }
    }, [connected])
    return (
        <div>
            <div className="hero bg-base-200 min-h-screen pt-16">
                <div className="hero-content text-center max-w-none">
                    {
                        connected ?
                            <div className="flex flex-col gap-6">
                                <div className="gap-5 flex flex-col 2xl:flex-row">
                                    <CardComponent animation={springs1} idBay={0} plantInformationParameter={plantInformation.bay?plantInformation.bay[0]:undefined}/>
                                    <CardComponent animation={springs2} idBay={1} plantInformationParameter={plantInformation.bay?plantInformation.bay[1]:undefined}/>
                                </div>
                                <div>
                                    <button className="btn btn-secondary btn-circle text-3xl" onClick={()=> voltar()}><BiArrowBack /></button>
                                </div>
                            </div>
                            :
                            <div className="max-w-md">
                                <h1 className="text-5xl font-bold">Bem vindo a sua fazenda!</h1>
                                <p className="py-6 text-start"> Insira no campo abaixo o identificador de sua fazenda ele deve seguir o seguinte formato:<br /><b>{'{Nome Do Wifi Conectado - ipDoEquipamento}'}<br />EX: Meu Wifi - 192.168.0.37</b>
                                </p>
                                <form id="loginForm" className="w-full max-w-xs" onSubmit={(e) => handleSubmit(e)}>
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text">Identificador</span>
                                        </div>
                                        <div className="flex flex-row gap-5">
                                            <input name='identify' required type="text" placeholder="Meu Wifi - xxx.xxx.xxx.xxx" className="input input-bordered w-full max-w-xs" />
                                            <button className="btn btn-circle btn-secondary"> <BiCheck /></button>
                                        </div>
                                    </label>
                                </form>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}