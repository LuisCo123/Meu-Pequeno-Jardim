import { Routes, Route } from "react-router-dom"
import { DataSheetPage } from "../pages/authenticatedPages/dataSheetPage"
import PlantInformationProvider from "../context/plantInformationContext"

export const AuthenticatedRoutes = () => {

    return (
        <PlantInformationProvider>
            <Routes>
                <Route path="/dataSheetPage" Component={DataSheetPage} />
                <Route path="/*" Component={DataSheetPage} />
            </Routes>
        </PlantInformationProvider>
    )
}