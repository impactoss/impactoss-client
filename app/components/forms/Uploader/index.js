import React from 'react';
import ReactS3Uploader from 'react-s3-uploader';
import { getPathFromUrl } from 'utils/string';

import ProgressBar from 'components/ProgressBar';
import DownloadFile from 'components/DownloadFile';

import { API_ENDPOINT, SIGNING_URL_ENDPOINT } from 'containers/App/constants';

class Uploader extends React.Component { // eslint-disable-line react/prefer-stateless-function

  state = {
    progress: null,
    error: null,
  }

  onUploadFinish = ({ signedUrl }) => {
    this.props.onChange(getPathFromUrl(signedUrl));
  }

  onUploadProgress = (progress) => {
    this.setState({
      progress,
    });
  }

  onUploadError = (error) => {
    this.setState({
      error,
    });
  }

  handleRemove = (e) => {
    e.preventDefault();
    this.props.onChange(null);
  }

  modifyFileType = (file, next) => {
    // This is to enable files to download by default, instead of potentially opening in browser
    const newFile = new File([file.slice()], file.name, { type: 'application/octet-stream' });
    next(newFile);
  }

  render() {
    return (
      <span>
        {
          this.props.value &&
          <span>
            <DownloadFile url={this.props.value} />
            <a><button onClick={this.handleRemove}>Remove</button></a>
          </span>
        }
        {
          !this.props.value &&
          <ReactS3Uploader
            signingUrl={SIGNING_URL_ENDPOINT}
            signingUrlMethod="GET"
            signingUrlWithCredentials
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            server={API_ENDPOINT}
            preprocess={this.modifyFileType}
            scrubFilename={(filename) => filename.replace(/(\.[\w\d_-]+)$/i, `_${Date.now()}$1`)}
          />
        }
        <ProgressBar
          progress={this.state.progress}
        />
        {
          this.state.error &&
          this.state.error
        }
      </span>
    );
  }
}

Uploader.propTypes = {
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
};

export default Uploader;
