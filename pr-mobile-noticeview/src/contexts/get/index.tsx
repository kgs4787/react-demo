import { createContext, useState } from "react";
import axios from "axios";

const GetContext = createContext({
  inform: [],
  getInforms: () => {},
  user: [],
  setLogin: (props: any) => {},
  detailInform: [],
  getDetailInforms: (props: any) => {},
  visibleLeft: false,
  setVisible: (props: any, type: any) => {},
  visibleComment: false,
  visibleReg: false,
  visibleEdit: false,
  visibleEditProfile: false,
  users: [],
  getUsers: () => {},
  deleteInforms: (props: any) => {},
  deleteUsers: (props: any) => {},
  detailUser: [],
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

const GetProvider = ({ children }: Props): JSX.Element => {
  const [inform, setInform] = useState<any>([]);
  const [detailInform, setDetailInform] = useState([]);
  const [user, setUser] = useState([]);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [visibleComment, setVisibleComment] = useState(false);
  const [visibleReg, setVisibleReg] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleEditProfile, setVisibleEditProfile] = useState(false);
  const [users, setUsers] = useState([]);
  const [detailUser, setDetailUser] = useState([]);

  const getInforms = () => {
    return axios
      .get("http://localhost:3001/informs?_sort=date&_order=desc")
      .then((res) => {
        setInform(res.data);
      });
  };

  const setLogin = (props: any) => {
    setUser(props);
  };

  const deleteInforms = (props: any) => {
    return axios
      .delete("http://localhost:3001/informs/" + props)
      .then(() => getInforms());
  };
  /*   const deleteInforms = () => {
    return axios.delete("http://localhost:3001/informs");
  }; */
  const deleteUsers = (props: any) => {
    return axios.delete("http://localhost:3001/users/" + props);
  };

  const setVisible = (props: any, type) => {
    if (type === "left") {
      setVisibleLeft(props);
    } else if (type === "comment") {
      setVisibleComment(props);
    } else if (type === "Reg") {
      setVisibleReg(props);
    } else if (type === "edit") {
      setVisibleEdit(props);
    } else if (type === "editProfile") {
      setVisibleEditProfile(props);
    }
  };
  const getDetailInforms = (props: any) => {
    return axios.get("http://localhost:3001/informs/" + props).then((res) => {
      setDetailInform(res.data);
      getUsers();
      const userid = users.find((user) => user.id === res.data.userID);
      setDetailUser(userid);
    });
  };

  const getUsers = () => {
    return axios.get("http://localhost:3001/users").then((res) => {
      setUsers(res.data);
    });
  };
  return (
    <GetContext.Provider
      value={{
        inform,
        getInforms,
        user,
        setLogin,
        detailInform,
        getDetailInforms,
        setVisible,
        visibleLeft,
        visibleComment,
        visibleReg,
        visibleEdit,
        visibleEditProfile,
        users,
        getUsers,
        deleteInforms,
        deleteUsers,
        detailUser,
      }}
    >
      {children}
    </GetContext.Provider>
  );
};

export { GetContext, GetProvider };
