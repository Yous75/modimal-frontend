
import Collectioncard from '../utils/collectioncard/Collectioncard';
import './Collection.css';
import blousesImg from '../../assets/colblouses.jpg';
import pantsImg from '../../assets/colpants.jpg';
import dressesImg from '../../assets/coldresses.jpg';
import outwearImg from '../../assets/coloutwear.jpg';
import { Link } from "react-router-dom";

// Data for each collection category
const collectionData = [
  {
    id: 1,
    key: 'blouses',
    title: 'Blouses',
    image: blousesImg,
    alt: 'Close-up of a model wearing a white V-neck blouse with a delicate gold necklace',
  },
  {
    id: 2,
    key: 'pants',
    title: 'Pants',
    image: pantsImg,
    alt: 'Model in a white blouse and tailored olive trousers standing beside a bookshelf',
  },
  {
    id: 3,
    key: 'dresses',
    title: 'Dresses',
    image: dressesImg,
    alt: 'Model reclining in a leather lounge chair wearing an olive satin dress',
  },
  {
    id: 4,
    key: 'outwear',
    title: 'Outwear',
    image: outwearImg,
    alt: 'Close-up of the collar and lapel of a camel wool coat',
  },
];

// Finds a collection item by its key
const getItem = (key) =>
  collectionData.find((item) => item.key === key);

// Component that displays the Collection section
const Collection = () => {
  return (
    <section className="collection">

      {/* Section title */}
      <h2 className="collection__title">Collection</h2>

      {/* Two-column layout for the collection cards */}
      <div className="collection__grid">

        {/* First column */}
        <div className="collection__col">
          <Collectioncard
            {...getItem('blouses')}
            customClass="collectioncard--blouses"
            to="/collection/blouses-tops"
          />

          <Collectioncard
            {...getItem('dresses')}
            customClass="collectioncard--dresses"
            to="/collection/dresses-jumpsuits"
          />
        </div>

        {/* Second column */}
        <div className="collection__col">
          <Collectioncard
            {...getItem('pants')}
            customClass="collectioncard--pants"
            to="/collection/pants"
          />


          <Collectioncard
             {...getItem('outwear')}
             customClass="collectioncard--outwear"
             to="/collection/outerwear-jackets"
          />
        </div>

      </div>
    </section>
  );
};

export default Collection;

