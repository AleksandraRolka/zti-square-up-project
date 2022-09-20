package com.server.service.impl;

import com.server.api.utils.GroupWithMembersId;
import com.server.api.utils.Id;
import com.server.models.Debt;
import com.server.models.Group;
import com.server.models.User;
import com.server.repository.DebtRepository;
import com.server.repository.GroupRepository;
import com.server.repository.UserRepository;
import com.server.service.GroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class GroupServiceImpl implements GroupService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final DebtRepository debtRepository;

    public void createGroup(Group group) {
        log.info("Creating new group");
        if (groupRepository.findByName(group.getName()) == null) {
            log.info("Group with name: {} already exist in database.", group.getName());
            throw new RuntimeException("Group with name: " + group.getName() + " already exist in database.");
        }
        groupRepository.save(group);
        Collection<User> users = group.getMembers();
        if(!(users.size() > 1)) {
            log.info("Creating 0.00 debt beetween users in new group.");
            users.forEach( user1 -> {
                for (User user2 : users) {
                    if (user1.getId() != user2.getId())
                        if (debtRepository.findByAllAtributes(user1.getId(), user2.getId(),group.getId()).isEmpty())
                            debtRepository.save(new Debt(user1.getId(), user2.getId(), group.getId()));
                }
            });
        }
    }

    public void createGroupFromMembersIdList(GroupWithMembersId obj) {
        log.info("Creating new group");
        Collection<User> members = new ArrayList<>();
        obj.getMembers().forEach(memberId -> {
            Optional<User> member = userRepository.findById(memberId.getId());
            members.add(member.get());
        });
        Group group = new Group(obj.getName(), members);
        groupRepository.save(group);
        Collection<User> users = group.getMembers();
        if(!(users.size() > 1)) {
            log.info("Creating 0.00 debt beetween users in new group.");
            users.forEach( user1 -> {
                for (User user2 : users) {
                    if (user1.getId() != user2.getId())
                        if (debtRepository.findByAllAtributes(user1.getId(), user2.getId(),group.getId()).isEmpty())
                            debtRepository.save(new Debt(user1.getId(), user2.getId(), group.getId()));
                }
            });
        }
    }

    public void addNewMembersToGroup(Long groupId, Collection<Id> idsMemberToAdd) {
        log.info("Adding new members to group");
        Group group = groupRepository.findById(groupId).get();
        Collection<Long> membersIdList = new ArrayList<>();
        Collection<User> allGroupMembers = new ArrayList<>();

        group.getMembers().forEach(member -> { membersIdList.add(member.getId()); });
        idsMemberToAdd.forEach(member -> { membersIdList.add(member.getId()); });
        Collection<Long> resultMembersIdList = new ArrayList<>(new HashSet<>(membersIdList));
        resultMembersIdList.forEach(userId -> {
            Optional<User> user = userRepository.findById(userId);
            allGroupMembers.add(user.get());
        });
        group.setMembers(allGroupMembers);
        groupRepository.save(group);

        Collection<User> users = group.getMembers();
        if(!(users.size() > 1)) {
            log.info("Creating 0.00 debt beetween new members and users in the group.");
            users.forEach( user1 -> {
                for (User user2 : users) {
                    if (user1.getId() != user2.getId())
                        if (debtRepository.findByAllAtributes(user1.getId(), user2.getId(),group.getId()).isEmpty())
                            debtRepository.save(new Debt(user1.getId(), user2.getId(), group.getId()));
                }
            });
        }
    }

    public Optional<Group> getGroup(Long id) {
        Optional<Group> group = groupRepository.findById(id);
        log.info("Group with id : {} found in the database", id);
        return group;
    }

    public Collection<Group> getGroups() {
        log.info("Fetching all group");
        return groupRepository.findAll();
    }

    public Collection<User> getGroupMembers(Long id) {
        log.info("Fetching group id: {} members", id);
        Collection<User> members = groupRepository.findById(id).get().getMembers();
        return members;
    }

    public Collection<Group> getUserGroups(Long id) {
        log.info("Fetching groups by user id: {}.", id);
        Collection<Group> allGroups = groupRepository.findAll();
        Collection<Group> userGroups = new ArrayList<>();
        allGroups.forEach(group -> {
            final boolean[] isUserInGroup = {false};
            group.getMembers().forEach(member -> {
                log.info("member.getId() ---------> {} ", member.getId());
                if (member.getId() == id) {
                    isUserInGroup[0] = true;
                }
            });
            if (isUserInGroup[0] == true) {
                userGroups.add(group);
            }
        });
        return userGroups;
    }
}

