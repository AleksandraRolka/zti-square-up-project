package com.server.repository;

import com.server.models.Group;
import com.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {

    Group findByName(String name);
    Optional<Group> findById(Long id);
    List<Group> findAll();
    Collection<User> findMembersById(Long id);
}
