import React, { useContext } from "react";
import Router from "next/router";
import { GetContext } from "@/contexts/get";
import EditProfileModal from "@/components/molecules/editProfileModal";
import { Avatar, Image } from "antd";

const UserProfile = () => {
  const { user, setLogin, setVisible } = useContext(GetContext);

  return (
    <div>
      {user === null || user.name === undefined ? (
        <h5
          onClick={() => {
            setVisible(false, "left");
            Router.push("http://localhost:3000/its/login");
          }}
        >
          로그인
        </h5>
      ) : (
        <div className="profile">
          <Avatar
            icon={
              user.image === undefined || user.image === null ? (
                <Image
                  src={"https://joeschmoe.io/api/v1/random"}
                  style={{ width: 60 }}
                  preview={false}
                />
              ) : (
                <Image src={user.image} style={{ width: 32 }} preview={false} />
              )
            }
            size={64}
            className="profile-photo"
          />
          <div className="profile-name">이름 :</div>
          <div className="profile-username">{user.name}</div>
          <div className="profile-email">E-mail :</div>
          <div className="profile-useremail">{user.email}</div>

          {user.email !== "master@master.com" ? (
            <div>
              <h5
                className="profile-edit"
                onClick={() => {
                  setVisible(true, "editProfile");
                }}
              >
                정보 수정
              </h5>
              <EditProfileModal />
            </div>
          ) : null}
          <h5
            className="profile-logout"
            onClick={() => {
              setLogin(null);
            }}
          >
            로그아웃
          </h5>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
