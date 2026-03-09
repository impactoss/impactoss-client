import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { injectIntl } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import appMessages from 'containers/App/messages';

import ButtonTagCategory from 'components/buttons/ButtonTagCategory';
import ButtonTagCategoryInverse from 'components/buttons/ButtonTagCategoryInverse';
import Icon from 'components/Icon';

import { truncateText } from 'utils/string';
import { TEXT_TRUNCATE } from 'themes/config';

const SmartGroup = styled.div`
  display: inline-block;
  margin-right: 0.5em;
  padding-right: 0.5em;
  border-right: ${(props) => props.border ? '1px solid' : 'none'};
  border-right-color: ${palette('light', 3)};
`;
const Group = styled.div`
  display: inline;
  margin-right: 2px;
`;
const IconWrap = styled.div`
  display: inline-block;
  margin-right: 2px;
  position: relative;
  top: -1px;
  left: -2px;
`;
const Styled = styled.div`
  width: 100%;
  display: block;
  padding-top: 3px;
  margin-top: 0px;
  @media print {
    padding-top: 2px;
    margin-top: 0px;
  }
`;
// border-top-color:;

class EntityListItemMainTaxonomies extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getEntityTags = (categories, taxonomies, onClick) => {
    const tagsByTax = {};
    if (categories) {
      taxonomies
        .filter((tax) => !tax.getIn(['attributes', 'is_smart']))
        .sortBy((tax) => tax.getIn(['attributes', 'priority']))
        .forEach((tax) => {
          const taxId = tax.get('id');
          tax
            .get('categories')
            .sortBy((category) => category.getIn(['attributes', 'draft']))
            .forEach((category, catId) => {
              if (categories.includes(parseInt(catId, 10))) {
                const label = (category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
                  ? category.getIn(['attributes', 'short_title'])
                  : category.getIn(['attributes', 'title']));
                const title = category.getIn(['attributes', 'title']);
                if (!tagsByTax[taxId]) {
                  tagsByTax[taxId] = [];
                }
                tagsByTax[taxId].push({
                  taxId,
                  title,
                  catId: category.get('id'),
                  inverse: category.getIn(['attributes', 'draft']),
                  label: truncateText(label, TEXT_TRUNCATE.ENTITY_TAG, categories.size < 5),
                  onClick: () => onClick(catId, 'category'),
                });
              }
            });
        });
    }
    return tagsByTax;
  };

  getSmartTitle = (title, isSmart, intl) =>
    intl
      ? `${title}: ${intl.formatMessage(isSmart ? appMessages.labels.smart.met : appMessages.labels.smart.notMet)}`
      : title;

  getEntitySmartTags = (categories, smartTaxonomy, onClick, intl) => {
    const tags = [];
    smartTaxonomy
      .get('categories')
      .forEach((category, catId) => {
        const label = (category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
          ? category.getIn(['attributes', 'short_title'])
          : category.getIn(['attributes', 'title']));
        const isSmart = categories && categories.includes(parseInt(catId, 10));
        tags.push({
          taxId: smartTaxonomy.get('id'),
          title: this.getSmartTitle(category.getIn(['attributes', 'title']), isSmart, intl),
          isSmart,
          label: truncateText(label, TEXT_TRUNCATE.ENTITY_TAG, false),
          onClick: () => onClick(catId, 'category'),
        });
      });
    return tags;
  };


  render() {
    const {
      categories, taxonomies, onEntityClick, intl,
    } = this.props;
    const smartTaxonomy = taxonomies && taxonomies.find((tax) => tax.getIn(['attributes', 'is_smart']));
    const entityTags = categories && this.getEntityTags(categories, taxonomies, onEntityClick);
    return (
      <Styled role="group" aria-label="Category groups">
        {smartTaxonomy && (
          <SmartGroup
            border={entityTags && entityTags.length > 0}
            role="group"
            aria-label="SMART criteria"
          >
            {this.getEntitySmartTags(categories, smartTaxonomy, onEntityClick, intl).map((tag, i) => (
              <ButtonTagCategory
                key={i}
                onClick={tag.onClick}
                taxId={parseInt(tag.taxId, 10)}
                title={tag.title}
                aria-label={tag.label}
                isSmartTag
                isSmart={tag.isSmart}
              >
                {tag.label}
              </ButtonTagCategory>
            ))}
          </SmartGroup>
        )}
        {entityTags && Object.keys(entityTags).map((taxId) => {
          const tags = entityTags[taxId];
          if (tags && tags.length > 0) {
            return (
              <Group
                key={taxId}
                role="group"
                aria-label={intl.formatMessage(
                  appMessages.entities.taxonomies[taxId].shortSingle,
                )}
              >
                {tags.map((tag) => tag.inverse
                  ? (
                    <ButtonTagCategoryInverse
                      key={tag.catId}
                      onClick={tag.onClick}
                      taxId={parseInt(tag.taxId, 10)}
                      disabled={!tag.onClick}
                      title={tag.title}
                      aria-label={tag.label}
                    >
                      <IconWrap>
                        <Icon name={`taxonomy_small_${taxId}`} size="15px" />
                      </IconWrap>
                      {tag.label}
                    </ButtonTagCategoryInverse>
                  )
                  : (
                    <ButtonTagCategory
                      key={tag.catId}
                      onClick={tag.onClick}
                      taxId={parseInt(tag.taxId, 10)}
                      disabled={!tag.onClick}
                      title={tag.title}
                      aria-label={tag.label}
                    >
                      <IconWrap>
                        <Icon
                          name={`taxonomy_small_${taxId}`}
                          color="white"
                          size="15px"
                          aria-hidden="true"
                        />
                      </IconWrap>
                      {tag.label}
                    </ButtonTagCategory>
                  ))
                }
              </Group>
            );
          }
          return null;
        })}
      </Styled>
    );
  }
}

EntityListItemMainTaxonomies.propTypes = {
  categories: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  onEntityClick: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EntityListItemMainTaxonomies);
