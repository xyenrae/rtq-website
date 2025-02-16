// src/components/form/data/santri/SantriForm.tsx
"use client";
import React from "react";
import { useSantriForm } from "./useSantriForm";
import SantriFormFields from "./SantriFormFields";
import ProgressModal from "@/components/ui/ProgressModal";

export default function SantriForm() {
  const {
    isProcessing,
    processingStep,
    processingProgress,
    isEditMode,
    setIsEditMode,
    hasData,
    progress,
    santriData,
    setSantriData,
    handleSubmit,
    handleUpdate,
    enterEditMode,
    cancelEditMode,
  } = useSantriForm();

  return (
    <>
      <form onSubmit={handleSubmit} className="relative">
        <SantriFormFields
          santriData={santriData}
          setSantriData={setSantriData}
          hasData={hasData}
          isEditMode={isEditMode}
          progress={progress}
          setIsEditMode={setIsEditMode}
          handleUpdate={handleUpdate}
          enterEditMode={enterEditMode}
          cancelEditMode={cancelEditMode}
        />
      </form>
      <ProgressModal
        isOpen={isProcessing}
        progress={processingProgress}
        status={isEditMode ? "update" : "submit"}
        currentStep={processingStep}
      />
    </>
  );
}
