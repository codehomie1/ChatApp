import "./home.css";
import React from "react";
import ProfileImage from "./ProfileImage";

function HomePage({
  userName,
  setIsLoading,
  setErrorMessage,
  errorMessage,
  cookies,
}) {
  // new state variables for send message box
  const [toId, setToId] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [changePictureBoxMessage, setChangePictureBoxMessage] = React.useState("");
  const [selectedFriends, setSelectedFriends] = React.useState([]);
  const [conversations, setConversations] = React.useState([]); 
  const [users, setUsers] = React.useState([]); 
  const [conversationId, setConversationId] = React.useState(""); // Default value set to string, used when a user clicks on a thread
  const [messageThread, setMessageThread] = React.useState([]); // Default value set to array
  const [LoggedInPictureLink, getLoggedInPictureLink] = React.useState("");
  const [inputUserPictureLink, setInputUserPictureLink] = React.useState("");
    // new state variable for the mapping various images to messages (for use in active conversation profile pics)
  const [imageMap, setImageMap] = React.useState({});

  React.useEffect(() => {
    // This is run any time that conversationId is changed (on click, for example)
    getConversation(); // Get the conversation related to this new conversationId
  }, [conversationId]);

  React.useEffect(() => {
    getConversations();
    getAllUsers();
  }, []);
 

  React.useEffect(() => {
    // This is run any time that their picture is changed
    getLoggedInUserPicture(); // Get the picture for this user
  }, [LoggedInPictureLink]);

  
  React.useEffect(() => {
    // This is run any time that their picture is changed
    getLoggedInUserPicture(); // Get the picture for this user
  }, [LoggedInPictureLink]);

  React.useEffect(() => {
    // This is run any time that their picture is changed (hopefully)
    getInputUserPicture(); // Get the picture for this user
  }, [inputUserPictureLink]);

  React.useEffect(() => {
    // This will wait until all pictures are retrieved from the message thread
    Promise.all(
      messageThread.map((message) => getInputUserPicture(message.fromId))
    ).then((results) => {
      // Then it will print the results for debugging
      console.log(results);

      const idToImage = {}; // Create a new object that will map usernames to images
      results.forEach((result) => (idToImage[result.userName] = result.src)); // For each user, map their image link into this with their username as key
      console.log(idToImage); // Print this map for debugging
      setImageMap(idToImage); // Then set the state variable equal to this new map so it can be used in the html
    });
  }, [messageThread]);


  async function addFriend(friendName) {
    const httpSettings = {
      method: "POST",
      headers: {
        //  'Content-Type': 'application/json',
        auth: cookies.get("auth"),
      },
      body: JSON.stringify({
        userName,
        friendName,
      }),
    };
    const result = await fetch(
      "/addFriends?friendName=" + friendName,
      httpSettings
    );

    const apiRes = await result.json();
    if (apiRes.status) {
      console.log("Friend added successfully.");
      setSelectedFriends((prevSelectedFriends) => [
        ...prevSelectedFriends,
        friendName,
      ]);
    } else {
      console.log("Failed to add friend.");
    }
  }

//Function to handle adding user as friend
// const handleAddFriend = (user) =>{
//     setSelectedFriends((prevSelectedFriends)=> [...prevSelectedFriends, user.userName]);
//     addFriend(userName);
//   }
//   */


  async function getConversations() {
    const httpSettings = {
      method: "GET",
      headers: {
        auth: cookies.get("auth"), // utility to retrieve cookie from cookies
      },
    };
    const result = await fetch("/getConversations", httpSettings);
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

  
  async function getConversation() {
    // For getConversation endpoint
    const httpSettings = {
      method: "GET",
      headers: {
        auth: cookies.get("auth"), // utility to retrive cookie from cookies
      },
    };
    const result = await fetch(
      "/getConversation?conversationId=" + conversationId,
      httpSettings
    ); // Get the conversation ID and store it
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      setMessageThread(apiRes.data); 
    } else {
      setErrorMessage(apiRes.message);
    }
  }

  async function handleSendMessage() {
    setIsLoading(true);
    setErrorMessage(""); // fresh error message each time
    const body = {
      fromId: userName,
      toId: toId,
      message: message,
    };
    const httpSettings = {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        auth: cookies.get("auth"), // utility to retrive cookie from cookies
      },
    };
    const result = await fetch("/createMessage", httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      setMessage(""); // reset message box to blank when sent
      getConversations(); // get all conversations

      // Auto-conversation updating after a message is sent
      setConversationId(apiRes.data[0].conversationId); // Should automatically switch to whatever conversation the user just sent a message to
      getConversation(); // Should update the conversation display whenever a new message is sent
    } else {
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  }

  async function handleDeleteMessage(messageDto) {
    console.log(messageDto);
    setIsLoading(true);
    setErrorMessage("");

    // Check if the message belongs to the current user
    if (messageDto.fromId !== userName) {
      alert("You can only delete your own messages.");
      setIsLoading(false);
      return;
    }

    const httpSettings = {
      method: "GET",
      headers: {
        auth: cookies.get("auth"),
      },
    };
    const result = await fetch(
      "/deleteMessage?timestamp=" + messageDto.timestamp,
      httpSettings
    );
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
    setErrorMessage("");
    const httpSettings = {
      method: "GET",
      headers: {
        auth: cookies.get("auth"), // utility to retrive cookie from cookies
      },
    };
    const result = await fetch("/getAllUsers", httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      setUsers(apiRes.data); // java side should return list of all convos for this user
    } else {
      setUsers(apiRes.message);
    }
  }

  async function setUserPicture(webURL) {
    setErrorMessage("");
    const httpSettings = {
      method: "POST",
      headers: {
        auth: cookies.get("auth"), // utility to retrieve cookie from cookies
      },
    };

    const result = await fetch(
      "/SetUserPicture?webURL=" + webURL,
      httpSettings
    );
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      console.log(
        "Theoretically the setUserPicture has been marked as successful"
      ); // debug
      getLoggedInUserPicture(); // Call get user profile to update any existing profile displays to the new one
    } else {
      getLoggedInPictureLink(apiRes.message);
    }
  }

  async function getLoggedInUserPicture() {
    // For getUserPicture endpoint
    const httpSettings = {
      method: "GET",
      headers: {
        auth: cookies.get("auth"), // utility to retrieve cookie from cookies
      },
    };
    const result = await fetch(
      "/GetUserPicture?userName=" + userName,
      httpSettings
    ); // Get the user picture result and store it
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // If it succeeded
      console.log("The apiRes.data is: " + apiRes.data);
      console.log("The apiRes message is: " + apiRes.message);
      var copeBypass = apiRes.message;
      getLoggedInPictureLink(copeBypass); // This will read the link to their profile picture from the found user
    } else {
      setErrorMessage(apiRes.message);
    }
    return copeBypass;
  }

  async function getInputUserPicture(incomingUser) {
    // For getUserPicture endpoint
    const httpSettings = {
      method: "GET",
      headers: {
        auth: cookies.get("auth"), // utility to retrieve cookie from cookies
      },
    };
    const result = await fetch(
      "/GetUserPicture?userName=" + incomingUser,
      httpSettings
    ); // Get the other user's picture result and store it
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // If it succeeded
      console.log("The apiRes message is: " + apiRes.message);
      var copeBypass = apiRes.message;
      //setInputUserPictureLink(copeBypass); // This will read the link to their profile picture for the "Other User"
    } else {
      //setErrorMessage(apiRes.message);
    }
    console.log("Return value will be: " + copeBypass);
    console.log("return value is actually: " + <img src={copeBypass} />);
    return { src: apiRes.message, userName: incomingUser };
  }


  // Start of HTML display
  return (
    <div className="homepage-container">
      <h1 className="home-title center-text">Welcome {userName}</h1>
      <div className="flex-container">
        {/* Renders the currently logged in user's profile picture in a big circle (largeRound) */}
        <div>
          {" "}
          <ProfileImage
            className="largeRound"
            src={LoggedInPictureLink}
            alt="Profile Image didn't render because you're on dialup internet"
          />{" "}
        </div>

        {/* Submit image by either copy and pasting it in here or dragging and dropping it from a webpage*/}
        <div className="message-box">
          <h3 className="send-mess-title">Change your Picture!</h3>
          {/* Currently this changes both message boxes at once so the value and onchange needs to change too. */}
          <textarea
            className="message-textarea"
            placeholder="Please add the url of the picture to update your Profile Picture"
            value={changePictureBoxMessage}
            onChange={(e) => setChangePictureBoxMessage(e.target.value)}
          />
          <div>
            <button onClick={() => setUserPicture(changePictureBoxMessage)}>
              Change Profile Picture
            </button>
            <div className="top-space">{errorMessage}</div>

            <div className="curr-users-box">
              <h3>Current Users:</h3>
              {users.map((user) => (
                <div className="to-padding">
                  {" "}
                  {user.userName}
                  <button
                    class="button1"
                    onClick={() => addFriend(user.userName)}
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>

            <div class="box"> Friend List: {selectedFriends.join(", ")} </div>
          </div>
        </div>

        <div className="convo-wrapper">
          <div className="view-messages-box">
            <div className="view-mssg-title">Active Conversation</div>
            <div></div>
            <div class="mssg-text">
              {/* Image source is now changed to use the picture of whoever sent the message (it is found in the imageMap using the fromId as a key*/}
              {messageThread.map((messageDto) => (
                <div class="current-message">
                  <ProfileImage
                    className="chatSize"
                    src={imageMap[messageDto.fromId]}
                    alt="Profile Image"
                  />
                  {messageDto.fromId + " : " + messageDto.message}
                  <br></br>
                  <button
                    class="delete-button"
                    onClick={() => handleDeleteMessage(messageDto)}
                  >
                    {" "}
                    Unsend{" "}
                  </button>
                </div>
              ))}{" "}
            </div>

            <div className="message-box">
              <h3 className="send-mess-title">Send Message</h3>
              <div>
                <span className="right-padding">To:</span>
                <input
                  className="to-padding"
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
                />
              </div>
              <textarea
                className="message-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div>
                <button class="send-message-button" onClick={handleSendMessage}>
                  Send Message
                </button>
                <div className="top-space">{errorMessage}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="convo-box center-text">
            <h3 className="curr-convo-title center-text">Your Conversations</h3>
            {/* Attempt at making conversations more readable */}
            <div class="conversation-thread">
              {conversations.map((conversation) => (
                <>
                  <div
                    onClick={() =>
                      setConversationId(conversation.conversationId)
                    }
                  >
                    Conversation: <br></br> {conversation.conversationId}
                    {/* Breaks to have a line between the label of conversation and who was in it */}
                    <br></br>
                    <br></br>{" "}
                  </div>
                </>
              ))}{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default HomePage;
