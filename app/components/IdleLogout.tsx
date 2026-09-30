"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const IDLE_TIMEOUT = 3 * 60 * 1000;
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "click",
] as const;

export default function IdleLogout() {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSessionRef = useRef(false);
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const clearIdleTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const resetIdleTimeout = () => {
      if (!hasSessionRef.current || isLoggingOutRef.current) {
        return;
      }

      clearIdleTimeout();
      timeoutRef.current = setTimeout(async () => {
        isLoggingOutRef.current = true;
        hasSessionRef.current = false;

        const { error } = await supabase.auth.signOut();

        if (error) {
          console.error("Automatic logout failed:", error);
          isLoggingOutRef.current = false;
          hasSessionRef.current = true;
          resetIdleTimeout();
          return;
        }

        if (isMounted) {
          router.replace("/register");
        }
      }, IDLE_TIMEOUT);
    };

    const handleActivity = () => resetIdleTimeout();
    const handleAuthChange = (_event: string, session: unknown) => {
      hasSessionRef.current = Boolean(session);
      isLoggingOutRef.current = false;

      if (hasSessionRef.current) {
        resetIdleTimeout();
      } else {
        clearIdleTimeout();
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) {
        return;
      }

      hasSessionRef.current = Boolean(session);
      resetIdleTimeout();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity);
    });

    return () => {
      isMounted = false;
      clearIdleTimeout();
      subscription.unsubscribe();
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
    };
  }, [router]);

  return null;
}