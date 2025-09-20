// /frontend/src/components/ShareButtons.jsx
import React, { useState } from "react";
import ShareModal from "./ShareModal.jsx";
import { useToast } from "../shared/ToastProvider.jsx";
import { useIntl } from "react-intl";

export default function ShareButtons({ title, className = "" }) {
  const toast = useToast();
  const { formatMessage } = useIntl();
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({ url: "", title: "" });

  async function handleShare() {
    const url = window.location.href;
    const shareTitle = title ?? document.title;
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url });
      } catch {
        // user cancelled
      }
      return;
    }
    setData({ url, title: shareTitle });
    setModalOpen(true);
  }

  async function handleCopy(textToCopy) {
    const value = textToCopy ?? data.url;
    try {
      await navigator.clipboard.writeText(value);
      toast?.success(formatMessage({ id: "modal.share.success" }));
    } catch (error) {
      toast?.error(formatMessage({ id: "modal.share.error" }));
      console.error("Clipboard copy failed", error);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        className={`rounded-2xl px-4 py-2 border bg-white text-blue-600 border-blue-600 hover:bg-blue-50 ${className}`}
        title={formatMessage({ id: "modal.share.title" })}
      >
        {formatMessage({ id: "modal.share.title" })}
      </button>
      <ShareModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        shareUrl={data.url}
        title={data.title}
        onCopy={handleCopy}
      />
    </>
  );
}
