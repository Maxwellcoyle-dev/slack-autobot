import axios from "axios";

const ZOOM_DOWNLOAD_FILE_ENDPOINT = process.env.ZOOM_DOWNLOAD_FILE_ENDPOINT;

export const getZoomRecording = async (downloadUrl) => {
  console.log("ZOOM_DOWNLOAD_RECORDING_URL --- ", ZOOM_DOWNLOAD_FILE_ENDPOINT);
  try {
    console.log("downloadUrl --- ", downloadUrl);
    // get transcript from zoom-request-handler with an axios request
    const response = await axios.post(ZOOM_DOWNLOAD_FILE_ENDPOINT, {
      downloadUrl,
      eventType: "download-recording-transcript",
    });
    console.log("download Recording response --- ", response);
    console.log("response.data.transcript", response.data.transcript);
    // The VTT content will be a Buffer since we set `responseType` to 'arraybuffer'
    const vttContent = response.data.transcript;
    console.log("VTT Content:", vttContent);

    // TODO: Extract text from VTT content
    // You can now process the vttContent variable to extract the text

    // Return or process the extracted text as needed
    return vttContent;
  } catch (error) {
    console.error("Error downloading the transcript file:", error);
    throw new Error("Error downloading the transcript file:", error);
  }
};
