import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { PublicRoutes } from "./publicRoutes";
import { AuthenticatedRoutes } from "./authenticatedRoutes";

export const RoutesManager=()=>{
    const {user} = useContext(UserContext);
    return(
        <>
            {
            user.logged?
            <AuthenticatedRoutes/>
            :
            <PublicRoutes/>
            }
        </>
    )
}