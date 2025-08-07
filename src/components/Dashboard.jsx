import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  function onLogout(e) {
    e.preventDefault();
    toast.promise(axiosInstance.post("/auth/logout"), {
      loading: "Logging out...",
      success: (data) => {
        navigate("/");
        return data.data;
      },
      error: (err) => {
        navigate("/get-started");

        return err.response.data;
      },
    });
  }
  return (
    <div className="p-4 flex justify-between items-center bg-gray-900  ">
      <h1 className="text-2xl text-amber-50 ">Dashboard</h1>
      <button
        className="px-4 py-2 bg-amber-50 text-gray-900 border border-amber-50 rounded-2xl cursor-pointer hover:bg-amber-200"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
