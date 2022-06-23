import React, { useState, useRef } from "react";
// import { useItsDispatch} from '@/redux/hooks'
// import ItsMobileMenu from '@/components/organisms/ItsMobileMenu'
import ItsProjectMenu from "./organisms/ItsProjectMenu";
import { Link } from "react-router-dom";
import BottomNavigation from "reactjs-bottom-navigation";
import "reactjs-bottom-navigation/dist/index.css";
import Router from "next/router";
interface LayoutProps {
  children: any;
  /**  TODO 추후에 삭제 필요 */
  pageName?: string;
  /**  TODO 추후에 삭제 필요 */
  pageNav?: string;
  /** title prop  모든 페이지 레이아웃에 타이틀 prop  전달 시  title  prop 제거 */
  title?: string;
}

const ITSLayout = (props: LayoutProps) => {
  // const dispatch = useItsDispatch()
  const bottomNavItems = [
    {
      title: "공지사항 ",
      onClick: () => {
        Router.push("http://localhost:3000/its/noticeboard");
      },
    },
    {
      title: "이슈관리",
      onClick: () => {
        Router.push("http://localhost:3000/its/test");
      },
    },
    {
      title: "공지사항2",
      onClick: () => {
        Router.push("http://localhost:3000/its/noticeboard2");
      },
    },
  ];
  return (
    <>
      <div className="wrap all-wrapper solid-bg-all">
        <div className="layout-w">
          <div className="content-w">
            <div className="top-bar">
              <ItsProjectMenu />
              <div className="top-menu-controls">
                {/* <ItsControlsMenu /> */}
              </div>
            </div>
            <div className="content-i">
              <div className="content-box">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="element-wrapper">
                      {/* <div className="element-content wrap">{props.children}</div> */}
                      {props.children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <BottomNavigation items={bottomNavItems} />
        </div>
      </div>
    </>
  );
};

export default ITSLayout;
