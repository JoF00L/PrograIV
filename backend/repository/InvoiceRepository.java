package org.billingii.repository;

import org.billingii.entities.Invoice;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * @author isaac
 * @created 06/05/2024 - 07:55
 * @project IntelliJ IDEA
 */
@Repository
public interface InvoiceRepository extends CrudRepository<Invoice,Integer> {
    @Query("SELECT i FROM Invoice i WHERE i.clientByClientId.clientId = ?1")
    public List<Invoice> findAllByClientId(int clientId);
    @Query("SELECT i FROM Invoice i WHERE i.invoiceId = ?1")
    public Optional<Invoice> findByInvoiceId(int invoiceId);
    @Query("SELECT i FROM Invoice i WHERE i.invoiceId = ?1")
    public Optional<Invoice> findAllByUserId(int invoiceId);
    @Query("SELECT i FROM Invoice i WHERE i.total = ?1")
    public List<Invoice> findAllByTotal (BigDecimal total);



}
