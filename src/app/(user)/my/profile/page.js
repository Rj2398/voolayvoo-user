"use client";
import { BASE_URL } from "@/constant/constant";
import useLocalStorage from "@/constant/useLocalStorage";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AddressAutoComplete from "@/components/AddressAutoComplete";
import { useAuth } from "@/app/UserProvider";
import { useSelector } from "react-redux";

const Profile = () => {
  const [edit, setEdit] = useState(true);
  const [reload, setReload] = useState(false);
  const [userImage, setuserImage] = useState("");
  console.log(userImage, "askdfjjkasfhjkshfsg");

  const { isAuthenticated, userDetails, login } = useAuth();
  const [image, setImage] = useState("");
  const { userInfo } = useSelector((state) => state.user);
  const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);

  console.log(userDetails, "user authrization check");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  useEffect(() => {
    async function fetchEffect() {
      try {
        const response = await postFetchDataWithAuth({
          data: { user_id: userDetails?.user_id },
          endpoint: "user_get_profile",
          authToken: localStorage.token,
        });
        const formatedData = response?.data;
        console.log(formatedData, "profile get api");
        // login({
        //   email: formatedData.email,
        //   user_id: formatedData.id,
        //   token: localStorage.token,
        //   login_type: formatedData.login_type,
        //   name: formatedData.name,
        //   profile_image: formatedData.profile_image,
        //   user_signup_status: formatedData.user_signup_status,
        // });
        // const formattedData = {
        //   token: localStorage.token,
        //   user_details: {
        //     email: formatedData.email,
        //     user_id: formatedData.id,
        //     token: localStorage.token,
        //     login_type: formatedData.login_type,
        //     name: formatedData.name,
        //     profile_image: formatedData.profile_image,
        //     user_signup_status: formatedData.user_signup_status,
        //   },
        // };
        if (response?.data?.user_signup_status == "1") {
          // login(formattedData);
          setValue("email", response.data.email);
          setValue("name", response.data.name);
          setValue("phone", response.data.phone);
          setValue("address", response.data.location);
          setValue("latitude", response.data.latitude);
          setValue("longitude", response.data.longitude);
          setuserImage(response.data.profile_image);
        }
      } catch (error) {
        toast.error(`${error}`);
      }
    }
    fetchEffect();
    // eslint-disable-next-line
  }, [isAuthenticated, reload]);
  const onSubmit = async (data) => {
    try {
      const formdata = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        // user_id: userInfo?.user_id,
        user_id: userDetails.user_id,
        // user_id: "654",
        location: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      };
      // if (typeof data.profile_image[0] === "object") {
      //   formdata["profile_image"] = data?.profile_image[0];
      // }

      if (
        data.profile_image &&
        data.profile_image[0] &&
        typeof data.profile_image[0] === "object"
      ) {
        formdata["profile_image"] = data.profile_image[0];
      } else {
        formdata["profile_image"] = "";
      }

      console.log(formdata, "formData is thissss");

      const response = await postFetchDataWithAuth({
        data: formdata,
        endpoint: "user_update_profile",
        authToken: localStorage.token,
      });
      // const data = response?.data[0];
      const formatedData = response?.data[0];
      console.log(formatedData, "profile update response");

      if (response) {
        setReload(!reload);
        toast.success(response.message);
        setEdit(true);
        const formattedData = {
          token: localStorage.token,
          email: formatedData.email,
          user_details: [
            {
              user_id: formatedData.id,
              token: localStorage.token,
              login_type: formatedData.login_type,
              name: formatedData.name,
              profile_image: formatedData.profile_image,
              user_signup_status: formatedData.user_signup_status,
            },
          ],
        };

        login(formattedData);
      } else {
        throw response;
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? `${error}`
          : error?.message
          ? error?.message
          : `${error}`;
      toast.error(errorMessage);
    }
  };
  const handlePlaceSelect = (place, inputRef) => {
    setValue("address", inputRef.value);
    setValue("latitude", place.geometry.location.lat());
    setValue("longitude", place.geometry.location.lng());
  };
  const handleUpload = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader?.result);
      };
      reader.readAsDataURL(selectedImage);
    }
    setValue("profile_image", event.target.files);
  };
  return (
    <>
      <div className="user-dashboard-data">
        <div className="user-my-profile">
          <h1>My Profile</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="user-pro-in">
              <div className="user-image">
                <Image
                  width={96}
                  height={96}
                  style={{ borderRadius: 999 }}
                  src={
                    !image
                      ? userImage
                        ? `${BASE_URL}${userImage}`
                        : "/images/user-dashboard/my-profile/profile.png"
                      : image
                  }
                  alt=""
                />
              </div>
              {!edit && (
                <label className="user-upload-icon">
                  <Image
                    width={19}
                    height={14}
                    src="/images/user-dashboard/my-profile/upload.svg"
                    alt=""
                  />
                  <input
                    type="file"
                    id="profile_image"
                    hidden
                    onChange={handleUpload}
                    // {...register("profile_image")}
                  />
                </label>
              )}
            </div>

            <div className="user-label">
              <div className="user-label-icon">
                <Image
                  width={25}
                  height={25}
                  src="/images/user-dashboard/my-profile/icons/1.svg"
                  alt=""
                />
              </div>
              <input
                {...register("name", {
                  required: {
                    value: true,
                    message: "Name is required",
                  },
                })}
                type="text"
                style={{ border: errors.name ? "1px solid red" : "" }}
                readOnly={edit}
                placeholder="Full Name"
              />
            </div>

            <div className="user-label">
              <div className="user-label-icon">
                <Image
                  width={25}
                  height={25}
                  src="/images/user-dashboard/my-profile/icons/2.svg"
                  alt=""
                />
              </div>
              <input
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email address",
                  },
                })}
                type="text"
                style={{ border: errors.email ? "1px solid red" : "" }}
                readOnly={edit || userDetails?.login_type === "email"}
                placeholder="Email"
              />
            </div>

            <div className="user-label">
              <div className="user-label-icon">
                <Image
                  width={25}
                  height={25}
                  src="/images/user-dashboard/my-profile/icons/3.svg"
                  alt=""
                />
              </div>
              <input
                {...register("phone", {
                  required: {
                    value: true,
                    message: "Number is required",
                  },
                  minLength: 10,
                  pattern: /[0-9]/,
                })}
                type="text"
                maxLength={10}
                style={{ border: errors.phone ? "1px solid red" : "" }}
                readOnly={edit || userDetails?.login_type === "phone"}
                placeholder="Phone number"
              />
            </div>

            <AddressAutoComplete
              defaultValue={getValues("address")}
              edit={edit}
              register={register("address")}
              errors={errors}
              onSelectPlace={handlePlaceSelect}
            />

            <div>
              <input type="hidden" id="latitude" {...register("latitude")} />

              <input type="hidden" id="longitude" {...register("longitude")} />
            </div>
            <div className="user-label-btn">
              <input
                onClick={() => setEdit(false)}
                type="button"
                value="Edit"
              />
              <input type="submit" value="Save" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
