package org.billingii.repository;

import org.billingii.entities.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author isaac
 * @created 06/05/2024 - 07:55
 * @project IntelliJ IDEA
 */
@Repository
public interface ProductRepository extends CrudRepository<Product,Integer> {
    @Query("SELECT p FROM Product p WHERE p.userByUserId.userId = ?1")
    public List<Product> findAllByUserId(int userId);
    @Query("SELECT p FROM Product p WHERE p.productId = ?1")
    public Optional<Product> findByProductId(int productId);
    @Query("SELECT p FROM Product p WHERE p.userByUserId.userId = ?1 AND p.name LIKE %?2%")
    public List<Product> searchAllByUserIdAndName(int userId, String filter);
}
