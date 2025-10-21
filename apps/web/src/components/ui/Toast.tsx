'use client';

// Temporary Toast Stub (so build doesn't fail)
export const toast = {
  message: (msg: string) => console.log('ℹ️', msg),
  success: (msg: string) => console.log('✅', msg),
  error:   (msg: string) => console.log('❌', msg),
};

export default toast;

