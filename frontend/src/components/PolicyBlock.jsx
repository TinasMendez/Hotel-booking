import React from "react";

/**
 * Renders only the policy cards grid inside a centered container.
 * This component deliberately avoids rendering the page header
 * (title/subtitle) and the assistance block to prevent duplication
 * when the page already provides them.
 * The `sections` prop drives the 3 columns (or 1 column on small screens).
 */
export default function PolicyBlock({ sections = [] }) {
  return (
    <section className="policies-grid" aria-label="Policies">
      <div className="container">
        <div className="cards">
          {sections.map((s, i) => (
            <article key={i} className="card">
              <h3 className="card-title">{s.title}</h3>
              <ul className="card-list">
                {(s.items || []).map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <style>
        {`
        .policies-grid{
          background:#f7f8fb;
        }
        .container{
          max-width:1140px;
          margin:0 auto;
          padding: 0 1.25rem 2rem; /* side padding + bottom spacing */
        }
        .cards{
          display:grid;
          gap: 1rem;
          grid-template-columns: repeat(3, minmax(0,1fr));
          margin-top: 1rem;
        }
        .card{
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:1rem 1rem 1.1rem;
          box-shadow: 0 1px 2px rgba(16,24,40,.04);
        }
        .card-title{
          margin:.1rem 0 .6rem;
          font-size:1.05rem;
          color:#111827;
        }
        .card-list{
          margin:0;
          padding-left:1rem; /* bullet indent */
          color:#374151;
        }
        .card-list li{
          margin:.35rem 0;
        }
        @media (max-width: 1024px){
          .cards{
            grid-template-columns: 1fr;
          }
        }
      `}
      </style>
    </section>
  );
}
