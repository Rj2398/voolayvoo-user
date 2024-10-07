import CustomCarousel from "@/components/Carousel";
import Card from "./Card";

const Voopons = ({ listData }) => {
  return (
    <>
      <section className="related-voopons mt-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading mb-3">
                <span> Related Voopons</span>{" "}
              </div>
            </div>
            <div className="col-lg-12">
              <CustomCarousel
                itemsPerPage={4}
                itemsList={listData}
                RenderComponent={Card}
              />

              {/* <div id="voopons-slider" className="owl-carousel">
                {Array.isArray(listData) &&
                  listData?.length > 0 &&
                  listData.map((event) => (
                    <Card key={event?.id} cardData={event} />
                  ))}
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Voopons;
