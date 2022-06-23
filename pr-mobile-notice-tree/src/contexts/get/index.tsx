import { createContext, useState } from "react";
import axios from "axios";

const GetContext = createContext({
  user: [],
  setLogin: (props: any) => {},
  visibleLeft: false,
  setVisible: (props: any, type: any) => {},
  visibleEditProfile: false,
  users: [],
  getUsers: () => {},
  totalNumber: 0,
  getTotal: () => {},
  files: [],
  setFile: (props: any) => {},
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

const GetProvider = ({ children }: Props): JSX.Element => {
  const [user, setUser] = useState([]);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [visibleEditProfile, setVisibleEditProfile] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalNumber, setTotalNumber] = useState(0);
  const [files, setFiles] = useState<any>([{ data: {} }]);

  const getTotal = () => {
    return axios.get("http://localhost:3001/fileNumber/1").then((res) => {
      setTotalNumber(res.data.number);
    });
  };

  const setLogin = (props: any) => {
    setUser(props);
  };
  const setFile = (props: any) => {
    setFiles(props);
  };
  const setVisible = (props: any, type) => {
    if (type === "left") {
      setVisibleLeft(props);
    } else if (type === "editProfile") {
      setVisibleEditProfile(props);
    }
  };

  const getUsers = () => {
    return axios.get("http://localhost:3001/users").then((res) => {
      setUsers(res.data);
    });
  };

  return (
    <GetContext.Provider
      value={{
        user,
        setLogin,
        setVisible,
        visibleLeft,
        visibleEditProfile,
        users,
        getUsers,
        totalNumber,
        getTotal,
        files,
        setFile,
      }}
    >
      {children}
    </GetContext.Provider>
  );
};

export { GetContext, GetProvider };
