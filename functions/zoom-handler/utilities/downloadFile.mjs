import axios from "axios";

export const downloadFile = async (downloadUrl, token) => {
  try {
    // Download the VTT file content using axios with JWT token
    const response = await axios.get(downloadUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error downloading the transcript file:", error);
    throw new Error(error);
  }
};
