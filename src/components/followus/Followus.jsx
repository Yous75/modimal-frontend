import React from "react";
import "./Followus.css";
import firstImg from '../../assets/firstimg.jpg';
import secondImg from '../../assets/secondimg.jpg';
import thirdImg from '../../assets/thirdimg.jpg';
import fourthImg from '../../assets/fourthimg.jpg';
import fifthImg from '../../assets/fifthimg.jpg';
const images = [
  {
    id: 1,
    src: firstImg,
    alt: "Woman in modern office wear, black t-shirt and white split skirt",
    className: "followus-img followus-img--featured",
  },
  {
    id: 2,
    src: secondImg,
    alt: "Woman riding a bicycle in smart casual attire",
    className: "followus-img followus-img--top-mid",
  },
  {
    id: 3,
    src: fourthImg,
    alt: "Close-up of a black blazer jacket",
    className: "followus-img followus-img--top-right",
  },
  {
    id: 4,
    src: thirdImg,
    alt: "Full-length portrait of a woman in a dark coat and light trousers",
    className: "followus-img followus-img--bottom-mid",
  },
  {
    id: 5,
    src: fifthImg,
    alt: "Side profile portrait of a woman outdoors in natural light",
    className: "followus-img followus-img--bottom-right",
  },
];

function Followus() {
  return (
    <section className="followus">
      <h2 className="followus__heading">Follow Us @Modimal</h2>

      <div className="followus__grid">
        {images.map((image) => (
          <div key={image.id} className={image.className}>
            <img src={image.src} alt={image.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Followus;