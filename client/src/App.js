import './App.css';
import React from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function App() {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  // new state variables for chat box
  const [toId, setToId] = React.useState('');
  const [message, setMessage] = React.useState('');

  // new state variable for list of convos
  const [conversations, setConversations] = React.useState([]); // default empty array

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
    } else {
      setErrorMessage(apiRes.message);
    }
  }

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

  async function handleSubmit() {
    setIsLoading(true);
    setErrorMessage(''); // fresh error message each time
    const body = {
      userName: userName,
      password: password,
    };
    const httpSettings = {
      body: JSON.stringify(body),
      method: 'POST'
    };
    const result = await fetch('/createUser', httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // user was created
      // todo
    } else {
      // some error message
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  };

  async function handleLogIn() {
    setIsLoading(true);
    setErrorMessage(''); // fresh error message each time
    const body = {
      userName: userName,
      password: password,
    };
    const httpSettings = {
      body: JSON.stringify(body),
      method: 'POST'
    };
    const result = await fetch('/login', httpSettings);
    if (result.status === 200) {
      // login worked
      setIsLoggedIn(true);
      getConversations();
    } else {
      // login did not work
      setErrorMessage(`Username or password incorrect.`);
    }

    setIsLoading(false);
  };

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
      setMessage('');
      getConversations();
    } else {
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  };

  if (isLoggedIn) {
    return (
      <div className="App">
        <h1>Welcome {userName}</h1>
        <div>
          To: <input value={toId} onChange={e => setToId(e.target.value)} />
        </div>
        <textarea value={message} onChange={e => setMessage(e.target.value)} />
        <div>
          <button onClick={handleSendMessage}>Send Message</button>
        </div>
        <div>{errorMessage}</div>
        <div>{conversations.map(conversation => <div onClick={() => setConversationId(conversation.conversationId)}>Convo: {conversation.conversationId}</div>)}</div>
        <h3>Selected Conversation: {conversationId}</h3>

        <div>
          {/* Labels who sent the message */}
          {messageThread.map(messageDto => <div>{messageDto.fromId + ": " + messageDto.message + " at: " + messageDto.timestamp}</div>)}
        </div>           

      </div>
    );
  }

  return (
    <div className="App">
      <input value={userName} onChange={e => setUserName(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
      <button onClick={handleSubmit} disabled={isLoading}>Register</button>
      <button onClick={handleLogIn} disabled={isLoading}>Log in</button>
      <div>
        {isLoading ? 'Loading ...' : null}
      </div>
      <div>{errorMessage}</div>
    </div>
  );
}

export default App;