import { createContext} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const dataContext = createContext();

export const UserProvider = ({ children }) => {
    const username = "KC";
    const password = "1234"

    return (
        <dataContext.Provider value={{ username , password }}>
            {children}
        </dataContext.Provider>
    );
};

export default UserProvider;