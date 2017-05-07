import React, { PropTypes } from 'react';
import styled from 'styled-components';

import Component from 'components/basic/Component';
import Clear from 'components/basic/Clear';

import EntityListItemMainTop from './EntityListItemMainTop';
import EntityListItemMainTitle from './EntityListItemMainTitle';
import EntityListItemMainBottom from './EntityListItemMainBottom';

const Main = styled(Component)`
  background: #fff;
  display: table-cell;
`;

export default class EntityListItemMain extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
  }

  render() {
    const { entity } = this.props;
    return (
      <Main>
        <EntityListItemMainTop entity={entity} />
        <Clear />
        <EntityListItemMainTitle to={entity.linkTo}>{entity.title}</EntityListItemMainTitle>
        <EntityListItemMainBottom entity={entity} />
      </Main>
    );
  }
}
