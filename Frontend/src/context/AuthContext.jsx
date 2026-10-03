import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, authReady, db } from "../firebase/config";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      return { user: null, role: null };
    }

    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    const data = userDoc.exists() ? userDoc.data() : null;
    return { user: firebaseUser, role: data?.role ?? null };
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        const profile = await loadUserProfile(firebaseUser);
        setUser(profile.user);
        setRole(profile.role);
      } catch {
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    await authReady;
    const credential = await signInWithEmailAndPassword(auth, email, password);
    let profile;

    try {
      profile = await loadUserProfile(credential.user);
    } catch (error) {
      await signOut(auth);
      setUser(null);
      setRole(null);
      throw error;
    }

    if (profile.role !== "admin") {
      await signOut(auth);
      setUser(null);
      setRole(null);
      throw new Error("This account does not have admin access.");
    }

    setUser(profile.user);
    setRole(profile.role);
    setLoading(false);
    return credential;
  };
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

