import React, { useState, useEffect, useRef, useContext } from "react";
import { Toast } from "primereact/toast";
import { DataView } from "primereact/dataview";
import Link from "next/link";
import { GetContext } from "@/contexts/get";
import { AiOutlineEye } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa";
import axios from "axios";
import { Avatar, Image } from "antd";
const NoticeView = (Nprops) => {
  const { inform, getInforms, users, getUsers } = useContext(GetContext);
  const [filteredInforms, setFilteredInforms] = useState([]);
  const toast = useRef<any>(null);

  useEffect(() => {
    getUsers();
    getInforms();
  }, []);

  useEffect(() => {
    setFilteredInforms(() =>
      inform.filter((inf) =>
        inf.title.toLowerCase().includes(Nprops.search.toLowerCase())
      )
    );
  }, [Nprops.search, inform]);

  const onSubmit = async (data) => {
    const view = Number(data.view);

    await axios
      .patch("http://localhost:3001/informs/" + data.id, {
        view: view + 1,
      })
      .then(() => {
        getInforms();
      });
  };

  const renderListItem = (data) => {
    const user = users.find((user) => user.id === data.userID);
    return (
      <div className="col-12">
        <div className="product-list-item">
          <Link href="/its/detail/[id]" as={"/its/detail/" + data.id}>
            <div className="product-list-title" onClick={() => onSubmit(data)}>
              {data.title}
            </div>
          </Link>
          <div
            className="product-list-content"
            dangerouslySetInnerHTML={{ __html: data.inform }}
          ></div>
          <div className="product-list-user">
            <Avatar
              icon={
                user.image === null || user.image === undefined ? (
                  <Image
                    src={"https://joeschmoe.io/api/v1/random"}
                    style={{ width: 30 }}
                    preview={false}
                  />
                ) : (
                  <Image
                    src={user.image}
                    style={{ width: 30, height: 30 }}
                    preview={false}
                  />
                )
              }
              size={30}
              className="profile-photo"
            />
            <div>{user.name}</div>
          </div>
          <span className="product-list-date">{data.date}</span>
          <div className="product-list-state">
            <div>
              <FaComment className="pi pi-comment" />
              {data.commentlength}
            </div>
            <div>
              <FcLike />
              {data.heartcount}
            </div>
            <div className="product-list-view">
              <AiOutlineEye />
              {data.view}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (inform, layout) => {
    if (!inform) {
      return;
    }
    if (layout === "list") {
      return renderListItem(inform);
    }
  };

  const renderHeader = () => {
    return (
      <div className="grid grid-nogutter">
        <div className="col-6" style={{ textAlign: "left" }}>
          <div>Lastest Notice</div>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="dataview-demo">
      <Toast ref={toast} />

      <div className="card">
        <DataView
          paginatorClassName="paginator"
          value={filteredInforms}
          layout={"list"}
          header={header}
          itemTemplate={itemTemplate}
          paginator
          rows={9}
          alwaysShowPaginator={false}
        />
      </div>
    </div>
  );
};

export default NoticeView;
