package handler;

import dao.UserDao;
import handler.AuthFilter.AuthResult;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

public class SetUserPictureHandler implements BaseHandler {

  @Override
  public HttpResponseBuilder handleRequest(ParsedRequest request) {

    System.out.println(request.getBody());
    UserDao userDao = UserDao.getInstance();

    AuthResult authResult = AuthFilter.doFilter(request);

    if(!authResult.isLoggedIn){
      return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
    }

    System.out.println("***************** LOCATOR FOR SET USER PICTURE DEBUG STATEMENTS  *****************");
    System.out.println("The set picture handler got this back: " + request.getBody() +  "          _______________________ end");

    // Search the database for the userName
    var filter = new Document("userName", request.getQueryParam("userName"));  // Search the document for the username
    var foundUser = userDao.query(filter);  // Once found, isolate it

    System.out.println("Request body is " + "||" + request.getBody() + "||");
    //String newUrl = request.getBody();
    // Testing hardcoded value to see if this works
    String newUrl = "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/DCTM_Penguin_UK_DK_AL644648_p7nd0z.jpg";
    // Run changeProfilePic function from userDao on the userName and change the profilePic url
    userDao.changeProfilePic(foundUser.get(0).getUserName(), newUrl);

    var res = new RestApiAppResponse<>(true, null, "The picture was changed");
    return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
  }

}
