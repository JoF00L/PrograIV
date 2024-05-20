package org.billingii.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.Objects;

/**
 * @author isaac
 * @created 10/05/2024 - 10:56
 * @project IntelliJ IDEA
 */
@Entity
public class User {
    @Basic
    @Column(name = "id")
    private String id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "role")
    private String role;
    @Basic
    @Column(name = "password")
    private String password;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "user_id")
    private int userId;
    @Basic
    @Column(name = "state")
    private Byte state;

    // TEST
    @JsonIgnore
    @OneToMany(mappedBy = "userByUserId")
    private Collection<Client> clientsByUserId;
    @JsonIgnore
    @OneToMany(mappedBy = "userByUserId")
    private Collection<Product> productsByUserId;

    //public User(String id, Object o, String role) {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Byte getState() {
        return state;
    }

    public void setState(Byte state) {
        this.state = state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return userId == user.userId && Objects.equals(id, user.id) && Objects.equals(name, user.name) && Objects.equals(role, user.role) && Objects.equals(password, user.password) && Objects.equals(state, user.state);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, role, password, userId, state);
    }

    public Collection<Client> getClientsByUserId() {
        return clientsByUserId;
    }

    public void setClientsByUserId(Collection<Client> clientsByUserId) {
        this.clientsByUserId = clientsByUserId;
    }

    public Collection<Product> getProductsByUserId() {
        return productsByUserId;
    }

    public void setProductsByUserId(Collection<Product> productsByUserId) {
        this.productsByUserId = productsByUserId;
    }
}
