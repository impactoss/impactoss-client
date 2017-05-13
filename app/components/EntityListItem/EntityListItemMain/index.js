import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Component from 'components/basic/Component';
import Clear from 'components/basic/Clear';

import EntityListItemMainTop from './EntityListItemMainTop';
import EntityListItemMainTitle from './EntityListItemMainTitle';
import EntityListItemMainBottom from './EntityListItemMainBottom';

const Main = styled(Component)`
  background-color: ${palette('primary', 4)};
  display: table-cell;
  padding: 5px;
`;

export default class EntityListItemMain extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    entityIcon: PropTypes.string,
  }

  render() {
    const { entity, entityIcon } = this.props;
    return (
      <Main>
        <EntityListItemMainTop entity={entity} entityIcon={entityIcon} />
        <Clear />
        <EntityListItemMainTitle to={entity.linkTo}>
          {entity.title}
        </EntityListItemMainTitle>
        <EntityListItemMainBottom entity={entity} />
      </Main>
    );
  }
}
