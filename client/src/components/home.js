
import './home.css';
import React from 'react';



function HomePage({userName, setIsLoading, setErrorMessage, errorMessage, cookies}) {

  // new state variables for send message box
   const [toId, setToId] = React.useState('');
   const [message, setMessage] = React.useState('');

  // new state variable for list of convos
   const [conversations, setConversations] = React.useState([]); // default empty array

   async function getConversations() {
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrieve cookie from cookies
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

  // Manual merge of conversation
  // ____________________________
  // Variables for use in displaying conversation history (View sent messages)
  const [conversationId, setConversationId] = React.useState(''); // Default value set to string, used when a user clicks on a thread
  const [messageThread, setMessageThread] = React.useState([]); // Default value set to array

  React.useEffect(() => {
    // This is run any time that conversationId is changed (on click, for example)
    getConversation(); // Get the conversation related to this new conversationId
  }, [conversationId]);

  async function getConversation() {  // For getConversation endpoint
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrive cookie from cookies
      }
    };
    const result = await fetch('/getConversation?conversationId=' + conversationId, httpSettings); // Get the conversation ID and store it
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      setMessageThread(apiRes.data); // java side should return list of all messages in this thread (from conversation ID)
      // setTimeout(getConversation, 2500); 
      // Currently disabled as it seems to automatically cycle through all previously selected conversations
      // Should refresh conversations every 2.5 seconds so any incoming messages will display
      // Without this, you won't see these new messages unless you refresh the conversation manually (or by sending a message yourself, which re-fetches it)

    } else {
      setErrorMessage(apiRes.message);
    }
  }
// End manual merge of conversation
// ____________________


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
      
      // Auto-conversation updating after a message is sent
      setConversationId(apiRes.data[0].conversationId) // Should automatically switch to whatever conversation the user just sent a message to
      getConversation(); // Should update the conversation display whenever a new message is sent
    } else {
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  };

  // renders getConversations once
  React.useEffect(() => {
    getConversations()

  }, []);

  // Start of HTML display
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
                <div className='convo-box center-text'>
                  <h3 className='curr-convo-title center-text'>Your Conversations</h3>
                    {/* Attempt at making conversations more readable */}
                    <div>{conversations.map(conversation => <div onClick={() => setConversationId(conversation.conversationId)}>
          Conversation: <br></br> {conversation.conversationId}
          {/* Breaks to have a line between the label of conversation and who was in it */}
                    <br></br><br></br> </div>)} </div>
                </div>
                </div>
                <div className='curr-users-box'>
                    <h3>Current Users:</h3>
                    <div>List users here</div>
                    <div>...</div>
                    <div>...</div>
                    <div>...</div>
                    <div>...</div>
                </div>
                <div className='view-messages-box'>
                  {/* Placeholder name "Active Conversation", plan to change to display the user you are messaging*/}
                  <div className='view-mssg-title'>Active Conversation</div>
                  <div class="mssg-text"> {messageThread.map(messageDto => <div>{messageDto.fromId + " : " + messageDto.message}</div>)} </div>
                </div>
              </div>
            </div>
            
          );
    
}


export default HomePage;