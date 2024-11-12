export const TimeService = {
    formatTime(seconds: any) {
        const date = new Date(seconds * 1000); // Converter segundos para milissegundos
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const secs = date.getUTCSeconds();

        // Formatar para dois dígitos
        const formatNumber = (num: any) => num.toString().padStart(2, '0');

        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(secs)}`;
    },
    convertToSeconds(timeString: any) {
        if(timeString){
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            return hours * 3600 + minutes * 60 + seconds;
        }
    }
}