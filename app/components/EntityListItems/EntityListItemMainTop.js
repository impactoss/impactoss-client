import React, { PropTypes } from 'react';

import Component from 'components/basic/Component';
import Icon from 'components/Icon';

import EntityListItemMainTopReference from './EntityListItemMainTopReference';
import EntityListItemMainTopStatus from './EntityListItemMainTopStatus';
import EntityListItemMainTopIcon from './EntityListItemMainTopIcon';

export default class EntityListItemMainTop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    entityIcon: PropTypes.string,
  };

  render() {
    const { entity, entityIcon } = this.props;

    return (
      <Component>
        <EntityListItemMainTopReference to={entity.linkTo}>{entity.reference}</EntityListItemMainTopReference>
        <EntityListItemMainTopIcon>
          <Icon name={entityIcon} text iconRight />
        </EntityListItemMainTopIcon>
        <EntityListItemMainTopStatus>{entity.status}</EntityListItemMainTopStatus>
      </Component>
    );
  }
}
