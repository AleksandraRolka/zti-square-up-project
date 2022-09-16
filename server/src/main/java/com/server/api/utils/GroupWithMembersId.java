package com.server.api.utils;

import lombok.Data;
import java.sql.Date;
import java.util.Collection;

@Data
public
class GroupWithMembersId {
    private String name;
    private Date created_at;
    private Date updated_at;
    private Collection<Id> members;
}