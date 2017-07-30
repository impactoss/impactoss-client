import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

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
const Id = styled.div`
  font-weight: 500;
  color: ${palette('dark', 4)}
`;

class ListField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <Styled>
        <ListLabel>
          <FormattedMessage {...field.label} />
          {field.entityType &&
            <DotWrapper>
              <Dot palette={field.entityType} pIndex={parseInt(field.id, 10)} />
            </DotWrapper>
          }
        </ListLabel>
        {field.values.map((value, i) => (
          <ListItem key={i}>
            {value.linkTo
              ? <ListLink to={value.linkTo}>
                {value.reference &&
                  <Id>
                    {value.reference}
                  </Id>
                }
                {value.label}
              </ListLink>
              : <div>
                {value.reference &&
                  <Id>
                    {value.reference}
                  </Id>
                }
                {value.label}
              </div>
            }
          </ListItem>
        ))}
        { field.showEmpty && (!field.values || field.values.length === 0) &&
          <EmptyHint>
            <FormattedMessage {...field.showEmpty} />
          </EmptyHint>
        }
      </Styled>
    );
  }
}

ListField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ListField;
