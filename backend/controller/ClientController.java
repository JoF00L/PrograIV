package org.billingii.controller;



import org.billingii.entities.Client;
import org.billingii.entities.User;
import org.billingii.security.UserDetailsImp;
import org.billingii.service.ClientService;
import org.billingii.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * @author isaac
 * @created 06/05/2024 - 07:54
 * @project IntelliJ IDEA
 */
@RestController
//@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/client")
public class ClientController {
    @Autowired
    ClientService clientService;
    @Autowired
    UserService userService;
    @GetMapping("/all/{userId}")
    public List<Client> getAllByUserId(@PathVariable int userId){
        return clientService.findAllByUserId(userId);
    }
    @PostMapping
    public void create(@AuthenticationPrincipal UserDetailsImp user, @RequestBody Client client){
        try{
            client.setUserByUserId(user.getUser());
            clientService.create(client);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
    @GetMapping("/{clientId}")
    public Client read(@PathVariable int clientId){
        try{
            return clientService.read(clientId);
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping
    public void update(@AuthenticationPrincipal UserDetailsImp user, @RequestBody Client client){
        try{
            client.setUserByUserId(user.getUser());
            clientService.update(client);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
    @DeleteMapping("/{clientId}")
    public void delete(@PathVariable int clientId){
        try{
            clientService.delete(clientId);
        } catch(Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/search")
    public List<Client> search(@AuthenticationPrincipal UserDetailsImp user, @RequestParam String name){
        return clientService.findAllByUserIdAndName(user.getUser().getUserId(), name);
    }

}
