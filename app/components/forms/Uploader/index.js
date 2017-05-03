import React from 'react';
import ReactS3Uploader from 'react-s3-uploader';
import { getPathFromUrl } from 'utils/string';
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

  render() {
    return (
      <div>
        <ReactS3Uploader
          signingUrl={SIGNING_URL_ENDPOINT}
          signingUrlMethod="GET"
          signingUrlWithCredentials
          onProgress={this.onUploadProgress}
          onError={this.onUploadError}
          onFinish={this.onUploadFinish}
          server={API_ENDPOINT}
          scrubFilename={(filename) => filename.replace(/(\.[\w\d_-]+)$/i, `_${Date.now()}$1`)}
        />
        {
          this.state.progress &&
          this.state.progress
        }
        {
          this.state.error &&
          this.state.error
        }
      </div>
    );
  }
}

Uploader.propTypes = {
  onChange: React.PropTypes.func,
};

export default Uploader;
