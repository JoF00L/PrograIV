package org.billingii.controller;

import org.billingii.entities.Client;
import org.billingii.entities.Product;
import org.billingii.security.UserDetailsImp;
import org.billingii.service.ProductService;
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
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    ProductService productService;
    @PostMapping
    public void create(@AuthenticationPrincipal UserDetailsImp user, @RequestBody Product product){
        try{
            product.setUserByUserId(user.getUser());
            productService.create(product);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
    @GetMapping("/{productId}")
    public Product read(@PathVariable int productId){
        try{
            return productService.read(productId);
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping
    public void update(@RequestBody Product product) throws Exception{
        try {
            productService.update(product);
        }
        catch (Exception e) {
            throw new Exception("ERROR");
        }
    }
    @DeleteMapping("/{productId}")
    public void delete(@PathVariable int productId) throws Exception{
        try{
            productService.delete(productId);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/all/{userId}")
    public List<Product> getAllByUserId(@PathVariable int userId){

        return productService.findAllByUserId(userId);
    }
    @GetMapping("/search")
    public List<Product> search(@AuthenticationPrincipal UserDetailsImp user, @RequestParam String name){
        return productService.searchAllByUserIdAndName(user.getUser().getUserId(), name);
    }

}
