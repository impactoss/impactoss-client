import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Updated = styled.span`
  font-size: 0.8em;
  color: #999;
  padding-left: 10px;
`;

export default class EntityListItemMainBottomUpdated extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    updated: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Updated>{this.props.updated}</Updated>
    );
  }
}
