package org.billingii.repository;

import jakarta.transaction.Transactional;
import org.billingii.entities.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author isaac
 * @created 06/05/2024 - 07:55
 * @project IntelliJ IDEA
 */
@Repository
public interface UserRepository extends CrudRepository<User,Integer> {
    @Query("SELECT u FROM User u WHERE u.userId = ?1")
    public User findByUserId(int userId);
    @Query("SELECT u FROM User u WHERE u.name = ?1")
    public User findByUserName(String name);
    @Query("SELECT u FROM User u WHERE u.name LIKE %?1% AND u.role = 'PRO'")
    public List<User> findAllBySupplierName(String name);
    @Query("SELECT u FROM User u WHERE u.role = 'PRO'")
    public List<User> findAllSupplier();
    @Query("SELECT u FROM User u WHERE u.name = ?1 AND u.password =?2")
    public Optional<User> checkUserToLogin(String name, String password);
    @Query("UPDATE User u SET u.state = 1 WHERE u.userId = ?1")
    @Modifying
    @Transactional
    public void activate(int userId);
    @Query("UPDATE User u SET u.state = 0 WHERE u.userId = ?1")
    @Modifying
    @Transactional
    public void deactivate(int userId);
   /* @Query("DELETE FROM User u WHERE u.userId = :userId")
    void deleteByUserId(int C);*/
    @Query("DELETE FROM User u WHERE u.userId = ?1")
    void deleteByUserId(int userId);

}
