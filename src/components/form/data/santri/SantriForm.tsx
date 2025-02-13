// src/components/form/data/santri/SantriForm.tsx
"use client";
import React from "react";
import { useSantriForm } from "./useSantriForm";
import SantriFormFields from "./SantriFormFields";

export default function SantriForm() {
  const {
    isEditMode,
    setIsEditMode,
    hasData,
    progress,
    santriData,
    setSantriData,
    handleSubmit,
    handleUpdate,
  } = useSantriForm();

  return (
    <form onSubmit={handleSubmit} className="relative">
      <SantriFormFields
        santriData={santriData}
        setSantriData={setSantriData}
        hasData={hasData}
        isEditMode={isEditMode}
        progress={progress}
        setIsEditMode={setIsEditMode}
        handleUpdate={handleUpdate}
      />
    </form>
  );
}
