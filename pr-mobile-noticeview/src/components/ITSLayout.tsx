import React from "react";
// import { useItsDispatch} from '@/redux/hooks'
// import ItsMobileMenu from '@/components/organisms/ItsMobileMenu'
import ItsProjectMenu from "@/components/organisms/ItsProjectMenu";
import "reactjs-bottom-navigation/dist/index.css";

interface LayoutProps {
  children: any;
  pageName?: string;
  pageNav?: string;
  title?: string;
}

const ITSLayout = (props: LayoutProps) => {
  // const dispatch = useItsDispatch()

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
        <div></div>
      </div>
    </>
  );
};

export default ITSLayout;
