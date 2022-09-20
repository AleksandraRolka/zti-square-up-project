package com.server.api;

import com.server.api.utils.CustomErrorMessage;
import com.server.api.utils.Email;
import com.server.api.utils.RoleToUserForm;
import com.server.models.User;
import com.server.models.Role;
import com.server.repository.RoleRepository;
import com.server.repository.UserRepository;
import com.server.service.GroupService;
import com.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.*;


@Slf4j
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class UserController {
    private final UserService userService;
    private final GroupService groupService;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @GetMapping(path = "/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Long id) {
        log.info("Fetch user by id: {}", id);
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist!"));
        return ResponseEntity.ok().body(user);
    }

    @PostMapping(path = "/user")
    public ResponseEntity<?> getUserByEmail(@RequestBody Email obj) {
        log.info("Fetch user by email: {}", obj);
        log.info("Fetch user by email: {}", obj.getEmail());
        User user = userService.getUser(obj.getEmail());
        if(user == null)
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User does not exist!"));
        return ResponseEntity.ok().body(user);
    }

    @GetMapping(path = "/users")
    public ResponseEntity<List<User>>getUsers() {
        return ResponseEntity.ok().body(userService.getUsers());
    }

    @PostMapping(path = "/role/save")
    public ResponseEntity<?>saveRole(@RequestBody Role role) {
        URI uri = URI.create(
                ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/role/save").toUriString());
        if(roleRepository.findByName(role.getName()) != null)
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User with this email already exists."));
        userService.saveRole(role);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/role/addtouser")
    public ResponseEntity<?>addToleToUser(@RequestBody RoleToUserForm form) {
        if(userRepository.findByEmail(form.getEmail()) == null)
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist, can not add role to this user"));
        userService.addRoleToUser(form.getEmail(), form.getRoleName());
        return ResponseEntity.ok().build();
    }


    @GetMapping(path = "/user/{id}/groups")
    public ResponseEntity<?>getUserGroupsById(@PathVariable("id") Long id) {
        if(userRepository.findById(id) == null)
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist."));
        return ResponseEntity.ok().body(groupService.getUserGroups(id));
    }
}

