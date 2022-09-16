package com.server.service;

import com.server.api.utils.GroupWithMembersId;
import com.server.models.Group;

import com.server.api.utils.Id;
import com.server.models.User;

import java.util.Collection;
import java.util.Optional;

public interface GroupService {
    public void createGroup(Group group);
    public void createGroupFromMembersIdList(GroupWithMembersId group);
    public Optional<Group> getGroup(Long id);
    public Collection<Group> getGroups();
    public void addNewMembersToGroup(Long groupId, Collection<Id> membersIdsList);
    public Collection<User> getGroupMembers(Long id);
    public Collection<Group> getUserGroups(Long id);
}
