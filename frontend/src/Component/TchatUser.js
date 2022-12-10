import {useState} from "react";

export default function TchatUser({userReceiver}){
    const [content, setContent] = useState();
    const handleSubmit = () => {
      fetch(`http://localhost:8245/api/send/message/${userReceiver}`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
          },
          body: JSON.stringify({message: content})
      }).then((response)=> response.json())
          .then((data) => console.log(data))
    };


    return (
        <div>
            <h1>Send Message to {userReceiver}</h1>
            <input type="text" onChange={(event) => setContent(event.target.value)}/>
            <button onClick={() => handleSubmit()}>Send</button>
        </div>
    );
};