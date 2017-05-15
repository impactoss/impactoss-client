import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

import appMessages from 'containers/App/messages';


const Styled = styled(Button)`
  padding: 1em;
  width: 100%;
  background-color: ${(props) => props.active ? palette('primary', 0) : palette('primary', 4)};
  color:  ${(props) => props.active ? palette('primary', 4) : palette('greyscaleDark', 2)};
  padding: 0.5em;
  &:hover {
    color: ${(props) => props.active ? palette('primary', 4) : palette('greyscaleDark', 0)};
    background-color: ${(props) => props.active ? palette('primary', 1) : palette('primary', 4)};
  }
  text-align: left;
  border-bottom: 1px solid ${palette('greyscaleLight', 0)}
`;

const TaxTitle = styled.span`
  font-weight: bold;
`;
const TaxIcon = styled.span`
  padding: 0 1.5em;
`;

class TaxonomySidebarItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getTaxTitle = (id) =>
    this.context.intl.formatMessage(appMessages.entities.taxonomies[id].plural);

  render() {
    const { taxonomy } = this.props;
    return (
      <Styled onClick={() => taxonomy.onLink()} active={taxonomy.active}>
        <TaxIcon>
          <Icon name={`taxonomy_${taxonomy.id}`} size="3em" />
        </TaxIcon>
        <TaxTitle>
          {this.getTaxTitle(taxonomy.id)}
        </TaxTitle>
      </Styled>
    );
  }
}

TaxonomySidebarItem.propTypes = {
  taxonomy: PropTypes.object,
};

TaxonomySidebarItem.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TaxonomySidebarItem;
