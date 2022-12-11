import {useEffect, useState} from "react";
import useGetUserList from "../Hook/useGetUserList";
import useBackendPing from "../Hook/useBackendPing";
import TchatUser from "./TchatUser";
import ListMessage from "./ListMessage";

export default function UserList() {
    const [userList, setUserList] = useState([]);
    const [userReceiver, setUserReceiver] = useState();

    const getUserList = useGetUserList();

    const openTchat = (id) => {
      setUserReceiver(id);
    }
    const handleMessage = (e) => {
        document.querySelector('h1').insertAdjacentHTML('afterend', '<div class="alert alert-success w-75 mx-auto">Ping !</div>');
        window.setTimeout(() => {
            const $alert = document.querySelector('.alert');
            $alert.parentNode.removeChild($alert);
        }, 2000);
        console.log(JSON.parse(e.data));
    }

    useEffect(() => {
        getUserList().then(data => setUserList(data.users));

        const url = new URL('http://localhost:9090/.well-known/mercure');
        url.searchParams.append('topic', 'https://example.com/my-private-topic');

        const eventSource = new EventSource(url, {withCredentials: true});
        eventSource.onmessage = handleMessage;

        return () => {
            eventSource.close()
        }

    }, [])

    return (
        <div>
            <h1 className='m-5 text-center'>Ping a user</h1>
            {userList.map((user) => (
                    <button key={user.id} className='btn btn-dark w-100' type='submit' onClick={()=>openTchat(user.id)} value={user.id}>{user.username}</button>
            ))}
            <div>
                {userReceiver && <TchatUser userReceiver={userReceiver}/>}
            </div>
            <div>
                {userReceiver && <ListMessage userReceiver={userReceiver}/>}
            </div>
        </div>
    )
}