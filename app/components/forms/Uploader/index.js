import React from 'react';
import ReactS3Uploader from 'react-s3-uploader';

// TODO put in helper
const getPathFromUrl = (url) => url.split(/[?#]/)[0];

class Uploader extends React.Component { // eslint-disable-line react/prefer-stateless-function

  onUploadFinish = (signedUrl) => {
    this.props.onChange(getPathFromUrl(signedUrl.signedUrl));
  }

  onUploadProgress = () => {
    // TODO: handle upload progress -- note int is parameter with value of progress
  }

  onUploadError = () => {
    // TODO: handle error
  }

  render() {
    return (
      <ReactS3Uploader
        signingUrl="/s3/sign"
        signingUrlMethod="GET"
        signingUrlWithCredentials
        onProgress={this.onUploadProgress}
        onError={this.onUploadError}
        onFinish={this.onUploadFinish}
        server="https://undp-sadata-staging.herokuapp.com"
      />
    );
  }
}

Uploader.propTypes = {
  onChange: React.PropTypes.func,
};

export default Uploader;
