import Card from "./Card";

const Events = ({ related_event }) => {
  return (
    <section className="eventnear-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading mb-3">
              <span> Related Events </span>{" "}
            </div>
          </div>
          <div className="col-lg-4">
            {/* <div id="eventnear-slider"> */}
            <Card cardData={related_event} />
            {/* </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
