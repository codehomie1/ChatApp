
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
              <h1 className='home-title center-text'>Welcome {userName}</h1>
              <div className='flex-container'>
                <div className='message-box'>
                  <h3 className='send-mess-title'>Send Message</h3>
                  <div>
                  <span className='right-padding'>To:</span><input className='to-padding' value={toId} onChange={e => setToId(e.target.value)} />
                  </div>
                  <textarea className='message-textarea' value={message} onChange={e => setMessage(e.target.value)} />
                  <div>
                    <button onClick={handleSendMessage}>Send Message</button>
                    <div className='top-space'>{errorMessage}</div>
                  </div>
                </div>
                <div>
                <div className='convo-box center-text top-space'>
                  <h3 className='curr-convo-title center-text'>Current Convos</h3>
                    {conversations.map(conversation => <div>Convo: {conversation.conversationId}
                    </div>)}
                </div>
                </div>
                <div>
                    <h3>Current Users:</h3>
                    <div>List users here</div>
                    <div>...</div>
                    <div>...</div>
                    <div>...</div>
                    <div>...</div>
                </div>  
              </div>
              
            </div>
            
          );
    
}


export default HomePage;