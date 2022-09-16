package com.server.api.utils;

import lombok.Data;

import java.util.Collection;

@Data
public
class MembersList {
    private Collection<Id> members;
}