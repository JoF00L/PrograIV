package org.billingii.repository;


import org.billingii.entities.InvoiceDetail;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author isaac
 * @created 06/05/2024 - 07:55
 * @project IntelliJ IDEA
 */
@Repository
public interface InvoiceDetailRepository extends CrudRepository<InvoiceDetail,Integer> {
    @Query("SELECT i FROM InvoiceDetail i WHERE i.invoiceByInvoiceId.invoiceId = ?1")
    public List<InvoiceDetail> findByInvoiceId(int invoiceId);
}
