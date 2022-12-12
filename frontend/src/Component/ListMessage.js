import {useEffect, useState} from "react";

export default function ListMessage({userReceiver}){
    const [content, setContent] = useState([]);

    const handleReceiveMessage = (e) => {
        const data = JSON.parse(e.data);
        setContent([data, ...content])
    }

    useEffect(() => {
        const url = new URL('http://127.0.0.1:9090/.well-known/mercure');
        url.searchParams.append('topic', `/message_${userReceiver}_${window.localStorage.getItem('userId')}`);
        const eventSource = new EventSource(url);
        eventSource.onmessage = e => handleReceiveMessage(e);

        return () => eventSource.close();
    }, [handleReceiveMessage])

    useEffect(() => {
        fetch(`http://127.0.0.1:8245/api/get/message/${userReceiver}`,{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
            }
        })
            .then(data => data.json())
            .then(result => setContent(result))
        return () => setContent([]);
    }, [userReceiver]);

    if(!content){
        return <p>Loading ...</p>
    }

    return (
        <div>
            {content.map((message) =>{
            return (
                <div key={message.id}>
                   {message.sender === parseInt(window.localStorage.getItem('userId')) ?
                        <div className='ui floating message' style={{backgroundColor: 'azure'}}>
                            {message.content}
                        </div> :
                       <div className="ui floating message" style={{backgroundColor: 'cornsilk'}}>
                           {message.content}
                       </div>}
                    <br/>
                </div>
            );
            })}
        </div>
    );
}