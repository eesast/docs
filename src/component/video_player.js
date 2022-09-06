import React, { useState, useEffect } from "react";
import { string } from "prop-types";
import useIsBrowser from "@docusaurus/useIsBrowser";

function Video_player(props) {
  const [link, setLink] = useState("");
  const isBrowser = useIsBrowser();
  useEffect(() => {
    if (isBrowser) {
      if (props.source === "THU") {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {
          setLink(xhr.responseText);
        });
        xhr.open(
          "GET",
          process.env.NODE_ENV === "production"
            ? "https://api.eesast.com/docs/get_video_link?url=" +
                encodeURI(props.url)
            : "http://localhost:28888/docs/get_video_link?url=" +
                encodeURI(props.url)
        );
        xhr.send();
      } else if (props.source === "direct") {
        setLink(props.url);
      } else {
        throw Error("Video source unimplemented error!");
      }
    }
  }, []);

  return (
    <div style={{ position: "relative", padding: "30% 45%" }}>
      <iframe
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
        }}
        src={link}
        frameBorder="no"
        scrolling="no"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
}

Video_player.propTypes = {
  url: string,
  source: string,
};

Video_player.defaultProps = {
  url: "",
  source: "direct",
};

export default Video_player;
