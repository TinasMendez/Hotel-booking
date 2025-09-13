// /frontend/src/components/ShareButtons.jsx
/** Share buttons using the Web Share API when available, otherwise copying the URL. */
export default function ShareButtons({ title, className = "" }) {
    async function share() {
        const url = window.location.href;
        try {
        if (navigator.share) {
            await navigator.share({ title: title ?? document.title, url });
        } else {
            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
        } catch {
        // user cancelled
        }
    }

    return (
        <button
        onClick={share}
        className={`rounded-2xl px-4 py-2 border bg-white text-blue-600 border-blue-600 ${className}`}
        title="Share this property"
        >
        Share
        </button>
    );
}
