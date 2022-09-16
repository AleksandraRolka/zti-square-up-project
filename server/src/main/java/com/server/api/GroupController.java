package com.server.api;

import com.server.api.utils.CustomErrorMessage;
import com.server.api.utils.GroupWithMembersId;
import com.server.api.utils.MembersList;
import com.server.models.Group;
import com.server.repository.GroupRepository;
import com.server.service.GroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.*;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class GroupController {
    private final GroupService groupService;
    private final GroupRepository groupRepository;

    @PostMapping(path = "/group/save")
    public ResponseEntity<?>createGroup(@RequestBody GroupWithMembersId group) {
        URI uri = URI.create(
                ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/group/save").toUriString());
        if(groupRepository.findByName(group.getName()) != null)
            return ResponseEntity.badRequest().body(new CustomErrorMessage("Group with that name alredy exists"));
        groupService.createGroupFromMembersIdList(group);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/group/{id}")
    public ResponseEntity<?> getGroup(@PathVariable("id") Long id) {
        if(groupRepository.findById(id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("Can not get group details. Group does not exists"));
        return ResponseEntity.ok().body(groupService.getGroup(id));
    }

    @PostMapping(path = "/group/{id}/addmembers")
    public ResponseEntity<?> addMembersToGroup(@PathVariable("id") Long id,
                                                   @RequestBody MembersList membersList) {
        if(groupRepository.findById(id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("Can not add members to not existing group"));
        groupService.addNewMembersToGroup(id, membersList.getMembers());
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/group/{id}/members")
    public ResponseEntity<?> getGroupMembers(@PathVariable("id") Long id) {
        if(groupRepository.findById(id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("Can not get members of not existing group"));
        return ResponseEntity.ok().body(groupService.getGroupMembers(id));
    }

    @GetMapping(path = "/groups")
    public ResponseEntity<Collection<Group>>getGroups() {
        return ResponseEntity.ok().body(groupService.getGroups());
    }
}