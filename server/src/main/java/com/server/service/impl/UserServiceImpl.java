package com.server.service.impl;

import com.server.models.User;
import com.server.models.Role;
import com.server.service.BalanceService;
import com.server.service.UserService;
import lombok.extern.slf4j.Slf4j;
import com.server.repository.UserRepository;
import com.server.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final BalanceService balanceService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Get user by email: {}", email);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            log.error("User not found in the database");
            throw new UsernameNotFoundException(("Incorrect data, user not found."));
        }
        log.info("User found in the database: {}", email);
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getName())));
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }

    @Override
    public void saveUser(User user) {
        log.info("Saving new user {} {} to the database", user.getFirstName(), user.getLastName());
        user.setPassword(passwordEncoder.encode((user.getPassword())));
        log.info("Roleeeees: {}", user.getRoles());
        log.info("Roleeeees count: {}", user.getRoles().size());
        userRepository.save(user);
        User userAdded = userRepository.findByEmail(user.getEmail());
        if (userAdded != null) {
            if (user.getRoles().size() == 0)
                addRoleToUser(user.getEmail(), "ROLE_USER");
            balanceService.addEmptyBalanceForUser(user.getId());
        }
    }

    @Override
    public void saveRole(Role role) {
        log.info("Saving new role {} to the database", role.getName());
        if (roleRepository.findByName(role.getName()) == null)
            roleRepository.save(role);
    }

    @Override
    public void addRoleToUser(String email, String roleName) {
        log.info("Adding role {} to user {}", roleName, email);
        User user = userRepository.findByEmail(email);
        Role role = roleRepository.findByName(roleName);
        if ((role == null) & (user != null)) {
            log.error("Role not exist. Creating new one");
            role = new Role(null, roleName);
            saveRole(role);
            user.getRoles().add(role);
        }
    }

    @Override
    public User getUser(String email) {
        log.info("Fetching user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserById(Long id) {
        log.info("Get user by id: {}", id);
        Optional<User> user = userRepository.findById(id);
        if (user.get() == null) {
            log.error("User not found in the database");
            throw new UsernameNotFoundException(("User not found in database"));
        }
        log.info("User with id : {} found in the database", id);
        return user;
    }

    public User getUserByEmail(String email) {
        log.info("Get user by email: {}", email);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            log.error("User not found in the database");
            throw new UsernameNotFoundException(("User not found in database"));
        }
        log.info("User with email : {} found in the database", email);
        return user;
    }

    @Override
    public List<User> getUsers() {
        log.info("Fetching all users");
        return userRepository.findAll();
    }

}
