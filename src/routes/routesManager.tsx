import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { PublicRoutes } from "./publicRoutes";

export const RoutesManager=()=>{
    const {user} = useContext(UserContext);
    return(
        <>
            {
            user.logged?
            <div className="hero min-h-screen shadow-2xl"/>
            :
            <PublicRoutes/>
            }
        </>
    )
}