"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormView from "./form";
import TableView from "./table";
import { CSVFile, UploadStatus } from "./types";

function downloadTemplate() {
  const csvContent =
    "enddate,id,status,area_name,mukim,house_id,age,agecat,sex,mcio,edu,employstatus,income,heartdis,asthma,stroke,arthritis,kidneydis,dialysis,dengue,denpastyear,uti,eversmoke,smoker,inadequate_fruits,inadequate_veg,bmi,bmicat_who,centralob,hypertension_1,hypertension_2,hypertension_3,hypertension_4,hypertension_5,hypertension_6,hpt_screened,hpt_diagnosed,hpt_measured,hpt_population,hpt_treated,sbp,dbp,bp_complete,diabetes_1,diabetes_2,diabetes_3,diabetes_4,diabetes_5,diabetes_6,diabetes_7,dm_screened,dm_diagnosed,dm_measured,dm_population,dm_treated,bg_complete,bg_4,dom1,dom2,dom3,dom4,overall\n";
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

  const router = useRouter();

  // Helper to set upload status and clears after 3s
  const setUploadStatus = (status: UploadStatus) => {
    _setUploadStatus(status);
    if (status.type) {
      setTimeout(() => _setUploadStatus({ type: null, message: "" }), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-6xl">
      <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      {/* <div className="space-y-2">
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
      </div> */}

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
        <FormView setCurrentFile={setCurrentFile} setUploadStatus={setUploadStatus} />
      ) : (
        <TableView currentFile={currentFile} setCurrentFile={setCurrentFile} setUploadStatus={setUploadStatus} />
      )}
    </div>
  );
}
