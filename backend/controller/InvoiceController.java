package org.billingii.controller;


import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.VerticalAlignment;
import jakarta.servlet.http.HttpServletResponse;
import org.billingii.entities.Client;
import org.billingii.entities.Invoice;
import org.billingii.entities.InvoiceDetail;
import org.billingii.entities.Product;
import org.billingii.security.UserDetailsImp;
import org.billingii.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.awt.*;
import java.util.List;
import java.util.Optional;

/**
 * @author isaac
 * @created 06/05/2024 - 07:53
 * @project IntelliJ IDEA
 */
@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {
    @Autowired
    InvoiceService invoiceService;
    @PostMapping
    public void create(@RequestBody Invoice invoice) {
        try{
            invoiceService.create(invoice);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
    @GetMapping()
    public List<Invoice> getAllInvoiceByUserId(@AuthenticationPrincipal UserDetailsImp user){
        return invoiceService.findAll(user.getUser().getUserId());
    }
    @GetMapping("/details/{invoiceId}")
    public List<InvoiceDetail> getAllDetailsByInvoiceId(@PathVariable int invoiceId){
        return invoiceService.findDetailByInvoiceId(invoiceId);
    }
    @DeleteMapping("/{invoiceId}")
    public void delete(@PathVariable int invoiceId) throws Exception{
        try{
            invoiceService.delete(invoiceId);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/pdf/{invoiceId}")
    public void pdf(@PathVariable int invoiceId, HttpServletResponse response) throws Exception{
        try {
            response.addHeader("Content-Type", "application/pdf");
            Optional<Invoice> invoice = invoiceService.findByInvoiceId(invoiceId);
            PdfWriter writer = new PdfWriter(response.getOutputStream());
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            Paragraph paragraph = new Paragraph("Invoice details");
            paragraph.setTextAlignment(TextAlignment.CENTER).setBold();
            document.add(paragraph);

            document.add(new Paragraph().add(new Text("Date: ").setBold()).add(String.valueOf(invoice.get().getDate())));
            document.add(new Paragraph().add(new Text("Total: ").setBold()).add("$" + invoice.get().getTotal()));
            document.add(new Paragraph().add(new Text("Invoice ID: ").setBold()).add(String.valueOf(invoice.get().getInvoiceId())));
            document.add(new Paragraph().add(new Text("Client: ").setBold()).add(invoice.get().getClientByClientId().getName()));

            Paragraph productList = new Paragraph("Product information & details");
            productList.setTextAlignment(TextAlignment.CENTER).setBold();
            document.add(productList);

            List<InvoiceDetail> detailList = invoiceService.findDetailByInvoiceId(invoiceId);
            if (detailList != null && !detailList.isEmpty()) {
                float[] columnWidths = {100F, 200F, 100F, 100F};
                Table table = new Table(columnWidths);
                table.setTextAlignment(TextAlignment.CENTER).setVerticalAlignment(VerticalAlignment.MIDDLE);

                DeviceRgb cellColor = new DeviceRgb(143,135,255);
                table.addHeaderCell(new Cell().add(new Paragraph("ID del producto").setBold()).setBackgroundColor(cellColor).setVerticalAlignment(VerticalAlignment.MIDDLE));
                table.addHeaderCell(new Cell().add(new Paragraph("Nombre del producto").setBold()).setBackgroundColor(cellColor).setVerticalAlignment(VerticalAlignment.MIDDLE));
                table.addHeaderCell(new Cell().add(new Paragraph("Precio del producto").setBold()).setBackgroundColor(cellColor).setVerticalAlignment(VerticalAlignment.MIDDLE));
                table.addHeaderCell(new Cell().add(new Paragraph("Cantidad").setBold()).setBackgroundColor(cellColor).setVerticalAlignment(VerticalAlignment.MIDDLE));

                for (InvoiceDetail d : detailList) {
                    Product p = d.getProductByProductId();
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(p.getId()))));
                    table.addCell(new Cell().add(new Paragraph(p.getName())));
                    table.addCell(new Cell().add(new Paragraph("$" + p.getPrice())));
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(d.getQuantity()))));
                }

                document.add(table);
            }

            document.close();
        }
        catch (Exception e){
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
    @GetMapping("/search")
    public List<Invoice> search(@RequestParam int clientId){
        return invoiceService.findAllByClientId(clientId);
    }
}
