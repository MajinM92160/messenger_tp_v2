import {useState, createContext, useEffect} from "react";

export const userContext = createContext('');

export default function UserProvider(props) {
    const [user, setUser] = useState(null);

    useEffect(() =>{
       const token = window.localStorage.getItem('token');
       if (token){
           setUser(token);
           return ;
       }

       setUser(false);
    }, [setUser]);

    if (user === null) {
        return <>Loading ...</>
    }

    return (
        <userContext.Provider value={{user, setUser}}>
            {props.children}
        </userContext.Provider>
    )
}