import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import A from 'components/styled/A';

const ControlMain = styled(A)``;

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
