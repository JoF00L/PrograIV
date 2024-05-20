package org.billingii.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * @author isaac
 * @created 10/05/2024 - 10:56
 * @project IntelliJ IDEA
 */
@Entity
@Table(name = "invoice_detail", schema = "business", catalog = "")
public class InvoiceDetail {
    @Basic
    @Column(name = "price")
    private BigDecimal price;
    @Basic
    @Column(name = "quantity")
    private Integer quantity;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "invoice_detail_id")
    private int invoiceDetailId;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "invoice_id")
    private Invoice invoiceByInvoiceId;
    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "product_id")
    private Product productByProductId;

    public BigDecimal getPrice() {
        return price;
    }
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    public int getInvoiceDetailId() {
        return invoiceDetailId;
    }

    public void setInvoiceDetailId(int invoiceDetailId) {
        this.invoiceDetailId = invoiceDetailId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InvoiceDetail that = (InvoiceDetail) o;
        return invoiceDetailId == that.invoiceDetailId && Objects.equals(price, that.price) && Objects.equals(quantity, that.quantity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(price, quantity, invoiceDetailId);
    }

    public Invoice getInvoiceByInvoiceId() {
        return invoiceByInvoiceId;
    }

    public void setInvoiceByInvoiceId(Invoice invoiceByInvoiceId) {
        this.invoiceByInvoiceId = invoiceByInvoiceId;
    }

    public Product getProductByProductId() {
        return productByProductId;
    }

    public void setProductByProductId(Product productByProductId) {
        this.productByProductId = productByProductId;
    }
}
