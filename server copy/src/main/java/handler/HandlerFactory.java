package handler;

import request.ParsedRequest;

public class HandlerFactory {
  // routes based on the path. Add your custom handlers here
  public static BaseHandler getHandler(ParsedRequest request) {
    switch (request.getPath()) {
      case "/createUser":
        return new CreateUserHandler();
      case "/login":
        return new LoginHandler();
      case "/getConversations":
        return new GetConversationsHandler();
      case "/getConversation":
        return new GetConversationHandler();
      case "/createMessage":
        return new CreateMessageHandler();
<<<<<<< Updated upstream
=======
      case "/getAllUsers":
        return new GetAllUsersHandler();
      case "/deleteMessage":
        return new DeleteMessageHandler();
>>>>>>> Stashed changes
      default:
        return new FallbackHandler();
    }
  }

}
