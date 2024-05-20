package org.billingii.config;

import jakarta.persistence.Persistence;

/**
 * @author isaac
 * @created 07/05/2024 - 08:30
 * @project IntelliJ IDEA
 */
public class LazyFieldsFilter {
    @Override
    public boolean equals(Object obj){
        return obj == null || !Persistence.getPersistenceUtil().isLoaded(obj);
    }
}
