import React, { useMemo, useState } from "react";

/**
 * Social share modal with FB/Twitter deep-links and IG fallback (copy-to-clipboard).
 * Meets Sprint 3 HU#27 (image, brief description, direct link, custom message).
 */
export default function ShareModal({ open, onClose, data }) {
  const [message, setMessage] = useState("");
  const share = useMemo(() => normalize(data), [data]);
  if (!open) return null;

  function shareTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${message || share.text} ${share.url}`
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }
  function shareFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      share.url
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }
  async function shareInstagram() {
    await navigator.clipboard.writeText(`${message || share.text} ${share.url}`);
    alert("Copied to clipboard. Open Instagram to paste your message.");
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="box">
        <header>
          <h3>Share this product</h3>
          <button onClick={onClose} aria-label="Close">✕</button>
        </header>
        <article>
          {share.image && <img className="thumb" src={share.image} alt="Share preview" />}
          <div className="meta">
            <h4>{share.title}</h4>
            <p>{share.text}</p>
            <small>{share.url}</small>
          </div>
          <label>
            Custom message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message"
            />
          </label>
        </article>
        <footer>
          <button onClick={shareFacebook}>Share on Facebook</button>
          <button onClick={shareTwitter}>Share on Twitter</button>
          <button onClick={shareInstagram}>Share on Instagram</button>
        </footer>
      </div>

      <style>
        {`
        .modal{ position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; padding:1rem; z-index:1000; }
        .box{ background:#fff; width:min(720px, 100%); border-radius:10px; overflow:hidden; display:grid; grid-template-rows:auto 1fr auto; }
        header{ display:flex; align-items:center; justify-content:space-between; padding:1rem; border-bottom:1px solid #eee; }
        article{ display:grid; gap:1rem; padding:1rem; grid-template-columns: 160px 1fr; }
        .thumb{ width:160px; height:120px; object-fit:cover; border-radius:8px; }
        .meta h4{ margin:.25rem 0; }
        textarea{ width:100%; min-height:80px; }
        footer{ display:flex; gap:.75rem; justify-content:flex-end; padding:1rem; border-top:1px solid #eee; }
        @media (max-width:800px){
          article{ grid-template-columns: 1fr; }
          .thumb{ width:100%; height:180px; }
        }
      `}
      </style>
    </div>
  );
}

function normalize(data) {
  const d = data || {};
  return {
    title: d.title || "Product",
    text: d.description || "Check this product",
    url: d.url || window.location.href,
    image: d.imageUrl || d.image,
  };
}
