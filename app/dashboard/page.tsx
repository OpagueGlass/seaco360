"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Download, Loader2, ShieldX } from "lucide-react";
import { useState } from "react";
import CSVFileView from "./file-view";
import ParseArea from "./csv-parse";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import Link from "next/link";
import { SummaryData } from "@/lib/summarise";

export interface CSVFile {
  name: string;
  size: number;
  rows: number;
  columns: number;
  headers: string[];
  preview: string[][];
  summary: SummaryData;
}

export interface UploadStatus {
  type: "success" | "error" | null;
  message: string;
}

function downloadTemplate() {
  const csvContent = "enddate,id,status,area_name,mukim,house_id,age,agecat,sex,mcio,edu,employstatus,income,heartdis,asthma,stroke,arthritis,kidneydis,dialysis,dengue,denpastyear,uti,eversmoke,smoker,inadequate_fruits,inadequate_veg,bmi,bmicat_who,centralob,hypertension_1,hypertension_2,hypertension_3,hypertension_4,hypertension_5,hypertension_6,hpt_screened,hpt_diagnosed,hpt_measured,hpt_population,hpt_treated,sbp,dbp,bp_complete,diabetes_1,diabetes_2,diabetes_3,diabetes_4,diabetes_5,diabetes_6,diabetes_7,dm_screened,dm_diagnosed,dm_measured,dm_population,dm_treated,bg_complete,bg_4,dom1,dom2,dom3,dom4,overall\n";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", "template.csv");
  link.click();
}

export default function DashboardPage() {
  const { session, authState } = useAuth();
  const [currentFile, setCurrentFile] = useState<CSVFile | null>(null);
  const [uploadStatus, _setUploadStatus] = useState<UploadStatus>({ type: null, message: "" });

  // Helper to set upload status and clears after 3s
  const setUploadStatus = (status: UploadStatus) => {
    _setUploadStatus(status);
    if (status.type) {
      setTimeout(() => _setUploadStatus({ type: null, message: "" }), 3000);
    }
  };

  if (authState.isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Empty>
          <EmptyMedia>
            <Loader2 className="size-12 text-primary animate-spin" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Loading</EmptyTitle>
            <EmptyDescription>Please wait while we verify your access...</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex justify-center gap-1">
              <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="size-2 bg-primary/60 rounded-full animate-bounce" />
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Empty>
          <EmptyMedia variant="icon" className="size-16 bg-destructive/10">
            <ShieldX className="size-8 text-destructive" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Access Denied</EmptyTitle>
            <EmptyDescription>
              You don&apos;t have permission to view this page. Please sign in to continue.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col sm:flex-row gap-2 justify-center w-full">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }


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
