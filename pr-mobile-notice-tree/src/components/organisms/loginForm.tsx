import React, { useEffect, useRef, useContext } from "react";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { GetContext } from "@/contexts/get";
import Router from "next/router";
import GoogleLogin from "react-google-login";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_KEY;

const LogInForm = () => {
  const { setLogin, users, getUsers } = useContext(GetContext);
  const toast = useRef(null);
  useEffect(() => {
    getUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validate: (data) => {
      let errors = {};

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

      if (!user || user.password !== data.password) {
        throw toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: "email 또는 password가 일치하지 않습니다.",
          life: 3000,
        });
      }

      setLogin(user);
      Router.push("http://localhost:3000/its/noticeboard");
    },
  });
  const masterLogin = () => {
    const user = users.find((user) => user.email === "master@master.com");
    setLogin(user);

    Router.push("http://localhost:3000/its/noticeboard");
  };
  const demoLogin = () => {
    const user = users.find((user) => user.email === "demo@demo.com");
    setLogin(user);

    Router.push("http://localhost:3000/its/noticeboard");
  };
  const isFormFieldValid = (name: any) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name: any) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  const onSuccess = async (response) => {
    const tempUser = users.find(
      (user) => user.gmail === response.profileObj.email
    );

    if (!tempUser) {
      throw toast.current.show({
        severity: "error",
        summary: "Error Message",
        detail: "연동되어있는 구글 이메일이 없습니다.",
        life: 3000,
      });
    }

    setLogin(tempUser);
    Router.push("http://localhost:3000/its/noticeboard");
  };

  const onFailure = (error) => {
    console.log(error);
  };

  return (
    <div className="form-demo">
      <Toast ref={toast} />
      <div className="flex justify-content-center">
        <div className="card">
          <h5 className="text-center">로그인</h5>
          <form onSubmit={formik.handleSubmit} className="p-fluid">
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
                  feedback={false}
                  className={classNames({
                    "p-invalid": isFormFieldValid("password"),
                  })}
                  inputClassName="input"
                  panelClassName="input"
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
            <label
              onClick={() => Router.push("http://localhost:3000/its/signup")}
            >
              회원가입하려면 여기를 누르세요.
            </label>
            <Button type="submit" label="로그인" className="mt-2" />
            <Button
              onClick={() => masterLogin()}
              label="마스터 계정 로그인"
              className="mt-2"
            />
            <Button
              onClick={() => demoLogin()}
              label="데모 계정 로그인"
              className="mt-2"
            />
          </form>
          <div>
            <GoogleLogin
              clientId={clientId}
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
