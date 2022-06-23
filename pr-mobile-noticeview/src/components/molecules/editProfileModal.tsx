/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { GetContext } from "@/contexts/get";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Avatar } from "antd";
import GoogleLogin from "react-google-login";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

const googleMapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;
const clientId = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_KEY;

const EditProfileModal = () => {
  const toast = useRef<any>(null);
  const { user, setVisible, visibleEditProfile, setLogin, users, getUsers } =
    useContext(GetContext);
  const [file, setFile] = useState([{ fileName: null, fileurl: null }]);
  const [Image, setImage] = useState(
    user.image === undefined || user.image === null
      ? "https://joeschmoe.io/api/v1/random"
      : user.image
  );
  const fileInput = useRef(null);
  const [markerPosition, setMarkerPosition] = useState([
    { latitude: user.latitude, longitude: user.longitude },
  ]);
  const containerStyle = {
    width: "300px",
    height: "300px",
  };

  const center = {
    lat: markerPosition[0].latitude,
    lng: markerPosition[0].longitude,
  };

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      password: user.password,
    },
    onSubmit: async (data) => {
      data.name === "" ? (data.name = user.name) : null;
      data.password === "" ? (data.password = user.password) : null;
      file[0].fileurl === null ? (file[0].fileurl = user.image) : null;
      await axios
        .patch("http://localhost:3001/users/" + user.id, {
          name: data.name,
          password: data.password,
          image: file[0].fileurl,
          latitude: markerPosition[0].latitude,
          longitude: markerPosition[0].longitude,
        })
        .then(() => {
          getUsers();
          toast.current.show({
            severity: "success",
            summary: "성공",
            detail: "저장되었습니다.",
            life: 3000,
          });
        });

      onReset();
      setLogin(null);
    },
  });

  const isFormFieldValid = (name: any) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name: any) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  const passwordHeader = <h6>Pick a password</h6>;
  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </React.Fragment>
  );
  const onSuccess = async (response) => {
    const tempUser = users.find(
      (user) => user.gmail === response.profileObj.email
    );

    if (tempUser) {
      throw toast.current.show({
        severity: "error",
        summary: "Error Message",
        detail: "이미 해당 구글 이메일과 연동되어있는 ID가 존재합니다",
        life: 3000,
      });
    } else {
      axios
        .patch("http://localhost:3001/users/" + user.id, {
          name: response.profileObj.name,
          image: response.profileObj.imageUrl,
          gmail: response.profileObj.email,
        })
        .then(() => {
          getUsers();
          toast.current.show({
            severity: "success",
            summary: "성공",
            detail: "gmail 연동이 완료되었습니다.",
            life: 3000,
          });
          onReset();
          setLogin(null);
        });
    }
  };

  const onFailure = (error) => {
    console.log(error);
  };

  const onRemove = () => {
    axios
      .patch("http://localhost:3001/users/" + user.id, {
        gmail: "",
      })
      .then(() => {
        getUsers();
        toast.current.show({
          severity: "success",
          summary: "성공",
          detail: "gmail 연동 삭제가 완료되었습니다.",
          life: 3000,
        });
      });
  };
  const onReset = () => {
    setVisible(false, "editProfile");
    formik.resetForm();
    setFile([{ fileName: null, fileurl: null }]);
  };
  const onChange = (e) => {
    if (e.target.files[0]) {
      const file1 = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setFile([{ fileName: file1.name, fileurl: e.target.result }]);
      };
      fileReader.readAsDataURL(file1);
    } else {
      setImage("https://joeschmoe.io/api/v1/random");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const addMarker = (response: google.maps.MapMouseEvent) => {
    const lat = response.latLng.lat();
    const lng = response.latLng.lng();

    setMarkerPosition([
      {
        latitude: lat,
        longitude: lng,
      },
    ]);
  };

  return (
    <div className={`fancy-selector-w`}>
      <Toast ref={toast} />
      <Sidebar
        className="reg-sidebar"
        visible={visibleEditProfile}
        fullScreen
        onHide={() => onReset()}
      >
        <div className="flex justify-content-center">
          <Toast ref={toast} />
          <div className="card">
            <h5 className="text-center">정보 수정</h5>
            <div className="edit-email">
              <div className="profile-email">E-mail :</div>
              <div className="profile-useremail">{user.email}</div>
            </div>
            <form onSubmit={formik.handleSubmit} className="p-fluid">
              <div className="field">
                <span className="p-float-label">
                  <InputText
                    id="name"
                    name="name"
                    className="name-input"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    autoFocus
                  />
                </span>
                {getFormErrorMessage("name")}
              </div>

              <div className="field">
                <span className="p-float-label">
                  <Password
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    toggleMask
                    inputClassName="input"
                    panelClassName="input"
                    header={passwordHeader}
                    feedback={false}
                    footer={passwordFooter}
                  />
                </span>
                {getFormErrorMessage("password")}
              </div>

              <div className="field">
                <Avatar
                  src={Image}
                  size="small"
                  onClick={() => {
                    fileInput.current.click();
                  }}
                />
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  name="profile_img"
                  onChange={onChange}
                  ref={fileInput}
                />
              </div>
              {user.gmail === null ||
              user.gmail === undefined ||
              user.gmail === "" ? (
                <GoogleLogin
                  clientId={clientId}
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  buttonText="구글 연동하기"
                  cookiePolicy="single_host_origin"
                />
              ) : (
                <Button label="연동된 gmail 삭제" onClick={() => onRemove()} />
              )}
              <Button type="submit" label="저장" className="mt-2" />
            </form>
            <LoadScriptNext googleMapsApiKey={googleMapKey}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={16}
                options={{
                  gestureHandling: "greedy",
                  streetViewControl: true,
                  fullscreenControl: true,
                }}
                onClick={addMarker}
              >
                <Marker position={center}></Marker>
              </GoogleMap>
            </LoadScriptNext>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default EditProfileModal;
