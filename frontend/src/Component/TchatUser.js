import {useState} from "react";

export default function TchatUser({userReceiver, username}){
    const [content, setContent] = useState();

    const handleSubmit = () => {
      fetch(`http://localhost:8245/api/send/message/${userReceiver}`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
          },
          body: JSON.stringify({message: content})
      }).then((response)=> response.json())
          .then((data) => console.log(data));
    };


    return (
        <div>
            <h3>Send Message to {username}</h3>
            <div className="ui input">
                <input placeholder="Your message" type="text" onChange={(event) => setContent(event.target.value)} />
            </div>
            <button className="ui blue button" onClick={() => handleSubmit()}>
                <i style={{float: 'left'}} className="paper plane outline icon"></i>
                Send
            </button>
        </div>
    );
};