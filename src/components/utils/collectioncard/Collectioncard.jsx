
import './Collectioncard.css';
import { Link } from 'react-router-dom';

// Reusable card component for displaying a collection
const Collectioncard = ({
  image,
  title,
  alt,
  customClass = '',
  to,
}) => {
  return (
    <div className={`collectioncard ${customClass}`}>

      {/* Makes the entire card clickable */}
      <Link to={to} className="collectioncard__link">

        <div className="collectioncard__frame">

          {/* Displays the collection image */}
          <img
            src={image}
            alt={alt || title}
            className="collectioncard__image"
            loading="lazy"
          />

          {/* Displays the title */}
          {title && (
            <span className="collectioncard__label">
              {title}
            </span>
          )}

        </div>

      </Link>

    </div>
  );
};

export default Collectioncard;

