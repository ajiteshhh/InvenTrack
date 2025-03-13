import { jsPDF } from "jspdf";
import { toast } from "sonner";

export const generateInvoice = async (viewOrder, userData) => {
    if (!viewOrder || !viewOrder.order || !Array.isArray(viewOrder.items)) {
        toast.error("Invalid order data");
        return;
    }
    await toast.promise(
        new Promise((resolve, reject) => {
            try {
                const doc = new jsPDF();
                if (userData.business_logo && userData.business_logo.split('.').pop() === 'png') {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.src = userData.business_logo;

                    img.onload = function() {
                        generatePDFContent(doc, img);
                        doc.save(`invoice-${viewOrder.order.id}.pdf`);
                        resolve();
                    };

                    img.onerror = function() {
                        console.error("Failed to load logo image");
                        generatePDFContent(doc);
                        doc.save(`invoice-${viewOrder.order.id}.pdf`);
                        resolve();
                    };
                } else {
                    generatePDFContent(doc);
                    doc.save(`invoice-${viewOrder.order.id}.pdf`);
                    resolve();
                }

                function generatePDFContent(doc, logoImg = null) {
                    const primaryColor = [41, 128, 185];
                    const secondaryColor = [100, 100, 100];

                    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                    doc.rect(0, 0, 210, 40, 'F');

                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(24);
                    doc.setFont("helvetica", "bold");
                    doc.text('INVOICE', 20, 25);

                    if (logoImg) {
                        doc.addImage(logoImg, 'PNG', 60, 10, 30, 30);
                    }

                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text(`${userData.business_name}`, 150, 15);
                    doc.text(`${userData.business_address}`, 150, 20);
                    doc.text(`${userData.email}`, 150, 25);
                    doc.text(`${userData.phone_number}`, 150, 30);

                    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
                    doc.setFontSize(11);
                    doc.setFont("helvetica", "bold");
                    doc.text(`Invoice #: ${viewOrder.order.id}`, 20, 50);
                    doc.text(`Date: ${new Date(viewOrder.order.created_at).toLocaleDateString()}`, 20, 55);

                    doc.setDrawColor(200, 200, 200);
                    doc.roundedRect(20, 65, 170, 40, 3, 3, 'S');
                    doc.setFontSize(12);
                    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                    doc.text('Bill To:', 25, 75);
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
                    doc.setFontSize(11);
                    doc.text(`${viewOrder.order.name || 'N/A'}`, 25, 82);
                    doc.text(`${viewOrder.order.email || 'N/A'}`, 25, 89);
                    doc.text(`${viewOrder.order.phone_number || 'N/A'}`, 25, 96);
                    doc.text(`${viewOrder.order.address || 'N/A'}`, 25, 103);

                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
                    doc.text(`Status: ${viewOrder.order.status || 'N/A'}`, 130, 82);
                    doc.text(`Type: ${viewOrder.order.type || 'N/A'}`, 130, 89);

                    doc.setFillColor(240, 240, 240);
                    doc.rect(20, 115, 170, 10, 'F');
                    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                    doc.setFontSize(10);
                    doc.text('Item', 25, 122);
                    doc.text('SKU', 75, 122);
                    doc.text('Qty', 115, 122);
                    doc.text('Price', 135, 122);
                    doc.text('Total', 165, 122);

                    doc.setDrawColor(200, 200, 200);
                    doc.line(20, 125, 190, 125);

                    let yPosition = 135;
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(80, 80, 80);

                    if (viewOrder.items.length > 0) {
                        viewOrder.items.forEach((item, index) => {
                            if (index % 2 === 1) {
                                doc.setFillColor(248, 248, 248);
                                doc.rect(20, yPosition - 5, 170, 10, 'F');
                            }

                            doc.text(item.name ? item.name.substring(0, 25) : 'N/A', 25, yPosition);
                            doc.text(item.sku || 'N/A', 75, yPosition);
                            doc.text(item.quantity ? item.quantity.toString() : 'N/A', 115, yPosition);
                            doc.text(item.price ? `$${item.price}`: 'N/A', 135, yPosition);
                            doc.text(item.total_amount ? `$${item.total_amount}` : 'N/A', 165, yPosition);
                            yPosition += 10;
                        });
                    } else {
                        doc.text('No items found', 25, yPosition);
                    }

                    doc.setDrawColor(200, 200, 200);
                    doc.line(20, yPosition + 5, 190, yPosition + 5);

                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                    doc.text('Total Amount:', 115, yPosition + 20);
                    doc.text(`$${viewOrder.order.total_amount || 'N/A'}`, 165, yPosition + 20);

                    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                    doc.rect(0, 280, 210, 17, 'F');
                    doc.setFont("helvetica", "italic");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(10);
                    doc.text('Thank you for your business!', 105, 290, { align: 'center' });
                }
            } catch (error) {
                console.error("PDF generation error:", error);
                reject(error);
            }
        }),
        {
            loading: "Generating invoice...",
            success: "Invoice has been generated successfully.",
            error: "Failed to generate invoice.",
        }
    );
};