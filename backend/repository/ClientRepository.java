package org.billingii.repository;

import org.billingii.entities.Client;
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
public interface ClientRepository extends CrudRepository<Client,Integer> {
    @Query("SELECT c FROM Client c WHERE c.clientId = ?1")
    public Client findByClientId(int clientId);
    @Query("SELECT c FROM Client c WHERE c.id = ?1 AND c.userByUserId.userId = ?2")
    public Optional<Client> findByIdAndUserByUserId(String id, int userId);
    @Query("SELECT c FROM Client c WHERE c.userByUserId.userId = ?1")
    public List<Client> findAllByUserId(int userId);
    /*@Query("SELECT new org.jserverapp_iip.dto.ClientDTO(c.id, c.name, c.email, c.phone) " +
            "FROM Client c WHERE c.userByUserId.userId = ?1")
    List<ClientDTO> findAllByUserId(int userId);*/
    @Query("SELECT c FROM Client c WHERE c.userByUserId.userId = ?1 AND c.name LIKE %?2%")
    public List<Client> findAllByUserIdAndName (int userId, String name);
    @Query("SELECT c FROM Client c WHERE c.userByUserId.userId = ?1 AND c.id LIKE %?2%")
    public List<Client> findAllByUserIdAndId (int userId, String id);
}
