import "./Landing.css";

export function Landing() {
  return (
    <div className="px-20 bg-blue Landing object-center">
      <img className="h-6 text-white alata" src="" alt="" />
      <div className="alata text-left text-4xl text-white landing-header">
      S.I.G.H.T.E.D.

      </div>
      <div className="alata text-left text-base text-white text-opacity-60 landing-description">
      Secure Information Guarding Healthcare Through Encrypted Data.
      </div>
      <img alt="" src="/healthcare-professionals.svg" />
    </div>
  );
}
export default Landing;
