package handler;

import dao.UserDao;
import dto.UserDto;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

public class UploadPictureHandler implements BaseHandler {
    public HttpResponseBuilder handleRequest(ParsedRequest request) {

        // Get current user instance
        UserDao userDao = UserDao.getInstance();

        // Check if user is logged in first to ensure proper authorization
        AuthFilter.AuthResult authResult = AuthFilter.doFilter(request);
        if(!authResult.isLoggedIn){ // If not logged in somehow, say unauthorized
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }

        // Doesn't do anything right now
        return null;
    }
}
