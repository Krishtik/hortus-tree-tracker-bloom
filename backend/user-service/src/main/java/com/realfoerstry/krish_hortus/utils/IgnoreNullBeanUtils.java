package com.realfoerstry.krish_hortus.utils;

import org.apache.commons.beanutils.BeanUtilsBean;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;

/*
 * IgnoreNullBeanUtils
 * -------------------
 * This file provides a helper to copy only non-null properties from one object to another.
 *
 * What does this utility do?
 * - When updating an object, sometimes you only want to change the fields that are not null.
 * - This utility helps with that, so you don't accidentally overwrite good data with nulls.
 *
 * This is useful for partial updates (PATCH-like behavior).
 */
@Component
public class IgnoreNullBeanUtils extends BeanUtilsBean {
    @Override
    public void copyProperty(Object dest, String name, Object value) throws IllegalAccessException, InvocationTargetException {
        if (value != null) {
            super.copyProperty(dest, name, value);
        }
    }
}