// src/components/form/data/orangtua/OrangTuaForm.tsx
"use client";
import React from "react";
import { useOrangTuaForm } from "./useOrangTuaForm";
import OrangTuaFormFields from "./OrangTuaFormFields";
import ProgressModal from "@/components/ui/ProgressModal";

export default function OrangTuaForm() {
  const {
    isProcessing,
    processingStep,
    processingProgress,
    isEditMode,
    setIsEditMode,
    hasData,
    progress,
    orangTuaData,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleUpdate,
    enterEditMode,
    cancelEditMode,
  } = useOrangTuaForm();

  return (
    <>
      <form onSubmit={handleSubmit}>
        <OrangTuaFormFields
          orangTuaData={orangTuaData}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
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
