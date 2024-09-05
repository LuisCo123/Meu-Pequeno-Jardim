import { Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/homePage"
import { LoginPage } from "../pages/loginPage"

export const PublicRoutes =()=>{

    return(
        <Routes>
            <Route path="/" Component={HomePage} />
            <Route path="/login" Component={LoginPage} />
        </Routes>
    )
}