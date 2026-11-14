import { Link } from 'react-router-dom'
import './PageHero.css'

/**
 * Shared hero for inner pages. `title` may contain <em> for the italic accent.
 * `crumbs` is [{ label, to? }] — the last item is the current page.
 */
export default function PageHero({ eyebrow, title, sub, image, crumbs = [], tall = false, children }) {
  return (
    <section className={`phero${tall ? ' phero--tall' : ''}`} data-nav="dark">
      {image ? (
        <div className="phero__bg media" data-parallax="9">
          <div className="px" style={{ backgroundImage: `url(${image})` }} />
        </div>
      ) : null}
      <div className="phero__shade" />
      <div className="wrap phero__inner">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="breadcrumb__item">
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
              {i < crumbs.length - 1 ? <span aria-hidden>/</span> : null}
            </span>
          ))}
        </nav>
        {eyebrow ? <p className="eyebrow eyebrow--light" data-fade data-intro>{eyebrow}</p> : null}
        <h1 className="d-l phero__title" data-split data-intro>{title}</h1>
        {sub ? <p className="lead phero__sub" data-fade data-intro data-delay="0.25">{sub}</p> : null}
        {children ? <div className="phero__actions" data-fade data-intro data-delay="0.35">{children}</div> : null}
      </div>
    </section>
  )
}
