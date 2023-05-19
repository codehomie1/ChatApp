import './home.css';
import React from 'react';

import ProfileImage from "./ProfileImage";


function HomePage({ userName, setIsLoading, setErrorMessage, errorMessage, cookies }) {

  // new state variables for send message box
  const [toId, setToId] = React.useState('');
  const [message, setMessage] = React.useState('');

  // New state variable for the message box where you can set a new user profile picture.
  const [changePictureBoxMessage, setChangePictureBoxMessage] = React.useState('');

  // new state variable for list of convos
  const [conversations, setConversations] = React.useState([]); // default empty array
  const [users, setUsers] = React.useState([]); // users array

  async function getConversations() {
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrieve cookie from cookies
      }
    };
    const result = await fetch('/getConversations', httpSettings);
    const apiRes = await result.json();
    console.log("*******");
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
      // Example from the class demo
      // Works great on a single conversation but seems to break if the user ever switches
      //setTimeout(getConversation, 2500); 
      // Currently disabled as it automatically cycles through all previously selected conversations
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
      setMessage(''); // reset message box to blank when sent
      getConversations(); // get all conversations

      // Auto-conversation updating after a message is sent
      setConversationId(apiRes.data[0].conversationId) // Should automatically switch to whatever conversation the user just sent a message to
      getConversation(); // Should update the conversation display whenever a new message is sent
    } else {
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  };

  async function handleDeleteMessage(messageDto) {
    console.log(messageDto);
    setIsLoading(true);
    setErrorMessage('');

    // Check if the message belongs to the current user
    if (messageDto.fromId !== userName) {
      alert("You can only delete your own messages.");
      setIsLoading(false);
      return;
    }

    const httpSettings = {

      method: 'GET',
      headers: {
        auth: cookies.get('auth'),
      }
    };
    const result = await fetch('/deleteMessage?timestamp=' + messageDto.timestamp, httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // setConversationId(messageDto.conversationId);
      getConversation();
      getConversations();
    } else {
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  }

  async function getAllUsers() {
    setErrorMessage('')
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrive cookie from cookies
      }
    };
    const result = await fetch('/getAllUsers', httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      setUsers(apiRes.data); // java side should return list of all convos for this user
    } else {
      setUsers(apiRes.message);
    }
  }

  // This function will take an input URL and sent it to the SetUserPicture endpoint, 
  // which will change their picture in the database to whatever is at the input url
  async function setUserPicture(webURL) {
    setErrorMessage("")
    const httpSettings = {
      method: 'POST',
      headers: {
        auth: cookies.get('auth'), // utility to retrieve cookie from cookies
      }
    };

    const result = await fetch('/SetUserPicture?webURL=' + webURL, httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      console.log("Theoretically the setUserPicture has been marked as successful") // debug
      getLoggedInUserPicture(); // Call get user profile to update any existing profile displays to the new one
    } else {
      getLoggedInPictureLink(apiRes.message);
    }
  }

  // Reconstruction of older (now deleted) getUserProfile using getConversation as a base
  // ____________________________

  // new state variable for the logged in user's profile picture
  const [LoggedInPictureLink, getLoggedInPictureLink] = React.useState('');

  React.useEffect(() => {
    // This is run any time that their picture is changed
    getLoggedInUserPicture(); // Get the picture for this user
  }, [LoggedInPictureLink]);

  async function getLoggedInUserPicture() {  // For getUserPicture endpoint
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrieve cookie from cookies
      }
    };
    const result = await fetch('/GetUserPicture?userName=' + userName, httpSettings); // Get the user picture result and store it
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // If it succeeded
      console.log("The apiRes.data is: " + apiRes.data);
      console.log("The apiRes message is: " + apiRes.message)
      var copeBypass = apiRes.message;
      getLoggedInPictureLink(copeBypass); // This will read the link to their profile picture from the found user
    } else {
      setErrorMessage(apiRes.message);
    }
    return copeBypass
  }
  // End re-write of the conversation example above
  // ____________________



  // Reconstruction of getUserProfile using getConversation as a base, v2, for any username input into it
  // It works properly but is currently unused as the feature in the message box was shifted to be in the messageDTO directly
  // ____________________________

  // new state variable for profile picture
  const [inputUserPictureLink, setInputUserPictureLink] = React.useState('');

  React.useEffect(() => {
    // This is run any time that their picture is changed (hopefully)
    getInputUserPicture(); // Get the picture for this user
  }, [inputUserPictureLink]);

  async function getInputUserPicture(incomingUser) {  // For getUserPicture endpoint
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrieve cookie from cookies
      }
    };
    const result = await fetch('/GetUserPicture?userName=' + incomingUser, httpSettings); // Get the other user's picture result and store it
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // If it succeeded
      console.log("The apiRes message is: " + apiRes.message)
      var copeBypass = apiRes.message;
      //setInputUserPictureLink(copeBypass); // This will read the link to their profile picture for the "Other User"
    } else {
      //setErrorMessage(apiRes.message);
    }
    console.log("Return value will be: " + copeBypass)
    console.log("return value is actually: " + <img src={copeBypass} />)
    return {src: apiRes.message, userName: incomingUser};
  }
  // End re-write of the conversation example above
  // ____________________

  // renders getConversations once
  // Also includes rendering getAllUsers
  React.useEffect(() => { getConversations(); getAllUsers(); }, []);



  // new state variable for the mapping various images to messages (for use in active conversation profile pics)
  const [imageMap, setImageMap] = React.useState({});

  // As explained by Professor Parra on 5/18/2023
  React.useEffect(() => {
    // This will wait until all pictures are retrieved from the message thread
    Promise.all(messageThread.map(message => getInputUserPicture(message.fromId)))
    .then(results => { // Then it will print the results for debugging
      console.log(results);
      
      const idToImage = {}; // Create a new object that will map usernames to images
      results.forEach(result => idToImage[result.userName] = result.src); // For each user, map their image link into this with their username as key
      console.log(idToImage);  // Print this map for debugging
      setImageMap(idToImage);  // Then set the state variable equal to this new map so it can be used in the html
    })
   }, [messageThread]);
  


  // Start of HTML display
  return (

    <div className="homepage-container">
      <h1 className='home-title center-text'>Welcome {userName}</h1>
      <div className='flex-container'>


        {/* Renders the currently logged in user's profile picture in a big circle (largeRound) */}
        <div> <ProfileImage className="largeRound" src={LoggedInPictureLink} alt="Profile Image didn't render because you're on dialup internet" /> </div>
          
        {/* Submit image by either copy and pasting it in here or dragging and dropping it from a webpage*/}
        <div className='message-box'>
          <h3 className='send-mess-title'>Change your Picture!</h3>
          {/* Currently this changes both message boxes at once so the value and onchange needs to change too. */}
          <textarea className='message-textarea' placeholder='Please add the url of the picture to update your Profile Picture'value={changePictureBoxMessage} onChange={e => setChangePictureBoxMessage(e.target.value)} />
          <div>
            <button onClick={() => setUserPicture(changePictureBoxMessage)}>Change Profile Picture</button>
            <div className='top-space'>{errorMessage}</div>

            <div className='curr-users-box'>
          <h3>Current Users:</h3>
          {users.map(user => <div className='to-padding'> {user.userName} </div>)}
        </div>
          </div>
        </div>


        

        <div className="convo-wrapper">

          <div className='view-messages-box'>
            <div className='view-mssg-title'>Active Conversation</div>
            <div></div>
            <div class="mssg-text">
              {/* Image source is now changed to use the picture of whoever sent the message (it is found in the imageMap using the fromId as a key*/}
              {messageThread.map(messageDto => <div class="current-message">
              <ProfileImage className="chatSize" src={imageMap[messageDto.fromId]} alt="Profile Image"   />
                {messageDto.fromId + " : " + messageDto.message}<br></br><button class="delete-button" onClick={() => handleDeleteMessage(messageDto)}> Unsend </button></div>)} </div>
            
            <div className='message-box'>
              <h3 className='send-mess-title'>Send Message</h3>
              <div>
                <span className='right-padding'>To:</span><input className='to-padding' value={toId} onChange={e => setToId(e.target.value)} />
              </div>
              <textarea className='message-textarea' value={message} onChange={e => setMessage(e.target.value)} />
              <div>
                <button class="send-message-button" onClick={handleSendMessage}>Send Message</button>
                <div className='top-space'>{errorMessage}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='convo-box center-text'>
            <h3 className='curr-convo-title center-text'>Your Conversations</h3>
            {/* Attempt at making conversations more readable */}
            <div class="conversation-thread">{conversations.map(conversation => <>
              <div onClick={() => setConversationId(conversation.conversationId)}>
                Conversation: <br></br> {conversation.conversationId}
                {/* Breaks to have a line between the label of conversation and who was in it */}
                <br></br><br></br> </div>
            </>)} </div>
          </div>
        </div>
        
        

      </div>
    </div>

  );

}


export default HomePage;
