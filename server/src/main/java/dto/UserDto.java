package dto;

import org.bson.Document;

public class UserDto extends BaseDto{

  private String userName;
  private String password;

  // Functions from Jaime's branch
  private String friendName = "";

  public String getFriendName(){
    return friendName;
  }

  public void setFriendName(String friendName){
    this.friendName = friendName;
  }


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
  private String profilePic = "";
  public String getProfilePic() { return profilePic; }
  public void setProfilePic(String profilePic) { this.profilePic = profilePic; }



  public Document toDocument(){
    return new Document()
        .append("userName", userName)
        .append("password", password)
        .append("profilePic", profilePic)
            .append("friendName", friendName);
  }

  public static UserDto fromDocument(Document match) {
    var userDto = new UserDto();
    userDto.setUserName(match.getString("userName"));
    userDto.setPassword(match.getString("password"));
    userDto.setProfilePic(match.getString("profilePic"));
    userDto.setFriendName(match.getString("friendName"));
    return  userDto;
  }

}
