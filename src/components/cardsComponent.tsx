import { animated } from "@react-spring/web"
import { BiEdit } from "react-icons/bi"
import { BsSun } from "react-icons/bs"
import { GiWaterDrop } from "react-icons/gi"
import { FormEvent, useContext, useEffect, useState } from "react"
import { CgClose } from "react-icons/cg"
import { BayInterface } from "../interfaces/plantInformationInterface"
import { PlantInformationContext } from "../context/plantInformationContext"
import { TimeService } from "../services/timeService"
export const CardComponent = ({ plantInformationParameter, animation, idBay }: { plantInformationParameter?: BayInterface, animation: any, idBay: number }) => {

    const [editCreate, setEditCreate] = useState<boolean>(false);
    const { plantInformation, setPlantInformation, setSendMessage } = useContext(PlantInformationContext);
    const handleEdit = () => {
        if (plantInformationParameter)
            setEditCreate(!editCreate);
    }
    const startEdit = () => {
        setEditCreate(true);
    }

    const submitForm = (form: any) => {
        form.preventDefault();
        let plantInformationEdited: BayInterface = {
            id: idBay,
            lightTimePickerDefault: form.target.lightTimePickerDefault.value,
            name: form.target.name.value,
            umySensorValueDefault: form.target.umySensorValueDefault.value,
        }

        let plants: BayInterface[] | undefined = plantInformation.bay?.filter((e) => e.id != plantInformationEdited.id);
        if (plants) {
            plants?.push(plantInformationEdited);
            setPlantInformation({ ...plantInformation, bay: plants });
        } else {
            setPlantInformation({ ...plantInformation, bay: [plantInformationEdited] });
        }
        setSendMessage(true);
        setEditCreate(false);
    }
    useEffect(() => {
        if (plantInformationParameter && editCreate) {
            const form: HTMLFormElement = document.getElementById("CadastrarBaia" + idBay) as HTMLFormElement;
            // (form.elements.namedItem("name") as HTMLInputElement).value = plantInformationParameter.name;
            (form.elements.namedItem("lightTimePickerDefault") as HTMLInputElement).value = plantInformationParameter.lightTimePickerDefault;
            (form.elements.namedItem("umySensorValueDefault") as HTMLInputElement).value = plantInformationParameter.umySensorValueDefault;
        }
    }, [editCreate])
    return (

        <animated.div style={{ ...animation }}>
            {editCreate ?
                <div className="relative rounded-2xl min-w-72 flex flex-col lg:flex-row bg-base-100 shadow-xl">

                    <div className="card-body  relative items-center pt-16">
                        <h2 className="card-title">Cadastrar ou Editar Informações</h2>
                        <form id={"CadastrarBaia" + idBay} className="card-body" onSubmit={(e) => submitForm(e)}>
                            {/* <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Nome da baía</span>
                                </label>

                                <input name="name" type="nome" placeholder="nome" className="input input-bordered" required />

                            </div> */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Tempo de iluminação diária</span>
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <BsSun />
                                    <input className="w-full" name="lightTimePickerDefault" type="time" placeholder="T/ iluminação diária" step="2" required />
                                </label>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Umidade do Solo</span>
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <GiWaterDrop />
                                    <input className="w-full" name="umySensorValueDefault" type="number" placeholder="Umidade do Solo" required />
                                </label>
                            </div>
                            {/* <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Foto</span>
                                </label>
                                <input name="file" type="file" className="file-input file-input-bordered w-full max-w-xs" accept="image/png, image/jpeg" />
                            </div> */}
                            <div className="form-control mt-6 gap-4">
                                <button className="btn btn-primary">Confirmar</button>
                            </div>
                        </form>
                    </div>
                    <button className="btn btn-ghost absolute right-0 top-0 text-3xl" onClick={() => handleEdit()}><CgClose /></button>
                </div>
                :
                <div className="relative rounded-2xl min-w-72 flex flex-col lg:flex-row bg-base-100 shadow-xl">
                    <div className="h-52 w-full lg:h-full lg:w-80">
                        <img className="h-52 w-full lg:w-80 lg:h-auto object-cover " src={"Salsinha.jpg"} alt="BaiaFoto" />
                    </div>
                    <div className="card-body  relative items-center pt-16">
                        <h2 className="card-title">{plantInformationParameter?.name}</h2>
                        <p>Inicio do cultivo: xx/xx/xxxx</p>
                        <h3 className="font-bold text-xl text-start">Status</h3>
                        <div className="flex flex-col gap-5">
                            <div className="flex gap-3 flex-col">
                                <p className="w-full justify-center flex flex-row gap-2 items-center font-semibold text-lg">Luz<BsSun /></p>
                                <div className="flex flex-row justify-evenly items-center">
                                    <div>
                                        <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Recebido </p>
                                        <p className="flex flex-row gap-2 font-semibold text-base justify-center">{plantInformationParameter?.lightTimePicker} hr/D </p>
                                    </div>
                                    <div>
                                        <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Esperado </p>
                                        <p className="flex flex-row gap-2 font-semibold text-base justify-center">{plantInformationParameter?.lightTimePickerDefault} hr/D </p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3 items-center">
                                    <p><BsSun /></p>
                                    <progress className="progress progress-warning w-32 lg:w-80" value={TimeService.convertToSeconds(plantInformationParameter?.lightTimePicker)} max={TimeService.convertToSeconds(plantInformationParameter?.lightTimePickerDefault)}></progress>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-col">
                                <p className="w-full justify-center flex flex-row gap-2 items-center font-semibold text-lg">Umidade<GiWaterDrop /></p>
                                <div className="flex flex-row justify-evenly items-center">
                                    <div>
                                        <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Atual </p>
                                        <p className="flex flex-row gap-2 font-semibold text-base justify-center">{plantInformationParameter?.umySensorValue}%</p>
                                    </div>
                                    <div>
                                        <p className="flex flex-row gap-2 font-semibold text-lg justify-center">Esperado </p>
                                        <p className="flex flex-row gap-2 font-semibold text-base justify-center">{plantInformationParameter?.umySensorValueDefault}%</p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3 items-center">
                                    <p><GiWaterDrop /></p>
                                    <progress className="progress progress-info lg:w-80 w-32" value={plantInformationParameter?.umySensorValue} max={plantInformationParameter?.umySensorValueDefault}></progress>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-ghost absolute right-0 top-0 text-3xl" onClick={() => startEdit()}><BiEdit /></button>
                </div>
            }
        </animated.div>
    )
}