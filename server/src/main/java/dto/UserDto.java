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
  private String profilePic = "";
  public String getProfilePic() { return profilePic; }
  public void setProfilePic(String profilePic) { this.profilePic = profilePic; }



  public Document toDocument(){
    return new Document()
        .append("userName", userName)
        .append("password", password)
        .append("profilePic", profilePic);
  }

  public static UserDto fromDocument(Document match) {
    var userDto = new UserDto();
    userDto.setUserName(match.getString("userName"));
    userDto.setPassword(match.getString("password"));
    userDto.setProfilePic(match.getString("profilePic"));
    return  userDto;
  }

  /*
  Didn't do anything useful, just printed dto.UserDto@439f5b3d

  public static void main(String[] args) {
    UserDto testUser = new UserDto("1123120");
    testUser.setUserName("Username");
    testUser.setPassword("Password");
    testUser.setProfilePic("ExampleURL");

    System.out.println(testUser.toString());
  }
*/


}
