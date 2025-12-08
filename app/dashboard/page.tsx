"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Download } from "lucide-react";
import { useState } from "react";
import CSVFileView from "./file-view";
import ParseArea from "./csv-parse";
import { Button } from "@/components/ui/button";

export interface CSVFile {
  name: string;
  size: number;
  rows: number;
  columns: number;
  headers: string[];
  data: string[][];
  uploadedAt: Date;
}

export interface UploadStatus {
  type: "success" | "error" | null;
  message: string;
}

function downloadTemplate() {
  const csvContent = "Name,Age,Email\nJohn Doe,30,john.doe@example.com";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", "template.csv");
  link.click();
}

export default function DashboardPage() {
  const [currentFile, setCurrentFile] = useState<CSVFile | null>(null);
  const [uploadStatus, _setUploadStatus] = useState<UploadStatus>({ type: null, message: "" });

  // Helper to set upload status and clears after 3s
  const setUploadStatus = (status: UploadStatus) => {
    _setUploadStatus(status);
    if (status.type) {
      setTimeout(() => _setUploadStatus({ type: null, message: "" }), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Upload and manage your CSV data files</p>
          </div>
          <Button size="lg" onClick={downloadTemplate} className="w-full sm:w-auto">
            <Download className="size-5 mr-2" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Alert Popup */}
      {uploadStatus.type && (
        <div className="fixed left-1/2 top-12 -translate-x-1/2 z-50 w-[90vw] max-w-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <Alert
            variant={uploadStatus.type === "error" ? "destructive" : "default"}
            className={`shadow-lg backdrop-blur-md ${
              uploadStatus.type === "success"
                ? "border-green-500/70 bg-green-500/10 text-green-600 dark:text-green-100"
                : ""
            }`}
          >
            {uploadStatus.type === "success" ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
            <AlertDescription>{uploadStatus.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {!currentFile ? (
        <ParseArea setCurrentFile={setCurrentFile} setUploadStatus={setUploadStatus} />
      ) : (
        <CSVFileView currentFile={currentFile} setCurrentFile={setCurrentFile} setUploadStatus={setUploadStatus} />
      )}
    </div>
  );
}
