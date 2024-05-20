package org.billingii.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

/**
 * @author isaac
 * @created 10/05/2024 - 10:56
 * @project IntelliJ IDEA
 */
@Entity
public class Invoice {
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "total")
    private BigDecimal total;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "invoice_id")
    private int invoiceId;
    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "client_id", nullable = false)
    private Client clientByClientId;
    @OneToMany(mappedBy = "invoiceByInvoiceId")
    private Collection<InvoiceDetail> invoiceDetailsByInvoiceId;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public int getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(int invoiceId) {
        this.invoiceId = invoiceId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Invoice invoice = (Invoice) o;
        return invoiceId == invoice.invoiceId && Objects.equals(date, invoice.date) && Objects.equals(total, invoice.total);
    }

    @Override
    public int hashCode() {
        return Objects.hash(date, total, invoiceId);
    }

    public Client getClientByClientId() {
        return clientByClientId;
    }

    public void setClientByClientId(Client clientByClientId) {
        this.clientByClientId = clientByClientId;
    }

    public Collection<InvoiceDetail> getInvoiceDetailsByInvoiceId() {
        return invoiceDetailsByInvoiceId;
    }

    public void setInvoiceDetailsByInvoiceId(Collection<InvoiceDetail> invoiceDetailsByInvoiceId) {
        this.invoiceDetailsByInvoiceId = invoiceDetailsByInvoiceId;
    }
}
