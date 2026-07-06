// client/src/app/test-global-error/page.jsx
'use client';

import { useEffect } from 'react';

export default function TestGlobalError() {
  useEffect(() => {
    // ❌ ইচ্ছাকৃতভাবে Global Error Throw করুন
    throw new Error('This is a global error test!');
  }, []);

  return <div>This will not render</div>;
}