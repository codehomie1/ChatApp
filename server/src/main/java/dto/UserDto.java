package dto;

import org.bson.Document;

public class UserDto extends BaseDto{

  private String userName;
  private String password;

  public UserDto() {
    super();
  }

  public UserDto(String uniqueId) {
    super(uniqueId);
  }

  public String getPassword() {
    return password;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public void setPassword(String password) {
    this.password = password;
  }


  // Default Profile Picture is blank
  private String profileURL = "";
  public String getProfileURL() { return profileURL; }
  public void setProfileURL(String profileURL) { this.profileURL = profileURL; }


  public Document toDocument(){
    return new Document()
        .append("userName", userName)
        .append("password", password);
  }

  public static UserDto fromDocument(Document match) {
    var userDto = new UserDto();
    userDto.setUserName(match.getString("userName"));
    userDto.setPassword(match.getString("password"));
    userDto.setProfileURL(match.getString("profileURL"));
    return  userDto;
  }
}
