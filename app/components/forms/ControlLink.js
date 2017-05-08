import React, { PropTypes } from 'react';
import styled from 'styled-components';

const ControlMain = styled.a`
`;

export default class ControlLink extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    text: PropTypes.string,
    path: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  }

  render() {
    return (
      <ControlMain
        href={this.props.path}
        onClick={(evt) => {
          if (evt !== undefined && evt.preventDefault) evt.preventDefault();
          this.props.onClick();
        }}
      >
        {this.props.text}
      </ControlMain>
    );
  }
}
