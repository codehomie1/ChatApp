package dto;

import java.time.Instant;
import org.bson.Document;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;

public class MessageDto extends BaseDto{

  public String fromId;
  private String toId;
  private String message;
  private Long timestamp;
  private String conversationId;

  private String convertedTimestamp;

  public MessageDto(){
    timestamp = Instant.now().toEpochMilli();
  }

  public MessageDto(String uniqueId) {
    super(uniqueId);
    //timestamp = Instant.now().toEpochMilli();
    timestamp = Instant.now().toEpochMilli();
    // Should convert the original timestamp value to local time theoretically
    convertedTimestamp = (LocalDateTime.ofEpochSecond(timestamp, 0, ZoneOffset.UTC).toString());
  }

  public String getFromId() {
    return fromId;
  }

  public void setFromId(String fromId) {
    this.fromId = fromId;
  }

  public String getToId() {
    return toId;
  }

  public void setToId(String toId) {
    this.toId = toId;
  }

  public String getMessage() {
    return message;
  }


  public void setMessage(String message) {
    this.message = message;
  }

  /* Original timestamp return function  */
  public Long getTimestamp()
  {
    return timestamp;
  }

  public String getconvertedTimestamp()
  {
    return convertedTimestamp;
  }




  public void setConversationId(String conversationId) {
    this.conversationId = conversationId;
  }

  public String getConversationId() {
    return conversationId;
  }

  public Document toDocument(){
    return new Document()
        .append("fromId", fromId)
        .append("toId", toId)
        .append("message", message)
        .append("timestamp", timestamp)
        .append("conversationId", conversationId)
        .append("convertedTimestamp", convertedTimestamp);
  }

  public static MessageDto fromDocument(Document document) {
    var message = new MessageDto();
    message.setMessage(document.getString("message"));
    message.setFromId(document.getString("fromId"));
    message.setToId(document.getString("toId"));
    message.timestamp = document.getLong("timestamp");
    message.convertedTimestamp = document.getString("convertedTimestamp");
    return message;
  }
}
