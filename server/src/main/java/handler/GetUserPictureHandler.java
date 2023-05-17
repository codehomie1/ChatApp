package handler;

import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;
import dao.UserDao;

public class GetUserPictureHandler implements BaseHandler {
    public HttpResponseBuilder handleRequest(ParsedRequest request) {

        // Get current user instance
        UserDao userDao = UserDao.getInstance();

        // Check if user is logged in first to ensure proper authorization
        AuthFilter.AuthResult authResult = AuthFilter.doFilter(request);
        if(!authResult.isLoggedIn){ // If not logged in somehow, say unauthorized
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }

        var filter = new Document("profilePic", request.getQueryParam("profilePic"));
        var res = new RestApiAppResponse<>(true, userDao.query(filter), null);
        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);

    }
}
