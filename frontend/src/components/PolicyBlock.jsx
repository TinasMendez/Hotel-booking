// /frontend/src/components/PolicyBlock.jsx
/** Simple policy block showing house rules, health & safety, and cancellation policy. */
export default function PolicyBlock({ policies }) {
  // `policies` is an object: { rules: string[], health: string[], cancellation: string[] }
    if (!policies) return null;

    const Section = ({ title, items }) => (
        <div className="border rounded-2xl p-5">
        <h4 className="text-lg font-semibold mb-3">{title}</h4>
        <ul className="list-disc pl-6 space-y-1 text-sm">
            {items?.map((it, idx) => <li key={idx}>{it}</li>)}
        </ul>
        </div>
    );

    return (
        <section className="grid md:grid-cols-3 gap-4">
        <Section title="House rules" items={policies.rules} />
        <Section title="Health & safety" items={policies.health} />
        <Section title="Cancellation policy" items={policies.cancellation} />
        </section>
    );
}
