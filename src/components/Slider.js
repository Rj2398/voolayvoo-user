import React, { useState, useEffect, ChangeEvent } from "react";

const Slider = ({ initialValueFrom, initialValueTo, handleSliderValues }) => {
  const [fromValue, setFromValue] = useState(initialValueFrom);
  const [toValue, setToValue] = useState(initialValueTo);

  useEffect(() => {
    // You can add any logic here that needs to run when the values change
    // For example, updating other components or making API calls
    handleSliderValues({ fromValue, toValue });
    // eslint-disable-next-line
  }, [fromValue, toValue]);

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (event.target.id === "fromSlider") {
      if (value < toValue) {
        setFromValue(value);
      }
    } else if (event.target.id === "toSlider") {
      if (value > fromValue) {
        setToValue(value);
      }
    }
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (event.target.id === "fromInput") {
      setFromValue(value);
    } else if (event.target.id === "toInput") {
      setToValue(value);
    }
  };

  return (
    <ul
      className="dropdown-menu w-100 volovo-range"
      aria-labelledby="date-range-drop"
    >
      <div className="miles-inner">
        <div className="sliders_control">
          <input
            id="fromSlider"
            type="range"
            value={fromValue}
            min="0"
            max="100"
            onChange={handleSliderChange}
          />
          <input
            id="toSlider"
            type="range"
            value={toValue}
            min="0"
            max="100"
            onChange={handleSliderChange}
          />
        </div>
        <div className="form_control">
          <div className="form_control_container">
            <input
              className="form_control_container__time__input"
              type="number"
              id="fromInput"
              value={fromValue}
              min="0"
              max="100"
              onChange={handleInputChange}
            />
          </div>
          <div className="form_control_container">
            <input
              className="form_control_container__time__input num-last"
              type="number"
              id="toInput"
              value={toValue}
              min="0"
              max="100"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </ul>
  );
};

export default Slider;
