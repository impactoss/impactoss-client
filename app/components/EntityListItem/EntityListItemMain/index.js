import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Component from 'components/basic/Component';
import Clear from 'components/basic/Clear';

import EntityListItemMainTop from './EntityListItemMainTop';
import EntityListItemMainTitle from './EntityListItemMainTitle';
import EntityListItemMainBottom from './EntityListItemMainBottom';

const Styled = styled(Component)`
  padding: 5px 10px;
`;

const EntityListItemMainTitleWrap = styled(Link)`
  text-decoration: none;
  display: block;
  padding: 3px 0 8px;
  color: ${palette('greyscaleDark', 0)};
  &:hover {
    color: ${palette('greyscaleDark', 2)};
  }
`;

export default class EntityListItemMain extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    entityIcon: PropTypes.string,
    nested: PropTypes.bool,
  }

  render() {
    const { entity, entityIcon, nested } = this.props;
    return (
      <Styled>
        <EntityListItemMainTop entity={entity} entityIcon={entityIcon} />
        <Clear />
        <EntityListItemMainTitleWrap to={entity.linkTo}>
          <EntityListItemMainTitle nested={nested}>
            {entity.title}
          </EntityListItemMainTitle>
        </EntityListItemMainTitleWrap>
        <EntityListItemMainBottom entity={entity} />
      </Styled>
    );
  }
}
