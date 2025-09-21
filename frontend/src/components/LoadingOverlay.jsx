// src/components/LoadingOverlay.jsx
import React from "react";
import Spinner from "./Spinner";

/**
 * Semi-transparent overlay with a centered spinner.
 * - Wrap a relatively positioned container and render this overlay conditionally.
 */
export default function LoadingOverlay({ show = false, label = "Loading..." }) {
    if (!show) return null;
    return (
        <div
        className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px]"
        role="status"
        aria-live="polite"
        aria-busy="true"
        >
        <div className="rounded-xl bg-white/90 px-4 py-3 shadow-md">
            <Spinner label={label} size="md" />
        </div>
        </div>
    );
    }
