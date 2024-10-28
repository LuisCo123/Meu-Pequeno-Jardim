interface bayInterface{
    id:string,
    name:string,
    lightHours:string,
    waterPercent:string,
    lightHoursGived?:string,
    waterPercentGived?:string,
}
export interface PlantInformationInterface {
    topicName:string,
    bay?:bayInterface[]
}
