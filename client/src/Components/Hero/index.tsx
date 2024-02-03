import "./Hero.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";

const Index = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    state.isAuthenticated
      ? navigate(`/edit-profile/${state?.creator_username}`)
      : navigate(`/signUp`);
  };

  return (
    <section className='hero'>
      <h2>
        Your fan's <span>wish links</span> and your <span>wishlist </span>
        all in one place.
      </h2>
      <p>
        Stop confusing your fans, make it easier for them to support you! Create
        a wishlist and link in bio in one hub {"  "}
        <span> All for free.</span>
      </p>
      <div className='emailDiv'>
        <button onClick={handleGetStarted}>Get Started</button>
      </div>
    </section>
  );
};

export default Index;
