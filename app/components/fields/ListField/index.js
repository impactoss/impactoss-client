import React, { PropTypes } from 'react';
import styled from 'styled-components';

import FieldWrap from 'components/fields/FieldWrap';
import ListItem from 'components/fields/ListItem';
import ListLabel from 'components/fields/ListLabel';
import ListLink from 'components/fields/ListLink';
import EmptyHint from 'components/fields/EmptyHint';
import Dot from 'components/fields/Dot';
import DotWrapper from 'components/fields/DotWrapper';

const Styled = styled(FieldWrap)`
  padding: 20px 0;
`;

class ListField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <Styled>
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
      </Styled>
    );
  }
}

ListField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ListField;
