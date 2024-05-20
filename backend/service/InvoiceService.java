package org.billingii.service;


import org.billingii.entities.Client;
import org.billingii.entities.Invoice;
import org.billingii.entities.InvoiceDetail;
import org.billingii.repository.InvoiceDetailRepository;
import org.billingii.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author isaac
 * @created 06/05/2024 - 07:56
 * @project IntelliJ IDEA
 */
@org.springframework.stereotype.Service("invoiceService")
public class InvoiceService {
    @Autowired
    InvoiceRepository invoiceRepository;
    public void create(Invoice invoice) throws Exception{
        try{
            Client c = clientService.read(invoice.getClientByClientId().getClientId());
            invoice.setClientByClientId(c);

            Invoice nInvoice = invoiceRepository.save(invoice);

            for (InvoiceDetail i: invoice.getInvoiceDetailsByInvoiceId()){
                i.setInvoiceByInvoiceId(nInvoice);
                invoiceDetailRepository.save(i);
            }

        } catch (Exception e){
            throw new Exception("ERROR");
        }
    }
    public Invoice read(int invoiceId) throws Exception{
        Optional<Invoice> op = invoiceRepository.findByInvoiceId(invoiceId);
        if(op.isPresent()) return op.get();
        else throw new Exception("ERROR");
    }
    public void update(Invoice invoice) throws Exception{
        try {
            invoiceRepository.save(invoice);
        }
        catch (Exception e) {
            throw new Exception("ERROR");
        }
    }
    @Autowired
    InvoiceDetailRepository invoiceDetailRepository;
    public void delete(int invoiceId) throws Exception{
        try{
            List<InvoiceDetail> details = this.findDetailByInvoiceId(invoiceId);
            for(InvoiceDetail i: details){
                invoiceDetailRepository.delete(i);
            }
            invoiceRepository.delete(this.read(invoiceId));
        } catch (Exception e){
            throw new Exception("ERROR");
        }
    }
    public List<Invoice>  findAllByClientId(int clientId){
        return invoiceRepository.findAllByClientId(clientId);
    }
    public Optional<Invoice> findByInvoiceId(int invoiceId){
        return invoiceRepository.findByInvoiceId(invoiceId);
    }
    // NEXT REPOSITORY [INVOICE-DETAIL]

    public List<InvoiceDetail> findDetailByInvoiceId(int invoiceId){
        return invoiceDetailRepository.findByInvoiceId(invoiceId);
    }
    @Autowired
    ClientService clientService;
    public List<Invoice> findAll(int userId){
        List<Client> clients = clientService.findAllByUserId(userId);
        System.out.println("Lista de clientes: "+clients.size());
        List<Invoice> invoices = new ArrayList<>();
        for (Client c : clients){
            invoices.addAll(this.findAllByClientId(c.getClientId()));
        }
        System.out.println("Lista de facturas: "+invoices.size());
        return invoices;
    }

}
