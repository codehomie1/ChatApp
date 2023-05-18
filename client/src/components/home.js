import './home.css';
import React from 'react';

import ProfileImage from "./ProfileImage";


function HomePage({userName, setIsLoading, setErrorMessage, errorMessage, cookies}) {

  // new state variables for send message box
   const [toId, setToId] = React.useState('');
   const [message, setMessage] = React.useState('');

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
    
    const httpSettings = {
      
      method: 'GET',
      headers: {
        auth: cookies.get('auth'),
      }
    };
    const result = await fetch('/deleteMessage?timestamp='+messageDto.timestamp, httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    setConversations([]);
    // if (apiRes.status) {
    // } else {
    //   setErrorMessage(apiRes.message);
    // }
    // setIsLoading(false);
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

  async function handleDeleteMessage(messageDto) {
    console.log(messageDto);
    setIsLoading(true);
    setErrorMessage('');

    const httpSettings = {

      method: 'GET',
      headers: {
        auth: cookies.get('auth'),
      }
    };
    const result = await fetch('/deleteMessage?timestamp='+messageDto.timestamp, httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    getConversation();
  }

  
  async function setUserPicture(webURL){
    setErrorMessage("")
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrive cookie from cookies
      }
    };

    const result = await fetch('/SetUserPicture?userName' + userName + webURL, httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      setPictureLink(apiRes.data); // I don't know 
    } else {
      setPictureLink(apiRes.message);
    }
    //getUserProfile(); // Call get user profile to update any existing profile displays to the new one
  }

/*
  async function getUserProfile() {
    setErrorMessage('')
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // Check if user is logged in
      }
    };
    const result = await fetch('/GetUserPicture', httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      getPicture(apiRes.data); // Should return the link of their profile picture
    } else {
      getPicture(apiRes.message);
    }
  }
*/

// Reconstruction of getUserProfile using getConversation as a base?
  // ____________________________

   // new state variable for profile picture?
   //const [picture, getPicture] = React.useState(''); // Default value set to string, which links to an image
   const [pictureLink, setPictureLink] = React.useState('');

  React.useEffect(() => {
    // This is run any time that conversationId is changed (on click, for example)
    getPicture(); // Get the conversation related to this new conversationId
  }, [pictureLink]);

  async function getPicture() {  // For getUserPicture endpoint
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
      // worked
      //(apiRes.data).get(0).getProfilePic();
      //setPictureLink(apiRes.data); // java side should return list that contains the user's profile link
    } else {
      setErrorMessage(apiRes.message);
    }
  }
// End re-write of the conversation example above
// ____________________

  





    // renders getConversations once
    // Also includes rendering getAllUsers
    React.useEffect(() => { getConversations(); getAllUsers(); getPicture(); }, []);

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
                    <div>{conversations.map(conversation => <>
                      <div onClick={() => setConversationId(conversation.conversationId)}>
          Conversation: <br></br> {conversation.conversationId}
          {/* Breaks to have a line between the label of conversation and who was in it */}
                    <br></br><br></br> </div>
                    </>)} </div>
                </div>
                </div>
                <div className='curr-users-box'>
                    <h3>Current Users:</h3>
                    { users.map(user => <div className='to-padding'> {user.userName} </div>)}
                </div>
                <div className='view-messages-box'>
                  {/* Placeholder name "Active Conversation", plan to change to display the user you are messaging*/}
                  <div className='view-mssg-title'>Active Conversation</div>
                  <div></div>
                  <div class="mssg-text">
                    {/* Change the image source later*/}
                   {messageThread.map(messageDto => <div>
                    <ProfileImage className="chatSize" src={"default-profile.jpg"} alt="Profile Image"/>
                    {messageDto.fromId + " : " + messageDto.message}<button onClick={()=>handleDeleteMessage(messageDto)}> Delete </button></div>)} </div>
                    
                </div>

                
                {/* This doesn't seem to work
                {String userPicture = "https://lh3.googleusercontent.com/drive-viewer/AFGJ81piYqR_h-RQPH1hIBdHnmc0bx-KE8cZ4cawYzl4zQNS0O0a0KyBj6LBNU9UIFsubHhYLmUz-Yt3RGGWB75L3fiX8TKi-w=s2560"}
                <ProfileImage src=userPicture alt="Profile Image didn't render because you're on dialup internet"/>
                */}

                {/*
                Storage of alternate formats for ProfileImage
                <ProfileImage src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81piYqR_h-RQPH1hIBdHnmc0bx-KE8cZ4cawYzl4zQNS0O0a0KyBj6LBNU9UIFsubHhYLmUz-Yt3RGGWB75L3fiX8TKi-w=s2560" alt="Profile Image"/>
                <ProfileImage className="chatSize" src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81piYqR_h-RQPH1hIBdHnmc0bx-KE8cZ4cawYzl4zQNS0O0a0KyBj6LBNU9UIFsubHhYLmUz-Yt3RGGWB75L3fiX8TKi-w=s2560" alt="Profile Image"/>
                */}
                
                <ProfileImage className="largeRound" src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81piYqR_h-RQPH1hIBdHnmc0bx-KE8cZ4cawYzl4zQNS0O0a0KyBj6LBNU9UIFsubHhYLmUz-Yt3RGGWB75L3fiX8TKi-w=s2560" alt="Profile Image"/>
                
                
                {/* Not working yet...
                <button onClick={()=> setUserPicture("https://i.ytimg.com/vi/ndSqUwgcyMI/maxresdefault.jpg")}> Cope </button>
                */}
                

                {/* Debug button to test retrieval of a user profile value
                <button onClick={()=> getUserProfile()}> 
                getProfile</button> 
                 */}
                <div> 
                <ProfileImage className="largeRound" src="src\components\assets\default-profile.jpg" alt="Profile Image"/>
                <button onClick={()=>getPicture()}>getPicture</button>
                </div>
                
                
                


              </div>
            </div>
            
          );
    
}


export default HomePage;