import React from 'react';
import PropTypes from 'prop-types';

import Component from 'components/styled/Component';
import Icon from 'components/Icon';

import ItemStatus from 'components/ItemStatus';
import ItemRole from 'components/ItemRole';
import ItemProgress from 'components/ItemProgress';

import {
  PUBLISH_STATUSES,
  IS_CURRENT_STATUSES,
  IS_ARCHIVE_STATUSES,
} from 'themes/config';

import EntityListItemMainTopReference from './EntityListItemMainTopReference';
import EntityListItemMainTopIcon from './EntityListItemMainTopIcon';
import EntityListItemMainTargetDate from './EntityListItemMainTargetDate';
import EntityListItemMainUser from './EntityListItemMainUser';


export default class EntityListItemMainTop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  render() {
    const { entity } = this.props;
    return (
      <Component>
        {entity.draft && (
          <ItemStatus
            value={entity.draft.toString()}
            float="left"
            options={PUBLISH_STATUSES}
          />
        )}
        {entity.is_archive && (
          <ItemStatus
            value={entity.is_archive.toString()}
            float="left"
            options={IS_ARCHIVE_STATUSES}
          />
        )}
        {!entity.is_current && (
          <ItemStatus
            value={entity.is_current ? entity.is_current.toString() : 'false'}
            float="left"
            options={IS_CURRENT_STATUSES}
          />
        )}
        <EntityListItemMainTopReference>
          {entity.reference}
        </EntityListItemMainTopReference>
        { entity.targetDate
          && (
            <EntityListItemMainTargetDate
              targetDate={entity.targetDate}
            />
          )
        }
        { entity.assignedUser
          && (
            <EntityListItemMainUser
              user={entity.assignedUser}
            />
          )
        }
        { entity.entityIcon
          && (
            <EntityListItemMainTopIcon>
              <Icon name={entity.entityIcon} text />
            </EntityListItemMainTopIcon>
          )
        }
        {
          entity.progressCategory
          && <ItemProgress status={entity.progressCategory} />
        }
        { entity.role
          && <ItemRole role={entity.role} />
        }
      </Component>
    );
  }
}
