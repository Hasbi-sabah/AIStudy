import { fileFromPath } from "openai";
import { ChangeEvent, ChangeEventHandler } from "react";
interface UploadProps {
  fileName: string;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function Upload({ handleFileChange, fileName }: UploadProps) {
  return (
    <>
      <div className="dark flex flex-col items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-[50%] h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-[#212268] hover:bg-gray-100 dark:border-[#1f4770] dark:hover:border-[#1d456c] dark:hover:bg-[#474883]">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
            TXT, PDF, or Word Documents
            </p>
          </div>
          <input
            id="dropzone-file"
            className="hidden"
            type="file"
            onChange={handleFileChange}
            accept="text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </label>
        {fileName && <h1 className="pt-5">Uploaded File: {fileName}</h1>}
      </div>
    </>
  );
}
