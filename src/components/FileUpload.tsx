/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import Button from "@mui/material/Button";

interface FileUploadProps {
  title: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onSelect: (selection: File[]) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  title,
  accept,
  multiple,
  disabled,
  onSelect,
  className,
}) => {
  const fileInput = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files.length) {
      const files: File[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        files.push(e.target.files[i]);
      }
      onSelect(files);
    }
  };

  const handleButtonClick = () => {
    if (fileInput.current !== null) {
      fileInput.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        ref={fileInput}
        hidden
        onChange={handleFileChange}
        disabled={disabled}
      />
      <Button
        onClick={handleButtonClick}
        disabled={disabled}
        className={className}
        variant="outlined"
        size="small"
      >
        {title}
      </Button>
    </>
  );
};
