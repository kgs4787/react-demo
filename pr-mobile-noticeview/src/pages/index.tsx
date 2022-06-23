import React, { useEffect } from "react";
// import { useRouter } from 'next/router'
// import { useTmsDispatch, useTmsSelector } from '@/redux/hooks'
import { makeStyles } from "@material-ui/core";
import ITSLayout from "@/components/ITSLayout";

const IndexPage = () => {
  return (
    <>
      <ITSLayout children={undefined} />
      <div>Home</div>
    </>
  );
};

export default IndexPage;
