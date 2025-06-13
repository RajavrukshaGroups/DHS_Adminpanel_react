import axios from "axios";

const uploadProfileImage = async (base64) => {
  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/<CLOUD_NAME>/image/upload",
      {
        file: base64,
        upload_preset: "<UPLOAD_PRESET>",
      }
    );
    return res.data.url;
  } catch (err) {
    console.error("Cloudinary Upload Failed", err);
    return null;
  }
};

export default uploadProfileImage;
