import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import appMessages from 'containers/App/messages';

import Icon from 'components/Icon';
import FieldWrap from 'components/fields/FieldWrap';
import ListInline from 'components/fields/ListInline';
import ListInlineItem from 'components/fields/ListInlineItem';
import ListLink from 'components/fields/ListLink';

const StyledFieldWrap = styled(FieldWrap)`
  padding-top: 15px;
  font-size: 0.65em;
`;

const SmartLabel = styled.div`
  font-weight: bold;
  line-height: 1;
`;
const SmartLabelMet = styled.div``;

const SmartIcon = styled.div`
  display: inline-block;
  border-radius: 999px;
  text-align: center;
  vertical-align: middle;
  background-color: ${(props) => props.active ? palette('taxonomies', props.pIndex) : palette('smartInactive', 0)};
  color: ${(props) => props.active ? palette('text', 2) : palette('smartInactive', 2)};
  margin-bottom: 5px;
  padding: 5px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 10px;
    padding: 14px;
  }
`;

class SmartTaxonomyField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { field } = this.props;

    return (
      <StyledFieldWrap>
        <ListInline>
          {field.values.map((value, i) => (
            <ListInlineItem key={i} itemWidth={100 / field.values.length}>
              <ListLink
                to={value.linkTo}
                paletteName={value.isSmart ? field.entityType : 'text'}
                pIndex={value.isSmart ? parseInt(field.id, 10) : 1}
                paletteHover={value.isSmart ? `${field.entityType}Hover` : 'text'}
                pIndexHover={value.isSmart ? parseInt(field.id, 10) : 0}
                title={value.label}
              >
                <SmartIcon active={value.isSmart} pIndex={parseInt(field.id, 10)}>
                  <Icon
                    name={`smart_${i}`}
                    title={`${value.label}: ${this.context.intl.formatMessage(value.isSmart ? appMessages.labels.smart.met : appMessages.labels.smart.notMet)}`}
                    size="40px"
                    sizes={{ mobile: '30px' }}
                  />
                </SmartIcon>
                <SmartLabel>{value.label}</SmartLabel>
                <SmartLabelMet>
                  {this.context.intl.formatMessage(value.isSmart ? appMessages.labels.smart.met : appMessages.labels.smart.notMet)}
                </SmartLabelMet>
              </ListLink>
            </ListInlineItem>
          ))}
        </ListInline>
      </StyledFieldWrap>
    );
  }
}

SmartTaxonomyField.propTypes = {
  field: PropTypes.object.isRequired,
};
SmartTaxonomyField.contextTypes = {
  intl: PropTypes.object,
};

export default SmartTaxonomyField;
