package com.server.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "role",
        uniqueConstraints = {@UniqueConstraint(columnNames = "name")})
public class Role {
    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;
    @NotBlank
    private String name;
}
