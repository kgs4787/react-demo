import { useEffect, useState } from "react";
import Card from "../Card";
import styles from "./FeedbackItem.module.css";
import axios from "axios";

const FeedbackItem = (props) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const getFeedback = async () => {
    setLoading(true);
    await axios.get("http://localhost:4000/feedbacks").then((res) => {
      setFeedbacks(res.data);
    });
    setLoading(false);
  };
  useEffect(() => {
    getFeedback();
  }, []);

  //TODO
  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete("http://localhost:4000/feedbacks/" + id)
      .then(() => getFeedback());
  };

  const _feedback = feedbacks.map((fb) => {
    return (
      <Card>
        <div className={styles.numDisplay}>{fb.rating}</div>
        <button className={styles.close} onClick={() => handleDelete(fb.id)}>
          X
        </button>
        <p className="text-display">{fb.text}</p>
      </Card>
    );
  });
  return <div>{_feedback}</div>;
};

export default FeedbackItem;
