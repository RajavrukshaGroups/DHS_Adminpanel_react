
import axiosInstance from "./interceptors.js";

export const Signin = async ( email, password ) => {
  try {
    const response = await axiosInstance.post("/admin/adminLogin", {
      email,
      password,
    });
    return response; 
  } catch (error) {
    return error.data
    }
 };