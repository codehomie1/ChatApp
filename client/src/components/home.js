
import './home.css';
import React from 'react';



function HomePage({userName, setIsLoading, setErrorMessage, errorMessage, cookies}) {

  
   const [toId, setToId] = React.useState('');
   const [message, setMessage] = React.useState('');

   const [conversations, setConversations] = React.useState([]); // default empty array


   async function getConversations() {
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrive cookie from cookies
      }
    };
    const result = await fetch('/getConversations', httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      setConversations(apiRes.data); // java side should return list of all convos for this user
    } else {
      setErrorMessage(apiRes.message);
    }
  
  
  }

  async function handleSendMessage() {
    setIsLoading(true);
    setErrorMessage(''); // fresh error message each time
    const body = {
      fromId: userName,
      toId: toId,
      message: message,
    };
    const httpSettings = {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        auth: cookies.get('auth'), // utility to retrive cookie from cookies
      }
    };
    const result = await fetch('/createMessage', httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      setMessage(''); // reset mssg
      getConversations(); // get all conversations
    } else {
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    getConversations()

  })
  
    return (

            <div className="homepage-container">
              <h1 className='center-text'>Welcome {userName}</h1>
              <div className='message-box'>
                <div>
                  To: <input value={toId} onChange={e => setToId(e.target.value)} />
                </div>
                <textarea value={message} onChange={e => setMessage(e.target.value)} />
                <div>
                  <button onClick={handleSendMessage}>Send Message</button>
                </div>  
              </div>
              
              <div>{errorMessage}</div>
              <div className='center-text top-space'>{conversations.map(conversation => <div>Convo: {conversation.conversationId}</div>)}</div>
            </div>
            
          );
    
}


export default HomePage;