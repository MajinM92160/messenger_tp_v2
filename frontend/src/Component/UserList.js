import {useEffect, useState} from "react";
import useGetUserList from "../Hook/useGetUserList";
import useBackendPing from "../Hook/useBackendPing";
import TchatUser from "./TchatUser";
import ListMessage from "./ListMessage";

export default function UserList() {
    const [userList, setUserList] = useState([]);
    const [userReceiver, setUserReceiver] = useState();
    const [username, setUsername] = useState();

    const getUserList = useGetUserList();

    const logout = () => {
        localStorage.clear();
        window.location = '/login';
    };

    const openTchat = (id, username) => {
      setUserReceiver(id);
      setUsername(username);
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
        <div className="ui grid">
            <div className='sixteen wide column'>
                <h1 className='m-5 text-center'>Send a message to your friend</h1>
            </div>
            <div className="two wide column">
                {userList.map((user) => (
                    user.id !== parseInt(window.localStorage.getItem('userId')) ? <button key={user.id} style={{width: '100%'}} className='ui grey button' type='submit' onClick={()=>openTchat(user.id, user.username)} value={user.id}>{user.username}</button> : ''
                ))}
                <button className="large ui red button" style={{width: '100%'}} type="submit" onClick={() =>logout()}>Logout</button>
            </div>
            <div className="two wide column"></div>
            <div className="eight wide column">
                {userReceiver && <TchatUser userReceiver={userReceiver} username={username}/>}
                <br/>
                <br/>
                {userReceiver && <ListMessage userReceiver={userReceiver}/>}
            </div>
        </div>
    )
}