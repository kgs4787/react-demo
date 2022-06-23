import AxiosInstance from "./http-common";

const feedbackApi = { addFeedback, deleteFeedback, getFeedbacks };

function getFeedbacks() {
  return AxiosInstance({
    url: "/feedbacks",
    method: "GET",
  });
}

function addFeedback(feedback) {
  return AxiosInstance({
    url: "/feedbacks",
    method: "POST",
    data: feedback,
  });
}

function deleteFeedback(id) {
  return AxiosInstance({
    url: `/feedbacks/${id}`,
    method: "DELETE",
  });
}

export default feedbackApi;
