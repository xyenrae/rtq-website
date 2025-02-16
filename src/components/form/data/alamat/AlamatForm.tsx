// src/components/form/data/alamat/AlamatForm.tsx
"use client";
import React from "react";
import { useAlamatForm } from "./useAlamatForm";
import AlamatFormFields from "./AlamatFormFields";
import ProgressModal from "@/components/ui/ProgressModal";

export default function AlamatForm() {
  const {
    isProcessing,
    processingStep,
    processingProgress,
    isEditMode,
    setIsEditMode,
    hasData,
    progress,
    alamatData,
    handleInputChange,
    handleCheckboxChange,
    handleIbuSamaDenganAyah,
    handleSubmit,
    handleUpdate,
    enterEditMode,
    cancelEditMode,
  } = useAlamatForm();

  return (
    <>
      <form onSubmit={handleSubmit}>
        <AlamatFormFields
          alamatData={alamatData}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
          handleIbuSamaDenganAyah={handleIbuSamaDenganAyah}
          hasData={hasData}
          isEditMode={isEditMode}
          progress={progress}
          setIsEditMode={setIsEditMode}
          handleUpdate={handleUpdate}
          enterEditMode={enterEditMode}
          cancelEditMode={cancelEditMode}
        />
        <ProgressModal
          isOpen={isProcessing}
          progress={processingProgress}
          status={isEditMode ? "update" : "submit"}
          currentStep={processingStep}
        />
      </form>
    </>
  );
}
