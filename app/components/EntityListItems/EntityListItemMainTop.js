import React, { PropTypes } from 'react';

import Component from 'components/basic/Component';

import EntityListItemMainTopReference from './EntityListItemMainTopReference';
import EntityListItemMainTopStatus from './EntityListItemMainTopStatus';

export default class EntityListItemMainTop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  render() {
    const { entity } = this.props;

    return (
      <Component>
        <EntityListItemMainTopReference to={entity.linkTo}>{entity.reference}</EntityListItemMainTopReference>
        <EntityListItemMainTopStatus>{entity.status}</EntityListItemMainTopStatus>
      </Component>
    );
  }
}
