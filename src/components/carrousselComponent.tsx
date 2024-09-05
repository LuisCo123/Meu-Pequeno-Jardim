export const CarrousselComponent = ({ photos }: { photos: Array<string> }) => {

    return (
        <div className="carousel w-full">
            {photos.map((item,index) => {
                return (
                    <div id={index.toString()} className="carousel-item w-full">
                        <img
                            src="item"
                            className="w-full" />
                    </div>
                )
            })}
        </div>
    )
}