import {Navigate, useLocation} from "react-router-dom";
import {userContext} from "../Context/UserContext";
import {useContext, useEffect} from "react";

export default function NeedAuth(props) {
    let location = useLocation();
    const {user} = useContext(userContext);
    if (user) {
        return props.children;
    } else {
        return <Navigate to='/login' state={{from: location}}/>
    }
}