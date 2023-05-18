package handler;

import dao.MessageDao;
import dto.BaseDto;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;
import dao.UserDao;


import java.util.ArrayList;
import java.util.List;


public class GetUserPictureHandler implements BaseHandler {
    /*
    public HttpResponseBuilder handleRequest(ParsedRequest request) {

        // Get current user instance
        UserDao userDao = UserDao.getInstance();

        // Check if user is logged in first to ensure proper authorization
        AuthFilter.AuthResult authResult = AuthFilter.doFilter(request);
        if(!authResult.isLoggedIn){ // If not logged in somehow, say unauthorized
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }


        // This is not working, getQueryParam returns null...
        var filter = new Document("profilePic", request.getQueryParam("profilePic"));
        System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        System.out.println("This retrieved: " + request.getQueryParam("profilePic"));
        var res = new RestApiAppResponse<>(true, userDao.query(filter), null);
        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);

    }
    */

    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {
        //MessageDao messageDao = MessageDao.getInstance();
        UserDao userDao = UserDao.getInstance();

        AuthFilter.AuthResult authResult = AuthFilter.doFilter(request);
        if(!authResult.isLoggedIn){
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }
        System.out.println("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
        //var filter = new Document("conversationId", request.getQueryParam("conversationId"));
        var filter = new Document("userName", request.getQueryParam("userName"));
        var foundUser = userDao.query(filter);
        System.out.println("Founduser is: " + foundUser.toString());
        System.out.println("FoundUser username is: " + foundUser.get(0).getUserName());
        System.out.println("FoundUser image link is " + foundUser.get(0).getProfilePic());
        //foundUser.set(0, foundUser.get(0).getProfilePic())
        // I know how to get the link but not how to get it out of this file...
        //foundUser.get(0).getProfilePic();


        //var messages = messageDao.query(filter);
        //var res = new RestApiAppResponse<>(true, messages, null);

        var res = new RestApiAppResponse<>(true, foundUser, null);
        //var res = new RestApiAppResponse<>(true, profilePicLink, null);


        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
    }
}
