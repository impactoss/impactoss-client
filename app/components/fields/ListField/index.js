import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import FieldWrap from 'components/fields/FieldWrap';
import ListItem from 'components/fields/ListItem';
import ListLabel from 'components/fields/ListLabel';
import ListLabelWrap from 'components/fields/ListLabelWrap';
import ListLink from 'components/fields/ListLink';
import EmptyHint from 'components/fields/EmptyHint';
import Dot from 'components/fields/Dot';
import DotWrapper from 'components/fields/DotWrapper';
import ItemStatus from 'components/ItemStatus';

const Reference = styled.div`
  color: ${palette('text', 1)};
  font-size: 0.85em;
`;

class ListField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <ListLabelWrap>
          <ListLabel>
            <FormattedMessage {...field.label} />
          </ListLabel>
          {field.entityType &&
            <DotWrapper>
              <Dot palette={field.entityType} pIndex={parseInt(field.id, 10)} />
            </DotWrapper>
          }
        </ListLabelWrap>
        {field.values.map((value, i) => (
          <ListItem key={i}>
            {value.linkTo
              ? <ListLink to={value.linkTo}>
                {value.draft &&
                  <ItemStatus draft />
                }
                {value.reference &&
                  <Reference>
                    {value.reference}
                  </Reference>
                }
                {value.label}
              </ListLink>
              : <div>
                {value.draft &&
                  <ItemStatus draft />
                }
                {value.reference &&
                  <Reference>
                    {value.reference}
                  </Reference>
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
      </FieldWrap>
    );
  }
}

ListField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ListField;
