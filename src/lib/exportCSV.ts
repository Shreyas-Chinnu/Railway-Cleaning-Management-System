import Papa from "papaparse";
import { saveAs } from "file-saver";

export const exportCSV = (tasks: any[]) => {
  const csv = Papa.unparse(
    tasks.map((task) => ({
      Title: task.title,
      Description: task.description,
      Status: task.status,
      AssignedTo: task.assignedTo?.name || "N/A",
    }))
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "Task_Report.csv");
};
