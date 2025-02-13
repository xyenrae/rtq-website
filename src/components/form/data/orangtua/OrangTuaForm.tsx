// src/components/form/data/orangtua/OrangTuaForm.tsx
"use client";
import React from "react";
import { useOrangTuaForm } from "./useOrangTuaForm";
import OrangTuaFormFields from "./OrangTuaFormFields";

export default function OrangTuaForm() {
  const {
    isEditMode,
    setIsEditMode,
    hasData,
    progress,
    orangTuaData,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleUpdate,
  } = useOrangTuaForm();

  return (
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
      />
    </form>
  );
}
