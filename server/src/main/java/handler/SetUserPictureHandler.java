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

    //userDao.changeProfilePic();
    //var filter = new Document("profilePic", request.getQueryParam("profilePic"));
    //var changePic = new Document("profilePic", request.getQueryParam("profilePic"));
    //changePic.put("profilePic", "sosig.jpg");
    userDao.changeProfilePic(request.getBody(), request.getBody());


    var res = new RestApiAppResponse<>(true, null, null);
    return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
  }

}
