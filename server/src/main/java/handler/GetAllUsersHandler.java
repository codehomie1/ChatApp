package handler;

import dao.MessageDao;
import dao.UserDao;
import dto.UserDto;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

public class GetAllUsersHandler implements BaseHandler {

    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {

        UserDao userDao = UserDao.getInstance();

        AuthFilter.AuthResult authResult = AuthFilter.doFilter(request);
        if(!authResult.isLoggedIn){
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }


        var filter = new Document();

        var userList = userDao.query(filter);

        System.out.println(userList);

        if (userList.size() == 0) {
            var res = new RestApiAppResponse<>(false, userList, "No other Users :(");
            return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
        }

        var res = new RestApiAppResponse<>(true, userList, null);
        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
    }

}
