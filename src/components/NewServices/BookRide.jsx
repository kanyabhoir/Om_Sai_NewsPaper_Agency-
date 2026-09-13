import "./BookRide.css";
const BookRide = () => {
  return (
    <div className="container">
      <section className="hero-section">
        <h1>Introducing Our New Car Transport Service!</h1>
        <p>Comfortable, Reliable, and Affordable Passenger Transport.</p>
        <h3>Book a Ride!</h3>
      </section>

      <section className="features-section">
        <FeatureCard
          title="Comfortable Rides"
          description="Enjoy spacious and well-maintained cars for a smooth journey."
        />
        <FeatureCard
          title="Affordable Pricing"
          description="Competitive rates to get you where you need to go without breaking the bank."
        />
        <FeatureCard
          title="Flexible Routes"
          description="Customized pick-up and drop-off points based on your needs."
        />
      </section>

      <section className="call-to-action">
        <h2>Ready to book your ride?</h2>
        <button onClick={() => (window.location.href = "tel:+7262889526")}>
          Contact Us
        </button>
        <div className="car-background"></div>
      </section>
    </div>
  );
};
function FeatureCard({ title, description }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default BookRide;
