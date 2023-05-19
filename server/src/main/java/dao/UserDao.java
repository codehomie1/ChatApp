package dao;

import com.mongodb.client.MongoCollection;
import dto.UserDto;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.bson.Document;

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

  @Override
  public void put(UserDto messageDto) {
    collection.insertOne(messageDto.toDocument());
  }


  public List<UserDto> query(Document filter){
    return collection.find(filter)
        .into(new ArrayList<>())
        .stream()
        .map(UserDto::fromDocument)
        .collect(Collectors.toList());
  }

}
