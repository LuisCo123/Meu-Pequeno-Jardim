import { BiArrowBack, BiCheck, BiEdit, BiSun, BiWater } from "react-icons/bi"
import { useContext, useEffect, useState } from "react";
import { BsSun, BsWater } from "react-icons/bs";
import { GiWaterDrop } from "react-icons/gi";
import { animated, useSpring } from '@react-spring/web'
import { StorageService } from "../../services/storageService";
import { PlantInformationInterface } from "../../interfaces/plantInformationInterface";
import { PlantInformationContext } from "../../context/plantInformationContext";
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

    const connect = (topicName: string) => {
        setPlantInformation({ ...plantInformation, topicName: topicName })
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        connect(e.target.identify.value);
    }
    const voltar = ()=>{
        connect("");
    }
    useEffect(() => {
        let plantInformation: PlantInformationInterface | null = StorageService.getPlantInformation();
        if (plantInformation) {
            connect(plantInformation.topicName);
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
                                    <animated.div style={{ ...springs1 }}>
                                        <div className="relative rounded-2xl min-w-72 flex flex-col lg:flex-row bg-base-100 shadow-xl">
                                            <div className="h-52 w-72 lg:h-full lg:w-80">
                                                <img className="h-52 w-full lg:w-80 lg:h-auto object-cover " src="Salsinha.jpg" alt="BaiaFoto" />
                                            </div>
                                            <div className="card-body  relative items-center pt-16">
                                                <h2 className="card-title">Baía de <b>Salsinha</b></h2>
                                                <p>Inicio do cultivo: xx/xx/xxxx</p>
                                                <h3 className="font-bold text-xl text-start">Status</h3>
                                                <div className="flex flex-col gap-5">
                                                    <div className="flex gap-3 flex-col">
                                                        <p className="w-full justify-center flex flex-row gap-2 items-center font-semibold text-lg">Luz<BsSun /></p>
                                                        <div className="flex flex-row justify-evenly items-center">
                                                            <div>
                                                                <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Esperado </p>
                                                                <p className="flex flex-row gap-2 font-semibold text-base justify-center">18 hr/D </p>
                                                            </div>
                                                            <div>
                                                                <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Recebido </p>
                                                                <p className="flex flex-row gap-2 font-semibold text-base justify-center">9 hr/D </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row gap-3 items-center">
                                                            <p><BsSun /></p>
                                                            <progress className="progress progress-warning w-32 lg:w-80" value="50" max="100"></progress>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 flex-col">
                                                        <p className="w-full justify-center flex flex-row gap-2 items-center font-semibold text-lg">Umidade<GiWaterDrop /></p>
                                                        <div className="flex flex-row justify-evenly items-center">
                                                            <div>
                                                                <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Esperado </p>
                                                                <p className="flex flex-row gap-2 font-semibold text-base justify-center">60%</p>
                                                            </div>
                                                            <div>
                                                                <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Atual </p>
                                                                <p className="flex flex-row gap-2 font-semibold text-base justify-center">65% </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row gap-3 items-center">
                                                            <p><GiWaterDrop /></p>
                                                            <progress className="progress progress-info lg:w-80 w-32" value="120" max="100"></progress>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn btn-ghost absolute right-0 top-0 text-3xl"><BiEdit /></button>
                                        </div>
                                    </animated.div>
                                    <animated.div style={{ ...springs2 }}>
                                        <div className="relative rounded-2xl min-w-72 flex flex-col lg:flex-row bg-base-100 shadow-xl">
                                            <div className="h-52 w-72 lg:h-full lg:w-80">
                                                <img className="h-52 w-full lg:w-80 lg:h-auto object-cover " src="Tomate.jpg" alt="BaiaFoto" />
                                            </div>
                                            <div className="card-body  relative items-center pt-16">
                                                <h2 className="card-title">Baía de <b>Tomates</b></h2>
                                                <p>Inicio do cultivo: xx/xx/xxxx</p>
                                                <h3 className="font-bold text-xl text-start">Status</h3>
                                                <div className="flex flex-col gap-5">
                                                    <div className="flex gap-3 flex-col">
                                                        <p className="w-full justify-center flex flex-row gap-2 items-center font-semibold text-lg">Luz<BsSun /></p>
                                                        <div className="flex flex-row justify-evenly items-center">
                                                            <div>
                                                                <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Esperado </p>
                                                                <p className="flex flex-row gap-2 font-semibold text-base justify-center">13 hr/D </p>
                                                            </div>
                                                            <div>
                                                                <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Recebido </p>
                                                                <p className="flex flex-row gap-2 font-semibold text-base justify-center">13 hr/D </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row gap-3 items-center">
                                                            <p><BsSun /></p>
                                                            <progress className="progress progress-warning lg:w-80 w-32" value="100" max="100"></progress>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 flex-col">
                                                        <p className="w-full justify-center flex flex-row gap-2 items-center font-semibold text-lg">Umidade<GiWaterDrop /></p>
                                                        <div className="flex flex-row justify-evenly items-center">
                                                            <div>
                                                                <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Esperado </p>
                                                                <p className="flex flex-row gap-2 font-semibold text-base justify-center">50%</p>
                                                            </div>
                                                            <div>
                                                                <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Atual </p>
                                                                <p className="flex flex-row gap-2 font-semibold text-base justify-center">45% </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row gap-3 items-center">
                                                            <p><GiWaterDrop /></p>
                                                            <progress className="progress progress-info lg:w-80 w-32" value="90" max="100"></progress>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn btn-ghost absolute right-0 top-0 text-3xl"><BiEdit /></button>
                                        </div>
                                    </animated.div>
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