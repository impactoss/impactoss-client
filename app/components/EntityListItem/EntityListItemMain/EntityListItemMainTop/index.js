import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Component from 'components/styled/Component';
import { isMinSize } from 'utils/responsive';

import ItemStatus from 'components/ItemStatus';
import ItemRole from 'components/ItemRole';
import ItemProgress from 'components/ItemProgress';
import ItemSupport from 'components/ItemSupport';

import { ResponsiveContext } from 'grommet';

import {
  PUBLISH_STATUSES,
  IS_CURRENT_STATUSES,
  IS_ARCHIVE_STATUSES,
} from 'themes/config';

import EntityListItemMainTopReference from './EntityListItemMainTopReference';
import EntityListItemMainTargetDate from './EntityListItemMainTargetDate';
import EntityListItemMainUser from './EntityListItemMainUser';

const EntityListItemMainTop = ({ entity }) => {
  const size = useContext(ResponsiveContext);

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
      {typeof entity.is_current !== 'undefined' && !entity.is_current && (
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
      {
        entity.progressCategory
        && <ItemProgress status={entity.progressCategory} />
      }
      {isMinSize(size, 'small') && entity.support && (
        <ItemSupport supportLevel={entity.support} />
      )}
      { entity.role
        && <ItemRole role={entity.role} />
      }
    </Component>
  );
};

EntityListItemMainTop.propTypes = {
  entity: PropTypes.object.isRequired,
};
export default EntityListItemMainTop;
