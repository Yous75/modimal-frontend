function FilterAccordion({ title, isOpen, onToggle, children }) {
  return (
    <div className="filter-accordion">
      <button
        type="button"
        className="filter-accordion__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="filter-accordion__icon" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && <div className="filter-accordion__panel">{children}</div>}
    </div>
  );
}

export default FilterAccordion;