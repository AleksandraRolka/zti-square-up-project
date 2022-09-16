package com.server.service;

import com.server.models.User;
import com.server.models.Role;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserService {
    void saveUser(User user);
    void saveRole(Role role);
    void addRoleToUser(String email, String roleName);
    User getUser(String email);
    List<User> getUsers();
    public UserDetails loadUserByUsername(String email);
    public Optional<User> getUserById(Long id);
    public User getUserByEmail(String email);
}
