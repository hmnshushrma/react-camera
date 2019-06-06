import React, { Component } from 'react'
import '../styles/landing.scss'

class PreLanding extends Component {
  constructor() {
    super()
    this.state = {}
    this.videoStream = React.createRef()
    this.captureImage = React.createRef()
    this.canvas = React.createRef()
    this.imagePreview = React.createRef()
    this.capturePicture = this.capturePicture.bind(this)
  }
  componentDidMount() {
    this.playVideo()
  }
  playVideo = () => {
    const videoPlayer = this.videoStream.current
    const constraints = {
      video: true
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        videoPlayer.srcObject = stream
        videoPlayer.play()
      })
    }
  }
  capturePicture = () => {
    const context = this.canvas.current.getContext('2d')
    context.drawImage(this.videoStream.current, 0, 0, 640, 360)
    this.canvas.current.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      console.log(blob, 'blob')
      console.log(url)
      const datablob = this.canvas.current.toDataURL()
      this.setState({ imgUrl: datablob })
    })
  }

  render() {
    const { imgUrl } = this.state
    return (
      <div className="AppContainer">
        <div className="overlay--container">
          <div className="crosshair--overlay" />
          <video ref={this.videoStream} autoPlay />
        </div>

        <button ref={this.captureImage} onClick={this.capturePicture}>
          Capture
        </button>
        <canvas ref={this.canvas} width="640" height="480" className="hidden" />
        <img rev={this.imagePreview} src={imgUrl} className="imagePreview" />
      </div>
    )
  }
}
export default PreLanding
