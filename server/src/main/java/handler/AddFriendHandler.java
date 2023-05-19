package handler;

import dao.UserDao;
import dto.UserDto;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
//import response.StatusCodes;

public class AddFriendHandler implements BaseHandler {
    private static final int OK = 200;
    private static final int BAD_REQUEST= 400;
    private static final int NOT_FOUND = 404;
    public UserDao userDao;

    public AddFriendHandler(UserDao userDao) {
        this.userDao = userDao;
    }


    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {
        // Retrieve the username and friendName from the request body or parameters
        String userName = request.getBodyParameter("userName");
        String friendName = request.getBodyParameter("friendName");

        // Check if both username and friendName are provided
        if (userName == null || friendName == null) {
            return new HttpResponseBuilder().setStatus(String.valueOf(BAD_REQUEST));
        }

        UserDto user = userDao.getByUsername(userName);
        if(user == null){
            return new HttpResponseBuilder().setStatus(String.valueOf(NOT_FOUND));
        }

        // Update the user's friend list
        Document filter = new Document("userName", userName);
        Document update = new Document("$addToSet", new Document("friends", friendName));
        userDao.update(filter, update);

        return new HttpResponseBuilder().setStatus(String.valueOf(OK));
    }
}
