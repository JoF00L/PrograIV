package org.billingii.controller;



import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.billingii.entities.Client;
import org.billingii.entities.User;
import org.billingii.security.UserDetailsImp;
import org.billingii.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * @author isaac
 * @created 06/05/2024 - 07:55
 * @project IntelliJ IDEA
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserService userService;
    @GetMapping
    public List<User> getAll(){
        return userService.findAllSupplier();
    }
    @PostMapping()
    public void create(@RequestBody User user) {
        try {
            userService.create(user);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
    @GetMapping("/{name}")
    public User read(@PathVariable String name){
        try{
            return userService.findByUserName(name);
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/{userId}")
    public void deleteByUserId(@PathVariable int userId) {
        try {
            userService.deleteByUserId(userId);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping
    public void update(@RequestBody User user){
        try{
            userService.update(user);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
    @GetMapping("/search")
    public List<User> search(@RequestParam String name){
        return userService.findAllBySupplierName(name);
    }
    @PutMapping("/activate/{userId}")
    public void activate(@PathVariable int userId){
        userService.activate(userId);
    }
    @PutMapping("/deactivate/{userId}")
    public void deactivate(@PathVariable int userId){
        userService.deactivate(userId);
    }
}
