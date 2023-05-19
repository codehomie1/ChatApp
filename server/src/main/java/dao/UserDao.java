package dao;

import com.mongodb.client.MongoCollection;
import dto.UserDto;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.conversions.Bson;

public class UserDao extends BaseDao<UserDto> {

  private static UserDao instance;

  private UserDao(MongoCollection<Document> collection){
    super(collection);
  }

  public static UserDao getInstance(){
    if(instance != null){
      return instance;
    }
    instance = new UserDao(MongoConnection.getCollection("UserDao"));
    return instance;
  }

  public static UserDao getInstance(MongoCollection<Document> collection){
    instance = new UserDao(collection);
    return instance;
  }

  @Override
  public void put(UserDto messageDto) {
    collection.insertOne(messageDto.toDocument());
  }


  // Function to update user's profile image
  public void changeProfilePic(Document foundDocument, String profilePic) {
    // Take in a pre-searched document that is the user we want to change.
    // Also take in a profilePic string which is the url or address to what we want the new one to be

    // This should set the profilePic of the user we want to change to the input one
    Bson newValue = new Document("profilePic", profilePic);
    System.out.println("Change profile pic new value is " + newValue);
    Bson setNewValueInDatabase = new Document("$set", newValue);  // Needs to have this format according to mongoDB documentation
    System.out.println("Change profile pic setNewValueInDatabase is " + setNewValueInDatabase);

    // Update the input userName in the collection with the new input profilePic value
    collection.updateOne(foundDocument, setNewValueInDatabase);
    System.out.println("User profile picture updated to " + profilePic);
  }


  // Functions from Jaime's branch
  public void update(Document filter, Document update) {
    try {
      collection.updateOne(filter, update);
    } catch (Exception e) {
      // Handle any exceptions that occur during the update process
      e.printStackTrace();
      // You can throw a custom exception or handle the error condition as per your application's requirements
    }
  }

  public UserDto getByUsername(String username){
    Document filter = new Document("userName", username);
    List<UserDto> users = query(filter);
    if(!users.isEmpty()){
      return users.get(0);
    }
    return null;
  }


  public List<UserDto> query(Document filter){
    return collection.find(filter)
        .into(new ArrayList<>())
        .stream()
        .map(UserDto::fromDocument)
        .collect(Collectors.toList());
  }

}
