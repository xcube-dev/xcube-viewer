/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2022 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from "react";
import Button from '@material-ui/core/Button';


interface FileUploadProps {
    title: string;
    accept?: string;
    onFileSelect: (file: File) => any;
}

export const FileUpload: React.FC<FileUploadProps> = (
    {
        title,
        accept,
        onFileSelect,
    }
) => {
    const fileInput = React.useRef<HTMLInputElement | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null && e.target.files.length) {
            onFileSelect(e.target.files[0]);
        }
    }

    const handleButtonClick = () => {
        if (fileInput.current !== null) {
            fileInput.current.click();
        }
    }

    return (
        <>
            <input
                type="file"
                accept={accept}
                ref={fileInput}
                hidden
                onChange={handleFileChange}
            />
            <Button onClick={handleButtonClick}>
                {title}
            </Button>
        </>
    );
}