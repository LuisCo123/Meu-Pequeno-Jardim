import { createContext, useContext, useEffect, useState } from "react";
import { StorageService } from "../services/storageService";
interface userInterface {
    logged:boolean;
}
interface UserContextType {
    user: userInterface;
    setUser: React.Dispatch<React.SetStateAction<userInterface>>;
    logout: Function,
}

const defaultValue: UserContextType = {
    user: { logged: false },
    setUser: () => {},
    logout: ()=>{}
};

export const UserContext = createContext<UserContextType>(defaultValue);
export const UserProvider = ({ children }: { children: any }) => {

    const [user, setUser] = useState<userInterface>({logged:false});
    const logout = ()=>{
        setUser({logged:false});
        StorageService.removeItem("user");
    }
    useEffect(()=>{
        if(user.logged==true){
            StorageService.setItem(user,"user");
        }
    },[user])
    
    useEffect(()=>{
        let userStorage:userInterface = StorageService.getItem("user");
        if(userStorage){
            setUser(userStorage);
        }
    },[])
    return (
        <UserContext.Provider value={{user,setUser,logout}}>
            {children}
        </UserContext.Provider>
    )
}
export default UserProvider;