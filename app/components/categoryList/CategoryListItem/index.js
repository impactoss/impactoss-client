import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import ItemStatus from 'components/ItemStatus';
import Clear from 'components/styled/Clear';
import { PATHS } from 'containers/App/constants';

import { attributesEqual } from 'utils/entities';
import appMessages from 'containers/App/messages';

const Styled = styled.button`
  width:100%;
  cursor: pointer;
  text-align: left;
  color: ${palette('mainListItem', 0)};
  background-color: ${palette('mainListItem', 1)};
  margin: 0;
  padding: 5px 0;
  display: block;
  margin-bottom: 2px;
  line-height: 1.428571429;
  &:hover {
    color: ${palette('mainListItemHover', 0)};
    background-color: ${palette('mainListItemHover', 1)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0.75em 0;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 1em 0;
  }
`;
const Column = styled.div`
  width: ${(props) => props.colWidth}%;
  display: inline-block;
  vertical-align: middle;
`;
const BarWrap = styled.div`
  width:100%;
  vertical-align: middle;
  padding: 10px 6px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-left: 40px;
    padding-right: ${(props) => props.secondary ? 36 : 18}px;
  }
`;
const Bar = styled.div`
  width:${(props) => props.length}%;
  height: 15px;
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  vertical-align: middle;
  display: inline-block;
  position: relative;
  border-right: ${(props) => props.secondary ? '1px solid' : 0};
  border-right-color: ${palette('mainListItem', 1)};
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    height: 25px;
  }
`;
const Count = styled.div`
  position: absolute;
  line-height: 15px;
  left: 0;
  bottom: 100%;
  padding: 2px 0;
  color: ${(props) => palette(props.palette, 0)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.text.aaLargeBold};
    font-weight: bold;
    text-align: right;
    padding: 0 5px 0 0;
    right: 100%;
    bottom: auto;
    left: auto;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    line-height: 25px;
  }
`;
const CountSecondary = styled(Count)`
  right: 0;
  top: 100%;
  color: ${(props) => palette(props.palette, 1)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    text-align: left;
    padding: 0 0 0 5px;
    left: 100%;
    right: auto;
    bottom: auto;
    top: auto;
  }
`;
const Title = styled.div`
  display: inline-block;
  padding: 0 4px;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0 8px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0 18px;
    font-size: ${(props) => props.theme.sizes.text.aaLargeBold};
  }
`;
const StatusWrap = styled.div`
  padding: 0 18px;
`;
const Reference = styled.span`
  float: left;
  padding-right: 5px;
  color: ${palette('text', 1)};
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-right: 8px;
  }
`;

class CategoryListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderSimpleBar = (col, total) => (
    <Bar
      length={(total / col.maxCount) * 100}
      palette={col.attribute.entity}
    >
      <Count palette={col.attribute.entity}>
        {total}
      </Count>
    </Bar>
  );
  renderAcceptedBar = (col, total, accepted) => {
    const noted = total - accepted;
    return (
      <span>
        <Bar
          length={(accepted / col.maxCount) * 100}
          palette={col.attribute.entity}
          secondary
        >
          <Count palette={col.attribute.entity}>
            {accepted}
          </Count>
        </Bar>
        { noted > 0 &&
          <Bar
            length={(noted / col.maxCount) * 100}
            palette={col.attribute.entity}
            pIndex={1}
          >
            <CountSecondary palette={col.attribute.entity}>
              {noted}
            </CountSecondary>
          </Bar>
        }
      </span>
    );
  };
  renderCountColumn = (col, category, frameworks, frameworkId) => {
    if (!col.attribute) {
      return null;
    }
    const fwSet = frameworkId && frameworkId !== 'all';
    const countsByFramework = col.attribute.frameworkIds;
    if (countsByFramework) {
      const total = category[col.attribute.totalByFw];
      const accepted = category[col.attribute.acceptedByFw];
      if (!fwSet) {
        return (
          <div>
            {col.attribute.frameworkIds.map((id) => {
              const framework = frameworks.find((fw) => attributesEqual(fw.get('id'), id));
              const hasResponse = framework.getIn(['attributes', 'has_response']);
              return (
                <div key={id}>
                  {col.attribute.frameworkIds.length > 1 && (
                    <div>
                      {this.context.intl.formatMessage(appMessages.entities[`recommendations_${id}`].plural)}
                    </div>
                  )}
                  {hasResponse && (
                    <BarWrap secondary>
                      {this.renderAcceptedBar(col, total[id] || 0, accepted[id] || 0)}
                    </BarWrap>
                  )}
                  {!hasResponse && (
                    <BarWrap>
                      {this.renderSimpleBar(col, total[id] || 0)}
                    </BarWrap>
                  )}
                </div>
              );
            })}
          </div>
        );
      } else if (fwSet) {
        const id = frameworkId;
        const framework = frameworks.find((fw) => attributesEqual(fw.get('id'), id));
        const hasResponse = framework.getIn(['attributes', 'has_response']);
        return (
          <div>
            {hasResponse && (
              <BarWrap secondary>
                {this.renderAcceptedBar(col, total[id] || 0, accepted[id] || 0)}
              </BarWrap>
            )}
            {!hasResponse && (
              <BarWrap>
                {this.renderSimpleBar(col, total[id] || 0)}
              </BarWrap>
            )}
          </div>
        );
      }
    }
    const total = category[col.attribute.total];
    return (
      <BarWrap>
        {this.renderSimpleBar(col, total)}
      </BarWrap>
    );
    // return null;
  };
  render() {
    const { category, columns, onPageLink, frameworks, frameworkId } = this.props;
    // return null;
    const catItem = {
      id: category.get('id'),
      reference:
        category.getIn(['attributes', 'reference']) &&
        category.getIn(['attributes', 'reference']).trim() !== ''
          ? category.getIn(['attributes', 'reference'])
          : null,
      title: category.getIn(['attributes', 'title']),
      draft: category.getIn(['attributes', 'draft']),
    };
    return (
      <Styled
        onClick={() => onPageLink(`${PATHS.CATEGORIES}/${catItem.id}`)}
      >
        {
          columns.map((col, i) => (
            <Column key={i} colWidth={col.width}>
              {col.type === 'title' && catItem.draft && (
                <StatusWrap>
                  <ItemStatus draft />
                  <Clear />
                </StatusWrap>
              )}
              {col.type === 'title' && (
                <Title>
                  { catItem.reference &&
                    <Reference>{catItem.reference}</Reference>
                  }
                  {catItem.title}
                </Title>
              )}
              {col.type === 'count' &&
                this.renderCountColumn(col, category.toJS(), frameworks, frameworkId)
              }
            </Column>
          ))
        }
      </Styled>
    );
  }
}
//           {this.renderColumnContent(col, category)}

CategoryListItem.propTypes = {
  category: PropTypes.object,
  frameworks: PropTypes.object,
  columns: PropTypes.array,
  onPageLink: PropTypes.func,
  frameworkId: PropTypes.string,
};

CategoryListItem.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default CategoryListItem;
