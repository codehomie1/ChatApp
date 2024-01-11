package handler;

import dao.UserDao;
import dto.UserDto;
import org.apache.commons.codec.digest.DigestUtils;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

public class CreateUserHandler implements BaseHandler{

  @Override
  public HttpResponseBuilder handleRequest(ParsedRequest request) {

    UserDto userDto = GsonTool.gson.fromJson(request.getBody(), dto.UserDto.class);
    UserDao userDao = UserDao.getInstance();

    if (
            userDto.getUserName().equals("") ||
            userDto.getPassword().equals("") ||
            userDto.getUserName() == null ||
            userDto.getPassword() == null
    ) {
      return new HttpResponseBuilder()
              .setStatus("400")
              .setBody
                      (new RestApiAppResponse<>(false, null, "Invalid Username or Password"));
    }


    var query = new Document("userName", userDto.getUserName());
    var resultQ = userDao.query(query);


    if(resultQ.size() != 0){
      return new HttpResponseBuilder()
              .setStatus("200 OK")
              .setBody
              (new RestApiAppResponse<>(false, null, "Username already taken"));

    }else{

      userDto.setPassword(DigestUtils.sha256Hex(userDto.getPassword()));
      userDao.put(userDto);

      return new HttpResponseBuilder().setStatus("200 OK").setBody(new RestApiAppResponse<>(true, null, "User Created"));
    }

  }
}
