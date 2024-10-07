import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { GOOGLE_KEY } from "@/constant/constant";

const AutoCompleteGoogle = ({ select = [], setSelect }) => {
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: GOOGLE_KEY,
    });

  const [value, setValue] = useState("");

  const handleLocationSelect = (place) => {
    if (select.includes(place)) {
      const exclude = select.filter((it) => it !== place);
      setSelect(exclude);
    } else {
      setSelect([...select, place]);
    }
  };

  const removeFilter = () => {
    getPlacePredictions({ input: "" });
    setValue("");
    setSelect([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        style={{ color: "black" }}
        type="text"
        placeholder="Select Location"
        value={value}
        onChange={(evt) => {
          getPlacePredictions({ input: evt.target.value });
          setValue(evt.target.value);
        }}
      />

      {Array.isArray(select) && select.length > 0 && (
        <a onClick={() => removeFilter()} className="clear-btn" role="button">
          {" "}
          Clear{" "}
        </a>
      )}
      {!isPlacePredictionsLoading && placePredictions.length > 0 && (
        <div
          style={{
            display: "flex",
            maxHeight: 200,
            overflowY: "scroll",
            flexDirection: "column",
            paddingTop: 8,
          }}
        >
          {placePredictions.map((item) => (
            <div key={item.place_id} style={{ margin: 4 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {item.structured_formatting.main_text}
                <span>
                  <input
                    type="checkbox"
                    id={item.structured_formatting.main_text}
                    name={item.structured_formatting.main_text}
                    value={item.structured_formatting.main_text}
                    checked={select.includes(
                      item.structured_formatting.main_text
                    )}
                    onClick={(e) => handleLocationSelect(e.currentTarget.value)}
                  />
                </span>
              </div>
              <Divider />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteGoogle;
