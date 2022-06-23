import React from "react";
// import { useRouter } from 'next/router'
// import { useTmsDispatch, useTmsSelector } from '@/redux/hooks'
import { makeStyles } from "@material-ui/core";
import ITSLayout from "@/components/ITSLayout";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const IndexPage = () => {
  const classes = useStyles();
  // const router = useRouter()

  return (
    <>
      <ITSLayout children={undefined} />
    </>
  );
};

export default IndexPage;
