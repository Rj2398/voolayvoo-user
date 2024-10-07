import Events from "./events";
import Voopons from "./voopons";
import Reviews from "./reviews";
import Photos from "./photos";

const Tabs = ({ tabs, promoterId }) => {
  return (
    <>
      <section className="tab-section">
        <div className="container-fluid m-0 p-0">
          <div className="row">
            <div className="col-lg-12">
              <ul
                className="nav nav-tabs justify-content-center tab-style"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="events-tab"
                    data-toggle="tab"
                    data-target="#events"
                    type="button"
                    role="tab"
                    aria-controls="events"
                    aria-selected="true"
                  >
                    Events
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="voopons-tab"
                    data-toggle="tab"
                    data-target="#voopons"
                    type="button"
                    role="tab"
                    aria-controls="voopons"
                    aria-selected="false"
                  >
                    Voopons
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="reviews-tab"
                    data-toggle="tab"
                    data-target="#reviews"
                    type="button"
                    role="tab"
                    aria-controls="reviews"
                    aria-selected="false"
                  >
                    Reviews
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="photos-tab"
                    data-toggle="tab"
                    data-target="#photos"
                    type="button"
                    role="tab"
                    aria-controls="photos"
                    aria-selected="false"
                  >
                    Photos
                  </button>
                </li>
              </ul>

              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="tab-content" id="myTabContent">
                      <Events dataList={tabs.events} />
                      <Voopons dataList={tabs.voopans} />
                      <Reviews
                        ratingData={tabs?.ratingData}
                        promoterId={promoterId}
                      />
                      {/* <Reviews promoterId={promoterId} /> */}
                      <Photos dataList={tabs.photos} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tabs;
