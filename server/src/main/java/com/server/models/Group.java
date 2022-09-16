package com.server.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.sql.Timestamp;
import java.util.Collection;

import static javax.persistence.GenerationType.AUTO;

@Slf4j
@Entity
@Data
//@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_group",
        uniqueConstraints = {@UniqueConstraint(columnNames = "name")})
@NoArgsConstructor
public class Group {
    @Id @GeneratedValue(strategy = AUTO)
    private Long id;
    @NotBlank
    @Size(max=50)
    private String name;
    private String createdAt;
    private String updatedAt;
    @ManyToMany(fetch = FetchType.LAZY)
    @Column(name = "members")
    private Collection<User> members;

    public Group(String name, Collection<User> members) {
        this.name = name;
        this.createdAt = (new Timestamp(System.currentTimeMillis()).toString());
        this.updatedAt = (new Timestamp(System.currentTimeMillis()).toString());
        this.members = members;
    }
}
