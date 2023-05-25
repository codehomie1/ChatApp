package handler;

import dao.UserDao;
import dto.UserDto;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;
//import response.StatusCodes;

public class AddFriendHandler implements BaseHandler {

    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {
        // Retrieve the friendname from query parameter
        System.out.println("Inside friend handler");
        String friendName = request.getQueryParam("friendName");
        System.out.println("Found input friend name is: " + request.getQueryParam("friendName"));

        //friendName = "debugFriendName";

        UserDao userDao = UserDao.getInstance();

        AuthFilter.AuthResult authResult = AuthFilter.doFilter(request);

        if(!authResult.isLoggedIn){
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }



        // Experimental
        var filter2 = new Document("userName", authResult.userName);
        var foundUser = userDao.query(filter2);
        System.out.println("Found user: " + foundUser);
        System.out.println("Found user's username according to database is: " + foundUser.get(0).getUserName());
        System.out.println("Setting user's friendName to " + friendName);
        userDao.changeDatabaseFriend(filter2, friendName);
        foundUser.get(0).setFriendName(friendName);
        System.out.println("Should have set the friend now");

        var res = new RestApiAppResponse<>(true, null, "The friend was changed");
        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
    }
}
