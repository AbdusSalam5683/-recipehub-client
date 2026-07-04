// client/src/hooks/useAuth.js
'use client';

import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  return context;
};