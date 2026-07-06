// client/src/app/test-error/page.jsx
'use client';

export default function TestErrorPage() {
  // ❌ ইচ্ছাকৃতভাবে Error Throw করুন
  throw new Error('This is a test error page!');
  return <div>This will not render</div>;
}