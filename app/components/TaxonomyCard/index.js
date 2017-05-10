import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

import appMessages from 'containers/App/messages';
import messages from './messages';


const Styled = styled(Button)`
  padding: 1em;
  width: 100%;
  max-width: 300px;
  background-color: ${palette('primary', 4)};
  margin-bottom:${(props) => 2 * props.theme.gutter}px;
  color: ${palette('greyscaleDark', 2)};
  box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.2);
  &:hover {
    color: ${palette('greyscaleDark', 0)};
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);
  }
`;
const Top = styled.div`
  text-align: center;
`;
const Bottom = styled.div`
  text-align: left;
`;
const TaxGraphicWrapper = styled.div`
  padding: 1.5em;
`;
const TaxGraphic = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  height: 0;
  border-radius:999px;
  background-color: ${palette('secondary', 0)};
  color: ${palette('primary', 4)};

`;
const TaxIcon = styled.div`
  position: absolute;
  top: 50%;
  margin: 0 auto;
  width: 100%;
  margin-top: -20%;
`;
const TaxTitle = styled.span`
  border-bottom: 1px solid;
  text-align: left;
  font-size: 1.25em;
  padding-bottom: 0.25em;
`;
const TaxTagging = styled.div`
  padding: 2em 0 1em;
  font-size: 0.85em;
  color: ${palette('greyscaleLight', 4)};
`;
const TaxTaggingIcons = styled.div`
`;
const TaxTaggingIcon = styled.span`
  color: ${palette('greyscaleLight', 4)};
  border-right: 1px solid;
  border-color: ${(props) => props.last ? 'transparent' : palette('greyscaleLight', 4)};
`;


class TaxonomyCard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  // const title = count === 1
  //   ? this.context.intl.formatMessage(appMessages.entities.taxonomies[id].single)
  //   : this.context.intl.formatMessage(appMessages.entities.taxonomies[id].plural);
  // return `${count} ${title}`;
  getTaxTitle = (id) =>
    this.context.intl.formatMessage(appMessages.entities.taxonomies[id].plural);

  render() {
    const { taxonomy } = this.props;
    return (
      <Styled onClick={() => taxonomy.onLink()} >
        <Top>
          <TaxGraphicWrapper>
            <TaxGraphic>
              <TaxIcon>
                <Icon name={`taxonomy_${taxonomy.id}`} size={'40%'} />
              </TaxIcon>
            </TaxGraphic>
          </TaxGraphicWrapper>
        </Top>
        <Bottom>
          <TaxTitle>
            {this.getTaxTitle(taxonomy.id, taxonomy.count)}
          </TaxTitle>
          { taxonomy.tags &&
            <div>
              <TaxTagging>
                <FormattedMessage {...messages.tagging} />
                {
                  taxonomy.tags.map((tag, i) =>
                    (`${this.context.intl.formatMessage(appMessages.entities[tag.type].plural)}${i < (taxonomy.tags.length - 1) ? ', ' : ''}`)
                  )
                }
              </TaxTagging>
              <TaxTaggingIcons>
                {
                  taxonomy.tags.map((tag, i) =>
                    (
                      <TaxTaggingIcon key={i} last={i === (taxonomy.tags.length - 1)}>
                        <Icon name={tag.icon} />
                      </TaxTaggingIcon>
                    )
                  )
                }
              </TaxTaggingIcons>
            </div>
          }
        </Bottom>
      </Styled>
    );
  }
}

TaxonomyCard.propTypes = {
  taxonomy: PropTypes.object,
};

TaxonomyCard.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TaxonomyCard;
