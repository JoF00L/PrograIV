package org.billingii.service;

import org.billingii.entities.Product;
import org.billingii.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

/**
 * @author isaac
 * @created 06/05/2024 - 07:57
 * @project IntelliJ IDEA
 */
@org.springframework.stereotype.Service("productService")
public class ProductService {
    @Autowired
    ProductRepository productRepository;
    public void create(Product product) throws Exception{
        try{
            productRepository.save(product);
        } catch (Exception e){
            throw new Exception("ERROR");
        }
    }
    public Product read(int productId) throws Exception{
        Optional<Product> op = productRepository.findByProductId(productId);
        if(op.isPresent()) return op.get();
        else throw new Exception("ERROR");
    }
    public void update(Product product) throws Exception{
        try {
            productRepository.save(product);
        }
        catch (Exception e) {
            throw new Exception("ERROR");
        }
    }
    public void delete(int productId) throws Exception{
        try{
            productRepository.delete(this.read(productId));
        } catch (Exception e){
            throw new Exception("ERROR");
        }
    }
    public List<Product> findAllByUserId(int userId){
        return productRepository.findAllByUserId(userId);
    }
    public Optional<Product> findByProductId(int productId){
        return productRepository.findByProductId(productId);
    }
    public List<Product> searchAllByUserIdAndName(int userId, String filter){
        return productRepository.searchAllByUserIdAndName(userId, filter);
    }
}
