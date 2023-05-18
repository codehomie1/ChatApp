package handler;

import dao.MessageDao;
import handler.AuthFilter.AuthResult;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

public class GetConversationHandler implements BaseHandler {

  @Override
  public HttpResponseBuilder handleRequest(ParsedRequest request) {
    MessageDao messageDao = MessageDao.getInstance();
    AuthResult authResult = AuthFilter.doFilter(request);
    if(!authResult.isLoggedIn){
      return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
    }

    var filter = new Document("conversationId", request.getQueryParam("conversationId"));
    var messages = messageDao.query(filter);

    var res = new RestApiAppResponse<>(true, messages, null);
    return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
  }

}
