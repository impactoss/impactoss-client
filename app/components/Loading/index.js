import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

// import ProgressBar from 'components/ProgressBar';
// import messages from './messages';

const ANIMATION_INTERVAL = 10;
const ANIMATION_STEP = 1;
const ANIMATION_WIDTH = 20;

const Styled = styled.div`
  display: block;
  width: 100%;
  height: 3px;
  position: relative;
  background-color: ${palette('light', 2)};
  overflow: hidden;
  margin-top: -3px;
  z-index: 2;
`;
const Bar = styled.div`
  display: block;
  height: 3px;
  position: relative;
  background-color: ${palette('primary', 2)};
  left: 0;
`;
const BarDeterminate = styled(Bar)`
  width: ${(props) => props.progress}%
`;
const BarIndeterminate = styled(Bar)`
  width: ${ANIMATION_WIDTH}%;
  left: ${(props) => props.progress}%;
`;


class Loading extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = { progress: -ANIMATION_WIDTH };
  }
  componentDidMount() {
    // console.log('componentDidMount', this.state.progress)
    this.loadInterval = this.props.progress < 0
      ? setInterval(this.handleTimeout, ANIMATION_INTERVAL)
      : false;
  }
  componentWillReceiveProps(nextProps) {
    if (this.loadInterval && nextProps.progress >= 0) {
      this.resetTimer();
    }
  }
  componentWillUnmount() {
    this.resetTimer();
  }
  resetTimer = () => {
    if (this.loadInterval) {
      clearInterval(this.loadInterval);
      this.loadInterval = false;
    }
  }
  handleTimeout = () => {
    // Added timeout
    this.setState({ progress: this.state.progress < 100 ? (this.state.progress + ANIMATION_STEP) : 0 });
  }
  render() {
    return (
      <Styled>
        {this.props.progress >= 0 &&
          <BarDeterminate progress={Math.max(this.props.progress, 5)} />
        }
        {this.props.progress < 0 &&
          <BarIndeterminate progress={this.state.progress} />
        }
      </Styled>
    );
  }
}

Loading.propTypes = {
  progress: PropTypes.number,
};

Loading.defaultProps = {
  progress: -1,
};

export default Loading;
