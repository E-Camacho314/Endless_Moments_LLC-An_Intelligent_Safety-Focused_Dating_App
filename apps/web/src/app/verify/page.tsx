"use client";
import { useState } from "react";

export default function VerificationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/verification/submit`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("✅ Verification placeholder submitted successfully!");
      } else {
        setStatus("⚠️ Failed to submit verification.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error while submitting verification.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Identity Verification</h1>
        <p className="text-gray-600 mb-6">
          Upload a selfie or ID to complete your profile verification.
        </p>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mx-auto mb-4 w-40 h-40 object-cover rounded-full border"
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Submit Verification
          </button>
        </form>

        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      </div>
    </div>
  );
}
