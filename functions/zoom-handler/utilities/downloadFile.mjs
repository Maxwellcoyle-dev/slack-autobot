import axios from "axios";

export const downloadFile = async (downloadUrl, token) => {
  let attempts = 0;
  const maxAttempts = 3; // Maximum number of retries
  let delay = 500; // Starting delay in milliseconds

  while (attempts < maxAttempts) {
    console.log("downloadFile - attempts --- ", attempts);

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
      attempts++;
      if (attempts >= maxAttempts) {
        console.error(
          "Max retries reached. Error downloading the transcript file:",
          error
        );
        throw error; // Throw the error after the last attempt
      }
      console.log(`Retry attempt ${attempts}: waiting for ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for the delay period
      delay *= 2; // Double the delay for the next attempt
    }
  }
};
