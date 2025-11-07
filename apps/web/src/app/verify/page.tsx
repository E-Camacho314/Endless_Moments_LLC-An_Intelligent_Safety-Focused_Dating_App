'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a picture first.');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('file', file);

      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
      const response = await fetch(`${apiBase}/verification/submit`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        router.push('/verify/error?reason=Verification%20failed.%20Please%20try%20again.');
        return;
      }

      const data: { status?: string; reason?: string } = await response.json();
      console.log("✅ Verification API response:", data);

      if (data.status === 'verified') {
        router.push('/verify/success');
      } else {
        const reason = data.reason ? encodeURIComponent(data.reason) : encodeURIComponent('We could not verify this photo.');
        router.push(`/verify/error?reason=${reason}`);
      }
    } catch (error) {
      router.push('/verify/error?reason=Unexpected%20error.%20Please%20retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #0b0c2a, #1a1a4f, #3b2f7f)',
        color: '#fff',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 600 }}>
        Identity Verification
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          width: '90%',
          maxWidth: '400px',
        }}
      >
        <label
          htmlFor="file"
          style={{
            fontSize: '1rem',
            fontWeight: 500,
            marginBottom: '1rem',
            cursor: 'pointer',
          }}
        >
          Upload a Selfie or ID
        </label>

        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '1rem' }}
        />

        {image && (
          <img
            src={image}
            alt="Preview"
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '12px',
              objectFit: 'cover',
              marginBottom: '1rem',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          />
        )}

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: 'linear-gradient(90deg, #936d14, #ffffff)',
            color: '#290f5a',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
}