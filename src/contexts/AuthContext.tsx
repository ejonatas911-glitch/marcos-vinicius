import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout to prevent stuck loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Auth initialization timed out");
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          try {
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              setUserProfile(userDoc.data());
            } else {
              // Create initial profile if it doesn't exist
              const initialProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Aluno',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              };
              try {
                await setDoc(userDocRef, initialProfile);
                setUserProfile(initialProfile);
              } catch (err) {
                console.error("Profile creation error:", err);
                // Don't throw here to avoid blocking app loading
                setUserProfile(initialProfile);
              }
            }
          } catch (err) {
            console.error("Profile fetch error:", err);
          }
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    }, (error) => {
      console.error("onAuthStateChanged error:", error);
      setLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const signOut = () => auth.signOut();

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
