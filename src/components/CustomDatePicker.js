import { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

export default function CustomDatePicker({ date, onChange }) {
  const [selectDate, setSelectDate] = useState(date || []);

  // const onDateChange = (evtDate) => {
  //   setSelectDate(evtDate);
  //   // onChange(evtDate)
  // };


  const today = new Date();
  today.setHours(0, 0, 0, 0); 

   const onDateChange = (evtDate) => {
    setSelectDate(evtDate);

    if (Array.isArray(evtDate) && evtDate.length === 2) {
      onChange(evtDate);
    }
  };

  const handleClick = (text) => {
    if (text === "close") {
      setSelectDate([]);
      onChange([]);

      // onChange(selectDate);
    }
    
    // else {
    //    onChange(selectDate);
    //    setSelectDate(selectDate);
    // }
    
  };

  return (
    <DatePicker
      range
      value={selectDate}
      numberOfMonths={2}
      dateSeparator=" to "
      placeholder="Start & End Date"
      onChange={onDateChange}
      containerStyle={{ width: "100%" }}
      minDate={today}
      plugins={[
        <Toolbar key="customToolbar" position="bottom" onApply={handleClick} selectedDates={selectDate}  />,
      ]}
    />
  );
}

// interface ToolbarProps {
//   position: string;
//   datePickerProps?: any;
//   calendarProps?: any;
//   onApply: (text?: string) => void;
//   DatePicker: any;
// }

function Toolbar({
  position,
  datePickerProps,
  calendarProps,
  onApply,
  DatePicker,
}) {
  const props = datePickerProps || calendarProps;

  const handleApplyClick = () => {
    onApply();
    DatePicker.closeCalendar();
  };

  const handlecloseClick = () => {
    onApply("close");
    DatePicker.closeCalendar();
  };

  return (
    <div className="drp-bottom-box">
      <span className="drp-selected">
        {props?.value[0]?.format()}{" "}
        {props?.value[1]?.format() && ` to ${props?.value[1]?.format()}`}
      </span>

      <button
        className="cancelBtn btn btn-sm btn-default"
        type="button"
        onClick={handlecloseClick}
      >
        cancel
      </button>
      <div
        className="applyBtn-date applyBtn btn btn-sm btn-primary"
        onClick={handleApplyClick}
      >
        Apply
      </div>
    </div>
  );
}

// function Toolbar({
//   position,
//   onApply,
//   DatePicker,
//   selectedDates = [], // ✅ use this instead
// }) {

//   const handleApplyClick = () => {
//     onApply();
//     DatePicker.closeCalendar();
//   };

//   const handlecloseClick = () => {
//     onApply("close");
//     DatePicker.closeCalendar();
//   };

//   return (
//     <div className="drp-bottom-box">
//       <span className="drp-selected">
//         {selectedDates[0]?.format?.()}{" "}
//         {selectedDates[1] && ` to ${selectedDates[1]?.format?.()}`}
//       </span>

//       <button
//         className="cancelBtn btn btn-sm btn-default"
//         type="button"
//         onClick={handlecloseClick}
//       >
//         cancel
//       </button>

//       <div
//         className="applyBtn-date applyBtn btn btn-sm btn-primary"
//         onClick={handleApplyClick}
//       >
//         Apply
//       </div>
//     </div>
//   );
// }
