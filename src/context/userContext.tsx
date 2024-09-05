import { createContext, useContext, useState } from "react";

interface userInterface {
    logged:boolean;
}
interface UserContextType {
    user: userInterface;
    setUser: React.Dispatch<React.SetStateAction<userInterface>>;
}

const defaultValue: UserContextType = {
    user: { logged: false },
    setUser: () => {},
};

export const UserContext = createContext<UserContextType>(defaultValue);
export const UserProvider = ({ children }: { children: any }) => {

    const [user, setUser] = useState<userInterface>({logged:false});

    return (
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}
export default UserProvider;