package handler;

import dao.MessageDao;
import dao.UserDao;
import handler.AuthFilter.AuthResult;
import org.bson.Document;
import request.ParsedRequest;
import response.CustomHttpResponse;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

public class GetConversationHandler implements BaseHandler {

  @Override
  public HttpResponseBuilder handleRequest(ParsedRequest request) {
    MessageDao messageDao = MessageDao.getInstance();
    AuthResult authResult = AuthFilter.doFilter(request);
    if(!authResult.isLoggedIn){
      return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
    }

    var filter = new Document("conversationId", request.getQueryParam("conversationId"));

    //var res = new RestApiAppResponse<>(true, messageDao.query(filter), null);
    var messages = messageDao.query(filter);

    /*
    Alternate way to handle retrieving user image for use in messages
    As explained by Professor Parra on 5/18/2023
    This is the backend version in java instead of the frontend version in javascript,
    The downside is that it will have to find all of the user images before it sends the conversation back
    Currently it shows the conversation first and then renders the pictures after

    messages.forEach(test -> {
      var filter2 = new Document("userName", test.fromId);  // Search the document for the username from authResult
      UserDao userDao = UserDao.getInstance();
      var foundUser = userDao.query(filter2);
      System.out.println("FoundUser username is: " + foundUser.get(0).getUserName());
      System.out.println("FoundUser image link is ||" + foundUser.get(0).getProfilePic() + " ||");
      test.setUserPicture(foundUser.get(0).getProfilePic()); // Should set the picture of this message to the one it finds for this user
    });


     */

    var res = new RestApiAppResponse<>(true, messages, null);

    return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
  }

}
