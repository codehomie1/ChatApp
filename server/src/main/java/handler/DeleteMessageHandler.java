package handler;

import dao.MessageDao;
import handler.AuthFilter.AuthResult;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

public class DeleteMessageHandler implements BaseHandler {

    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {

        MessageDao messageDao = MessageDao.getInstance();

        AuthResult authResult = AuthFilter.doFilter(request);

        if (!authResult.isLoggedIn) {
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }

        String conversationId = request.getBody();

        // get the timestamp from the query parameter
        String timestampStr = request.getQueryParam("timestamp");
        if (timestampStr == null) {
            var res = new RestApiAppResponse<>(false, null, "Timestamp not provided");
            return new HttpResponseBuilder().setStatus("400 Bad Request").setBody(res);
        }

        // convert the timestamp to Long
        Long timestamp = Long.valueOf(timestampStr);
        messageDao.delete(timestamp);




        var res = new RestApiAppResponse<>(true, null, null);
        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
    }

}
