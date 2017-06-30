import React from 'react';
import PropTypes from 'prop-types';

import FieldWrap from 'components/fields/FieldWrap';
import ListItem from 'components/fields/ListItem';
import ListLabel from 'components/fields/ListLabel';
import ListLink from 'components/fields/ListLink';
import EmptyHint from 'components/fields/EmptyHint';
import Dot from 'components/fields/Dot';
import DotWrapper from 'components/fields/DotWrapper';

class ListField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <ListLabel>
          {field.label}
          {field.entityType &&
            <DotWrapper>
              <Dot palette={field.entityType} pIndex={parseInt(field.id, 10)} />
            </DotWrapper>
          }
        </ListLabel>
        {field.values.map((value, i) => (
          <ListItem key={i}>
            {value.linkTo
              ? <ListLink to={value.linkTo}>{value.label}</ListLink>
              : <p>{value.label}</p>
            }
          </ListItem>
        ))}
        { (!field.values || field.values.length === 0) &&
          <EmptyHint>{field.showEmpty}</EmptyHint>
        }
      </FieldWrap>
    );
  }
}

ListField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ListField;
