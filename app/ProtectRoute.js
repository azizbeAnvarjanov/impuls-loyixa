"use client"
// components/ProtectRoute.js
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';



const ProtectRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <p>Yuklanmoqda...</p>;

  return children;
};

export default ProtectRoute;
