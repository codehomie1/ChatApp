package handler;

import dao.UserDao;
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
      case "/getAllUsers":
        return new GetAllUsersHandler();
      case "/addFriends":
        UserDao userDao = UserDao.getInstance();
        return new AddFriendHandler(userDao);
      default:
        return new FallbackHandler();
    }
  }

}
