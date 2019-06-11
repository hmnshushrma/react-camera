import React, { Component } from 'react'
import '../styles/landing.scss'

class PreLanding extends Component {
  constructor() {
    super()
    this.state = {}
    this.videoStream = React.createRef()
    this.captureImage = React.createRef()
    this.canvas = React.createRef()
    // this.imagePreview = React.createRef()
    this.capturePicture = this.capturePicture.bind(this)
    this.onInputSelect = this.onInputSelect.bind(this)
  }

  componentDidMount() {
    this.playVideo()
  }

  getCameraDevices = async () => {
    const nativeDevices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = nativeDevices.filter(
      device => device.kind === 'videoinput'
    )
    return videoDevices
  }

  onInputSelect = (e, args) => {
    this.setState({ selectedDevice: e.target.value })
    this.playVideo()
  }

  playVideo = async () => {
    let deviceAvaliable = await this.getCameraDevices()
    const videoPlayer = this.videoStream.current
    const { selectedDevice } = this.state
    console.log(selectedDevice, 'selectedDevice')

    if (deviceAvaliable) {
      this.setState({ sources: deviceAvaliable })

      // let devices = deviceAvaliable.map(dev => {
      //   return dev.deviceId
      // })
      const videoConstraints = {}
      if (selectedDevice === '' || typeof selectedDevice === 'undefined') {
        videoConstraints.facingMode = 'environment'
      } else {
        videoConstraints.deviceId = { exact: selectedDevice }
        videoConstraints.width = 400
        videoConstraints.height = 600
      }

      const constraints = {
        video: videoConstraints,
        audio: false
      }
      console.log(videoConstraints)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
          videoPlayer.srcObject = stream
          videoPlayer.play()
        })
      }
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
    const { imgUrl, sources } = this.state
    // let sources = ''
    let imageTag
    if (imgUrl) {
      imageTag = <img src={imgUrl} className="imagePreview" alt="description" />
    } else {
      imageTag = <p>not captured</p>
    }
    let optionItems
    if (sources) {
      optionItems = sources.map(device => (
        <option key={device.groupId} value={device.deviceId}>
          {device.label}
        </option>
      ))
    } else {
      optionItems = (
        <option value="volvo" disabled>
          No Camera Device Found
        </option>
      )
    }

    return (
      <div className="AppContainer">
        <div className="video--container">
          <div className="overlay--container">
            <div class="top left" />
            <div class="top right" />
            <div class="bottom right" />
            <div class="bottom left" />
          </div>
          <video ref={this.videoStream} autoPlay preload="none" />
        </div>
        <button
          ref={this.captureImage}
          onClick={this.capturePicture}
          className="capture"
        >
          Capture
        </button>

        <canvas ref={this.canvas} width="640" height="480" className="hidden" />
        {imageTag}

        <select value={this.state.value} onClick={this.onInputSelect}>
          {optionItems}
        </select>
      </div>
    )
  }
}
export default PreLanding
