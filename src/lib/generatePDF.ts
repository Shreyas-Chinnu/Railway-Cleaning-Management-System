import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { saveAs } from "file-saver";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePDF = (tasks: any[]) => {
  const docDefinition = {
    content: [
      { text: "Task Report", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: ["25%", "30%", "15%", "30%"],
          body: [
            ["Title", "Description", "Status", "Assigned To"],
            ...tasks.map((task) => [task.title, task.description, task.status, task.assignedTo?.name || "N/A"]),
          ],
        },
      },
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
    },
  };

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBlob((blob) => {
    saveAs(blob, "Task_Report.pdf");
  });
};
