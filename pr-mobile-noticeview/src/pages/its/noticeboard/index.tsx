import React, { useState } from "react";
import ITSLayout from "@/components/ITSLayout";
import { BiSearch } from "react-icons/bi";
import NoticeView from "@/components/organisms/noticeView";

const ItsInformPage = () => {
  const [searchField, setSearchField] = useState("");

  const onSearch = (e) => {
    setSearchField(e.target.value);
  };

  return (
    <ITSLayout title="Test">
      <div className="dataview-demo">
        <div className="card">
          <div className="mb-4">
            <BiSearch />
            <input
              className="searchfield"
              type="search"
              placeholder=""
              onChange={onSearch}
            ></input>
          </div>
          <NoticeView search={searchField} />
        </div>
      </div>
    </ITSLayout>
  );
};

export default ItsInformPage;
