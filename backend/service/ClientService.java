package org.billingii.service;


import org.billingii.entities.Client;
import org.billingii.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

/**
 * @author isaac
 * @created 06/05/2024 - 07:57
 * @project IntelliJ IDEA
 */
@org.springframework.stereotype.Service("clientService")
public class ClientService {
    @Autowired
    ClientRepository clientRepository;
    public void create(Client client) throws Exception{
        try{
            clientRepository.save(client);
        } catch (Exception e){
            throw new Exception("ERROR");
        }
    }
    public Client read(int clientId) throws Exception{
        return clientRepository.findByClientId(clientId);
    }
    public void update(Client client) throws Exception{
        try {
            clientRepository.save(client);
        }
        catch (Exception e) {
            throw new Exception("ERROR");
        }
    }
    public void delete(int clientId) throws Exception{
        try{
            clientRepository.delete(this.findByClientId(clientId));
        } catch (Exception e){
            throw new Exception("ERROR");
        }
    }
    public Client findByClientId(int clientId){
        return clientRepository.findByClientId(clientId);
    }
    public Optional<Client> findByIdAndUserByUserId(String id, int userId){
        return clientRepository.findByIdAndUserByUserId(id,userId);
    }
    public List<Client> findAllByUserId(int userId){
        return clientRepository.findAllByUserId(userId);
    }
    public List<Client> findAllByUserIdAndName(int userId, String name){
        return clientRepository.findAllByUserIdAndName(userId, name);
    }
    public List<Client> findAllByUserIdAndId(int userId, String id){
        return clientRepository.findAllByUserIdAndId(userId, id);
    }
}
