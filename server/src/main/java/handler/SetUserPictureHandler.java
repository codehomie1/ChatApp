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

    System.out.println("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    System.out.println("The set picture handler got this back: " + request.getBody() +  "          _______________________ end");
    //userDao.changeProfilePic();
    var filter = new Document("userName", request.getQueryParam("userName"));
    System.out.println("Request query param username is: " + request.getQueryParam("userName"));

    //var changePic = new Document("profilePic", request.getQueryParam("profilePic"));
    //changePic.put("profilePic", "sosig.jpg");
    //
    // userDao.changeProfilePic(userDao, request.getBody());


    var res = new RestApiAppResponse<>(true, null, "test message back");
    return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
  }

}
