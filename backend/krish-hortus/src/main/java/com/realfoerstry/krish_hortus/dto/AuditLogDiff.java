package com.realfoerstry.krish_hortus.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDiff {
    private String key ;
    private Object oldValue ;
    private Object newValue ;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AuditLogDiff auditLogDiff = (AuditLogDiff) o;
        return key != null && key.equals(auditLogDiff.key);
    }

    @Override
    public int hashCode() {
        return Objects.hash(key);
    }
}
