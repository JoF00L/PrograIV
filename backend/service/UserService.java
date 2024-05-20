package org.billingii.service;

import org.billingii.entities.Client;
import org.billingii.entities.User;
import org.billingii.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

/**
 * @author isaac
 * @created 06/05/2024 - 07:57
 * @project IntelliJ IDEA
 */
@org.springframework.stereotype.Service("userService")
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public void create(User user) throws Exception{
        try{
            // SOLO SE AGREGAN CON ROLE = PRO
            user.setRole("ADM");
            // ENCRIPTANDO PASSWORD
            var encoder = new BCryptPasswordEncoder();
            String password = user.getPassword();
            user.setPassword("{bcrypt}"+encoder.encode(password));
            System.out.println(user.getPassword());
            userRepository.save(user);
        } catch (Exception e){
            throw new Exception("ERROR");
        }
    }
    public void deleteByUserId(int userId) throws Exception{
        try{
            userRepository.delete(this.findByUserId(userId));
        } catch (Exception e){
            throw new Exception("ERROR");
        }
    }
    public void update(User user) throws Exception{
        try {
            // ENCRIPTANDO PASSWORD
            var encoder = new BCryptPasswordEncoder();
            String password = user.getPassword();
            user.setPassword("{bcrypt}"+encoder.encode(password));
            System.out.println(user.getPassword());
            userRepository.save(user);
        }
        catch (Exception e) {
            throw new Exception("ERROR");
        }
    }
    public User findByUserId(int userId){
        return userRepository.findByUserId(userId);
    }
    public User findByUserName(String name){
        return userRepository.findByUserName(name);
    }
    public List<User> findAllBySupplierName(String name){
        return userRepository.findAllBySupplierName(name);
    }
    public List<User> findAllSupplier(){
        return userRepository.findAllSupplier();
    }
    public Optional<User> checkUserToLogin(String name, String password){
        return userRepository.checkUserToLogin(name, password);
    }
    public void activate(int userId){
        userRepository.activate(userId);
    }
    public void deactivate(int userId){
        userRepository.deactivate(userId);
    }

}
