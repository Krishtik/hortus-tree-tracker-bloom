package com.realfoerstry.krish_hortus.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private String operation ;
    private String tableName ;
    private List<AuditLogDiff> diff ;
    private Date created;
}
