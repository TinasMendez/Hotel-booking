// /frontend/src/components/PolicyBlock.jsx
/**
 * Policy block that renders an array of sections, each with a title, optional summary and bullet list.
 */
export default function PolicyBlock({ sections = [] }) {
  if (!Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {sections.map((section) => (
        <article
          key={section.id || section.title}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            {section.summary ? (
              <p className="text-sm text-slate-600">{section.summary}</p>
            ) : null}
          </div>

          {Array.isArray(section.items) && section.items.length > 0 ? (
            <ul className="space-y-2 text-sm text-slate-700">
              {section.items.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}
