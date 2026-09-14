import "./Hero.css";
import { useNavigate } from "react-router-dom";


function Hero (){
    const navigate = useNavigate();

    return(
       <section className="hero">
        <div className="hero-container">
        <h2>Elegance in simplicity, Earth’s harmony</h2>
        <button onClick={() => navigate("/new-in")}>New In</button>
        </div>

       </section>
    );
}
export default Hero;