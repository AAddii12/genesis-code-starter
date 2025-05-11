
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types";

export const useUserProfile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load user profile from session storage
    const storedProfile = sessionStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      // If no profile, redirect to onboarding
      navigate("/onboarding");
    }
  }, [navigate]);

  return { userProfile };
};
