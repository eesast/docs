import React, { Component } from 'react'

class Video_player extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: null
    }
  }

  componentWillMount() {
    if (this.props.source === "THU") {
      let xhr = new XMLHttpRequest()
      xhr.addEventListener('load', () => {
        this.setState({link: xhr.responseText})
      })
      xhr.open('GET', "http://localhost:28888/docs/get_video_link?url=" + encodeURI(this.props.url))
      xhr.send()
    }
    else if (this.props.source === "direct") {
      this.setState({link: this.props.url})
    }
    else {
      throw(Error("Video source unimplemented error!"))
    }
  }

  render() {
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
          src={this.state.link}
          frameborder="no"
          scrolling="no"
          allowfullscreen="true"
        ></iframe>
      </div>
    )
  }
}

export default Video_player;
