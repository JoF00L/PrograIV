package org.billingii.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.billingii.entities.User;
import org.billingii.security.UserDetailsImp;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/login")
public class LoginController {
    @PostMapping("/login")
    public User login(@RequestBody User user, HttpServletRequest request) {
        try {
            System.out.println("Usuario recibido: " + user.getName());
            System.out.println("Contraseña recibida: " + user.getPassword());
            var encoder = new BCryptPasswordEncoder();
            System.out.println("Contraseña recibida: " + "{bcrypt}"+encoder.encode(user.getPassword()));
            request.login(user.getName(), user.getPassword());
        } catch (ServletException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Authentication auth = (Authentication) request.getUserPrincipal();
        User u = ((UserDetailsImp) auth.getPrincipal()).getUser();
        User userSession = new User();
        userSession = (User) u;
        userSession.setPassword("-_-");
        return userSession;
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request) {
        try {
            request.logout();
        } catch (ServletException e) {
        }
    }

    @GetMapping("/current-user")
    public User getCurrentUser(@AuthenticationPrincipal UserDetailsImp user) {
        User userSession = new User();
        userSession = user.getUser();
        userSession.setPassword("-_-");
        return userSession;
    }
}
