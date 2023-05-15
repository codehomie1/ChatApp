import './App_custom2.css';
//import './css/bootstrap.min.css'
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
      setConversationId(apiRes.data[0].conversationId) // Should automatically switch to whatever conversation the user just sent a message to
    } else {
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  };

  if (isLoggedIn) {
    return (
      <div className="App">

        {/* Website name and slogan */}
        <div id="header">
          <h1>Dollar Store Discord</h1>
          <h2><a href="#">Like Discord, but worse</a></h2>
        </div>

        {/* Cursed logo at the top of the page */}
        <div id="logo"><img src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81pmLrQ_SYhRhw4N99g5bhuYYGGrjGegXlEjuA8vBQ4PTRNVXFa2DM1JTR9l30zSsjoMcSXa9JDAMRbqX6L2HYrBatzg=s2560" alt="Dollar Store Discord" width={250} height={125}/> </div>

    {/* Experimental Navbar for testing CSS, not quite working properly yet */}
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm py-3 py-lg-0 px-3 px-lg-0">
        <a href="index.html" class="navbar-brand d-block d-lg-none">
            <h1 class="m-0 text-uppercase text-white"><i class="fa fa-birthday-cake fs-1 text-primary me-3"></i>Cope Zone</h1>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
            <div class="navbar-nav ms-auto mx-lg-auto py-0">
                <a href="index.html" class="nav-item nav-link active">Home</a>
                <a href="placeholder1.html" class="nav-item nav-link">Placeholder 1</a>
                <a href="placeholder2.html" class="nav-item nav-link">Placeholder 2</a>
                <a href="placeholder3.html" class="nav-item nav-link">Placeholder 3</a>
            </div>
        </div>
    </nav>
 

        {/* WIP Sidebar used in the app_custom2 css, currently not enabled
        <div id="colTwo">
          <ul>
            <li>
              <h2>Placeholder for Pages</h2>
              <ul>
                <li class="active"><a href="#">Home</a></li>
                <li><a href="#">My Profile</a></li>
                <li><a href="#">Other Users</a></li>
              </ul>
            </li>
          </ul>
        </div>

        */}

        <h1>Welcome {userName}</h1>
        <div>
          To: <input value={toId} onChange={e => setToId(e.target.value)} />
        </div>
        <textarea value={message} onChange={e => setMessage(e.target.value)} />
        <div>
          <button onClick={handleSendMessage}>Send Message</button>
        </div>
        <div>{errorMessage}</div>

        <br></br>
        <h2>Your Conversations</h2>

        {/* Pre-edited conversation viewer text */}
        {/* 
          <div>{conversations.map(conversation => <div onClick={() => setConversationId(conversation.conversationId)}>Convo: {conversation.conversationId}</div>)}</div>
         */}


        {/* Attempt at making conversations more readable */}
        <div>{conversations.map(conversation => <div onClick={() => setConversationId(conversation.conversationId)}>
          Conversation: <br></br> {conversation.conversationId}
          {/* Breaks to have a line between the label of conversation and who was in it */}
          <br></br><br></br> </div>)} </div>

        <h4>Selected Conversation: {conversationId}</h4>

        <div>
          {/* Labels who sent the message */}
          {messageThread.map(messageDto => <div>{messageDto.fromId + " : " + messageDto.message}</div>)}
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