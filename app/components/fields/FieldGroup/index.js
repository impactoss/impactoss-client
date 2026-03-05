import React, { useId } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Icon from 'components/Icon';

import FieldFactory from 'components/fields/FieldFactory';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import GroupIcon from 'components/fields/GroupIcon';
import GroupLabel from 'components/fields/GroupLabel';

const FieldGroup = ({
  group,
  seamless,
  aside,
  bottom,
}) => {
  const groupTitleId = useId();
  return (
    <FieldGroupWrapper
      groupType={group.type}
      seamless={seamless}
      aside={aside}
      bottom={bottom}
      as={group.label ? 'section' : 'div'}
      aria-labelledby={group.label ? groupTitleId : null}
    >
      {group.label && (
        <FieldGroupLabel basic={group.type === 'smartTaxonomy'}>
          <GroupLabel id={groupTitleId} as="h2">
            <FormattedMessage {...group.label} />
          </GroupLabel>
          {group.icon && (
            <GroupIcon aria-hidden="true">
              <Icon name={group.icon} />
            </GroupIcon>
          )}
        </FieldGroupLabel>
      )}
      {group.fields.map(
        (field, i) => field
          ? (
            <FieldFactory
              key={i}
              field={Object.assign({}, field, { aside })}
            />
          )
          : null,
      )}
    </FieldGroupWrapper>
  );
};

FieldGroup.propTypes = {
  group: PropTypes.object.isRequired,
  seamless: PropTypes.bool,
  aside: PropTypes.bool,
  bottom: PropTypes.bool,
};

export default FieldGroup;
