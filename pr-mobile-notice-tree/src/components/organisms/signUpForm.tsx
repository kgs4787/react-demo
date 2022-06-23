import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import axios from "axios";
import { Toast } from "primereact/toast";
import Router from "next/router";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

const googleMapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

const containerStyle = {
  width: "90vw",
  height: "58vh",
};

const center = {
  lat: 37.366344,
  lng: 127.106634,
};

const SignUpForm = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [users, setUsers] = useState([]);
  const toast = useRef(null);
  const [markerPosition, setMarkerPosition] = useState([
    { latitude: null, longitude: null },
  ]);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    return axios.get("http://localhost:3001/users").then((res) => {
      setUsers(res.data);
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.name) {
        errors.name = "Name is required.";
      }

      if (!data.email) {
        errors.email = "Email is required.";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)
      ) {
        errors.email = "Invalid email address. E.g. example@email.com";
      }

      if (!data.password) {
        errors.password = "Password is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      const user = users.find((user) => user.email === data.email);

      if (user) {
        throw toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: "이미 존재하는 email입니다.",
          life: 3000,
        });
      }

      axios.post("http://localhost:3001/users", {
        name: data.name,
        email: data.email,
        password: data.password,
        latitude: markerPosition[0].latitude,
        longitude: markerPosition[0].longitude,
      });

      setShowMessage(true);

      formik.resetForm();
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

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="확인"
        className="p-button-text"
        autoFocus
        onClick={() => {
          Router.push("http://localhost:3000/its/login");
          setShowMessage(false);
        }}
      />
    </div>
  );
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
  const position = {
    lat: markerPosition[0].latitude,
    lng: markerPosition[0].longitude,
  };
  return (
    <div className="form-demo">
      <Toast ref={toast} />
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="flex align-items-center flex-column pt-6 px-3">
          <i
            className="pi pi-check-circle"
            style={{ fontSize: "5rem", color: "var(--green-500)" }}
          ></i>
          <h5>Registration Successful!</h5>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            가입이 완료되었습니다.
          </p>
        </div>
      </Dialog>

      <div className="flex justify-content-center">
        <div className="card">
          <h5 className="text-center">회원 가입</h5>
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="field">
              <span className="p-float-label">
                <InputText
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  autoFocus
                  className={classNames("input", {
                    "p-invalid": isFormFieldValid("name"),
                  })}
                />
                <label
                  htmlFor="name"
                  className={classNames({
                    "p-error": isFormFieldValid("name"),
                  })}
                >
                  Name*
                </label>
              </span>
              {getFormErrorMessage("name")}
            </div>
            <div className="field">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-envelope" />
                <InputText
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className={classNames("input", {
                    "p-invalid": isFormFieldValid("email"),
                  })}
                />
                <label
                  htmlFor="email"
                  className={classNames({
                    "p-error": isFormFieldValid("email"),
                  })}
                >
                  Email*
                </label>
              </span>
              {getFormErrorMessage("email")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Password
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  toggleMask
                  className={classNames({
                    "p-invalid": isFormFieldValid("password"),
                  })}
                  inputClassName="input"
                  panelClassName="input"
                  header={passwordHeader}
                  footer={passwordFooter}
                />
                <label
                  htmlFor="password"
                  className={classNames({
                    "p-error": isFormFieldValid("password"),
                  })}
                >
                  Password*
                </label>
              </span>
              {getFormErrorMessage("password")}
            </div>
            <Button type="submit" label="가입" className="mt-2" />
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
              <Marker position={position}></Marker>
            </GoogleMap>
          </LoadScriptNext>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
