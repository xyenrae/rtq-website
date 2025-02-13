// src/components/form/data/alamat/AlamatForm.tsx
"use client";
import React from "react";
import { useAlamatForm } from "./useAlamatForm";
import AlamatFormFields from "./AlamatFormFields";

export default function AlamatForm() {
  const {
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
  } = useAlamatForm();

  return (
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
      />
    </form>
  );
}
