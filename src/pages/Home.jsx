import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Applayout from "../components/Layout/Applayout";
import "./styles.css";
import bgImage from "../assets/bg.jpg";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const CHUNK_SIZE = 100;

const Home = () => {
  const [fileData, setFileData] = useState([]);
  const [renderedData, setRenderedData] = useState([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      // Use PapaParse to parse the CSV content
      const parsedData = Papa.parse(content, { header: true });
      setFileData(parsedData.data);
      setChunkIndex(0); // Reset chunk index when new file is uploaded
      setIsFileUploaded(true);
    };
    reader.readAsText(file);
  };

  // Load next chunk of data when user scrolls to bottom
  const handleScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      renderedData.length < fileData.length
    ) {
      setChunkIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    // Add scroll event listener when component mounts
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Remove scroll event listener when component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, [renderedData]); // Re-add event listener when rendered data changes

  useEffect(() => {
    // Slice the file data into chunks based on CHUNK_SIZE and update renderedData state
    setRenderedData((prevData) => [
      ...prevData,
      ...fileData.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE),
    ]);
  }, [fileData, chunkIndex]);

  return (
    <Applayout>
      {!isFileUploaded ? (
        <div
          className="w-full flex items-center justify-center h-screen overflow-x-auto"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-center animate-fade-in-down">
            <h1 className="text-9xl font-bold mb-4 animate-text-pop">
              Welcome to the Future of Data Visualization
            </h1>
            <p className="text-lg mb-4 animate-text-slide-up">
              Upload your CSV file below to explore your data and create
              interactive visualizations!
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="text-xl mb-4 animate-pop-in"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="m-2 text-gray-300 text-xl">
            <button
              className="flex tooltip tooltip-info tooltip-right"
              data-tip="Close"
              onClick={() => setIsFileUploaded(false)}
            >
              <IoArrowBackCircleOutline className="text-2xl" />
            </button>
          </div>
          <div className="h-screen w-full overflow-x-auto">
            <div className="overflow-x-auto m-2 overflow-y-auto">
              <table className="table table-pin-rows bg-white text-black">
                <thead>
                  <tr className="text-base text-black bg-white ">
                    {fileData.length > 1 && (
                      <th className="border border-gray-400">S.No</th>
                    )}
                    {Object.keys(renderedData[0] || {}).map((key) => (
                      <th className="border border-gray-400" key={key}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {renderedData.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400">{index + 1}</td>
                      {Object.values(row).map((value, index) => (
                        <td className="border border-gray-400" key={index}>
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Applayout>
  );
};

export default Home;
