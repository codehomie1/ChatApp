package request;

public class CustomParser {

  // extract java useable values from a raw http request string
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
  public static ParsedRequest parse(String request){
    String[] lines = request.split("(\r\n|\r|\n)");
    String requestLine = lines[0];
    String[] requestParts = requestLine.split(" "); // Split request by spaces
    var result = new ParsedRequest();
    result.setMethod(requestParts[0]); // Method will be the first piece found

    var parts = requestParts[1].split("\\?"); // Will separate on question mark
    result.setPath(parts[0]); // Path should be the second piece found (parts is requestParts[1] split into parts) so it's correct

    // "Query params are optional"
    // So if the length is 2, that means it has query parts that need to be found and recorded
    if(parts.length == 2){
      System.out.println(parts[1]);
      String[] queryParts = parts[1].split("&");
      for (int i = 0; i < queryParts.length; i++) {
        String[] pair = queryParts[i].split("=");
        result.setQueryParam(pair[0], pair[1]);
      }
    }

    String body = "";
    boolean emptyLine = false;
    for (String line: lines){
      // Header extraction, indicated by :
      if(line.contains(":") && !emptyLine){
        String[] headerParts = line.split(":");
        result.setHeaderValue(headerParts[0].trim(), headerParts[1].trim());
      }
      if(line.equals("")){
        emptyLine = true;
      }
      if(emptyLine){
        body += line;
      }
    }
    result.setBody(body);
    return result;
  }
}
