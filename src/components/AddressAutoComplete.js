import { GOOGLE_KEY } from "@/constant/constant";
import Image from "next/image";
import { usePlacesWidget } from "react-google-autocomplete";
const AddressAutoComplete = ({
  register,
  edit = true,
  errors,
  onSelectPlace,
  defaultValue,
}) => {
  const { onChange, onBlur, name, value } = register;
  const { ref } = usePlacesWidget({
    apiKey: GOOGLE_KEY,
    onPlaceSelected: onSelectPlace,
  });

  return (
    <div className="user-label">
      <div className="user-label-icon">
        <Image
          width={25}
          height={25}
          src="/images/user-dashboard/my-profile/icons/4.svg"
          alt=""
        />
      </div>
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        name={name}
        type="text"
        autoComplete="off"
        style={{ border: errors.address ? "1px solid red" : "" }}
        readOnly={edit}
        disabled={edit}
        onBlur={onBlur}
        placeholder="Address"
        defaultValue={defaultValue}
      />
    </div>
  );
};
export default AddressAutoComplete;
