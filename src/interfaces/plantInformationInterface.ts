export interface BayInterface{
    id:string,
    name:string,
    lightTimePickerDefault:string,
    umySensorValueDefault:string,
    lightTimePicker?:string,
    umySensorValue?:string,
}
export interface PlantInformationInterface {
    topicName:string,
    bay?:BayInterface[]
}
