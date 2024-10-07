import { useState } from "react";

const CardList = ({
  cardList,
  setOpen,
  userCardDelete,
  isCardPaymentEnabled,
  callPaymentCard,
}) => {
  const [selectCard, setSelectCard] = useState("");
  const handleCardSelection = (id) => {
    setSelectCard(id);
  };
  const handlePayNow = (card) => {
    if (selectCard) {
      const selectCardData = cardList.find(
        (cardItem) => cardItem.card_id === selectCard
      );

      callPaymentCard(selectCardData);
    }
  };
  return (
    <>
      {cardList?.length > 0 && (
        <div
          className="business-add-payment-card-inner"
          style={{ marginTop: 0 }}
        >
          {cardList.map((card, indx) => (
            <div
              key={card?.card_id}
              className={`business-add-payment-card-box ${
                isCardPaymentEnabled && selectCard === card?.card_id
                  ? "active"
                  : ""
              }`}
              onClick={() => handleCardSelection(card?.card_id)}
            >
              {!isCardPaymentEnabled && (
                <button onClick={() => userCardDelete(card?.card_id)}>
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
              <div className="select-card"></div>
              <div className="business-add-payment-card-details">
                <p>Debit</p>
                <div className="business-add-payment-card-details-bottom">
                  <div className="business-add-payment-card-details-input-wrap">
                    <input
                      type="text"
                      className="input-1"
                      value={`**** **** **** ${card?.last4}`}
                      readOnly={true}
                    />
                    <span>
                      VALID <br /> THRU
                      <input
                        type="text"
                        className="input-2"
                        value={`${card?.exp_month}/${`${card?.exp_year}`.slice(
                          -2
                        )}`}
                        readOnly={true}
                      />
                    </span>
                  </div>
                  <h2>
                    {card?.cardholdername.toUpperCase()}{" "}
                    <img
                      src="/images/business-dashboard/payment-method/card-img.svg"
                      alt=""
                    />
                  </h2>
                </div>
              </div>
              <img
                src={
                  indx % 2 === 0
                    ? "/images/business-dashboard/payment-method/card-bg-1.svg"
                    : "/images/business-dashboard/payment-method/card-bg-2.svg"
                }
                alt=""
              />
            </div>
          ))}
        </div>
      )}
      {!isCardPaymentEnabled && (
        <div className="business-add-payment-card-btm">
          <a href="#" onClick={() => setOpen(true)}>
            Add Card
          </a>
        </div>
      )}
      {isCardPaymentEnabled && (
        <div className="business-add-payment-card-add-btn">
          <a href="#" onClick={() => setOpen(true)}>
            <i className="fas fa-plus-circle"></i> Add Card
          </a>
        </div>
      )}
      {isCardPaymentEnabled && (
        <div className="business-add-payment-card-btm">
          <a href="#" onClick={handlePayNow}>
            PAY NOW
          </a>
        </div>
      )}
    </>
  );
};
export default CardList;
