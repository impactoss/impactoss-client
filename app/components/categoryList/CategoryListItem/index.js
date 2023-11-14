import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import ItemStatus from 'components/ItemStatus';
import Clear from 'components/styled/Clear';
import { PATHS } from 'containers/App/constants';

import { qe } from 'utils/quasi-equals';
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
  @media print {
    padding: 1em 0;
    border-top: 1px solid ${palette('light', 1)};
  }
`;
const TableWrap = styled.div`
  width:100%;
  display: table;
  table-layout: fixed;
`;

const Column = styled.div`
  width: ${(props) => props.colWidth}%;
  display: table-cell;
  vertical-align: middle;
`;
const BarWrap = styled.div`
  width:100%;
  vertical-align: middle;
  font-size: 0px;
  padding: ${({ multiple }) => multiple ? '4px 6px' : '10px 6px'};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-top: ${({ multiple }) => multiple ? 0 : 10}px;
    padding-bottom: ${({ multiple }) => multiple ? 8 : 10}px;
    padding-right: ${({ secondary }) => secondary ? 36 : 18}px;
    padding-left: 40px;
  }
  @media print {
    padding-top: ${({ multiple }) => multiple ? 0 : 4}px;
    padding-right: ${({ secondary }) => secondary ? 24 : 14}px;
    padding-bottom: 4px;
    padding-left: 24px;
  }
`;
const Bar = styled.div`
  width: ${({ length }) => length}%;
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  vertical-align: middle;
  display: inline-block;
  position: relative;
  border-right: ${(props) => props.secondary ? '1px solid' : 0};
  border-right-color: ${palette('mainListItem', 1)};
  height: ${({ multiple }) => multiple ? 8 : 16}px;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    height: ${({ multiple }) => multiple ? 12 : 24}px;
  }
  @media print {
    z-index: 0;
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      border-bottom: ${({ multiple }) => (multiple ? 8 : 16)}px solid ${(props) => palette(props.palette, props.pIndex || 0)};
    }
  }
`;
const Count = styled.div`
  display: none;
  position: absolute;
  line-height: ${({ multiple }) => multiple ? 8 : 16}px;
  left: 0;
  bottom: 100%;
  padding: 2px 0;
  color: ${(props) => palette(props.palette, 0)};
  white-space: nowrap;
  @media print, (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: block;
    font-size: ${({ theme, multiple }) => multiple ? theme.sizes.text.default : theme.sizes.text.aaLargeBold};
    font-weight: bold;
    text-align: right;
    padding: 0 5px 0 0;
    right: 100%;
    bottom: auto;
    left: auto;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    line-height: ${({ multiple }) => multiple ? 12 : 24}px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
    font-weight: regular;
  }
`;
const CountSecondary = styled(Count)`
  right: 0;
  top: 100%;
  color: ${(props) => palette(props.palette, 1)};
  @media print, (min-width: ${(props) => props.theme.breakpoints.small}) {
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
  font-size: ${(props) => props.theme.sizes.text.smaller};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 8px;
    font-size: ${(props) => props.theme.sizes.text.default};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 18px;
    font-size: ${(props) => props.theme.sizes.text.aaLargeBold};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
    padding: 0;
  }
`;
const FrameworkLabel = styled.div`
  display: none;
  font-size: ${(props) => props.theme.sizes.text.smaller};
  color: ${palette('text', 1)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-left: 40px;
    display: block;
  }
  @media print {
    padding-left: 24px;
    font-size: ${(props) => props.theme.sizes.print.smallest};
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
const WrapAcceptedBars = styled.span`
  height: ${({ multiple }) => multiple ? 10 : 15}px;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    height: ${({ multiple }) => multiple ? 15 : 25}px;
  }
`;

class CategoryListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderSimpleBar = (col, total, multiple) => (
    <Bar
      length={(total / col.maxCount) * 100}
      palette={col.attribute.entity}
      multiple={multiple}
    >
      <Count palette={col.attribute.entity} multiple={multiple}>
        {total}
      </Count>
    </Bar>
  );

  renderAcceptedBar = (col, total, accepted, multiple) => {
    const noted = total - accepted;
    return (
      <WrapAcceptedBars multiple={multiple}>
        <Bar
          length={(accepted / col.maxCount) * 100}
          palette={col.attribute.entity}
          secondary
          multiple={multiple}
        >
          <Count palette={col.attribute.entity} multiple={multiple}>
            {accepted}
          </Count>
        </Bar>
        { noted > 0
          && (
            <Bar
              length={(noted / col.maxCount) * 100}
              palette={col.attribute.entity}
              pIndex={1}
              multiple={multiple}
            >
              <CountSecondary palette={col.attribute.entity} multiple={multiple}>
                {noted}
              </CountSecondary>
            </Bar>
          )
        }
      </WrapAcceptedBars>
    );
  };

  renderCountColumn = (col, category, frameworks, frameworkId) => {
    if (!col.attribute) {
      return null;
    }
    const fwSet = frameworkId && frameworkId !== 'all';
    const countsByFramework = col.attribute.frameworkIds;
    const connected = col.attribute.entity === 'measures';
    if (countsByFramework) {
      const total = category[col.attribute.totalByFw];
      const accepted = category[col.attribute.acceptedByFw];
      if (!fwSet) {
        return (
          <div>
            {col.attribute.frameworkIds.map((id) => {
              const framework = frameworks.find((fw) => qe(fw.get('id'), id));
              if (!framework) {
                return null;
              }
              const hasResponse = !connected && framework.getIn(['attributes', 'has_response']);
              const multipleFWs = col.attribute.frameworkIds.length > 1;
              const totalCount = (total && total[id]) || 0;
              if (totalCount === 0) {
                return null;
              }
              return (
                <div key={id}>
                  {multipleFWs && (
                    <FrameworkLabel>
                      {connected && (<span>&nbsp;</span>)}
                      {!connected && appMessages.entities[`recommendations_${id}`] && (
                        <FormattedMessage {...appMessages.entities[`recommendations_${id}`].plural} />
                      )}
                    </FrameworkLabel>
                  )}
                  {hasResponse && (
                    <BarWrap secondary multiple={multipleFWs}>
                      {this.renderAcceptedBar(
                        col,
                        totalCount,
                        (accepted && accepted[id]) || 0,
                        multipleFWs, // multiple,
                      )}
                    </BarWrap>
                  )}
                  {!hasResponse && (
                    <BarWrap multiple={multipleFWs}>
                      {this.renderSimpleBar(
                        col,
                        totalCount,
                        multipleFWs, // multiple,
                      )}
                    </BarWrap>
                  )}
                </div>
              );
            })}
          </div>
        );
      } if (fwSet) {
        const id = frameworkId;
        const framework = frameworks.find((fw) => qe(fw.get('id'), id));
        if (!framework || !total[id]) {
          return null;
        }
        const hasResponse = !connected && framework.getIn(['attributes', 'has_response']);
        const totalCount = (total && total[id]) || 0;
        if (totalCount === 0) {
          return null;
        }
        return (
          <div>
            {hasResponse && (
              <BarWrap secondary>
                {this.renderAcceptedBar(
                  col,
                  totalCount,
                  (accepted && accepted[id]) || 0
                )}
              </BarWrap>
            )}
            {!hasResponse && (
              <BarWrap>
                {this.renderSimpleBar(col, (total && total[id]) || 0)}
              </BarWrap>
            )}
          </div>
        );
      }
    }
    const total = category[col.attribute.total];
    if (total === 0) {
      return null;
    }
    return (
      <BarWrap>
        {this.renderSimpleBar(col, total)}
      </BarWrap>
    );
    // return null;
  };

  render() {
    const {
      category, columns, onPageLink, frameworks, frameworkId,
    } = this.props;
    const reference = category.getIn(['attributes', 'reference'])
      && category.getIn(['attributes', 'reference']).trim() !== ''
      ? category.getIn(['attributes', 'reference'])
      : null;
    // return null;
    const catItem = {
      id: category.get('id'),
      reference,
      title: category.getIn(['attributes', 'title']),
      draft: category.getIn(['attributes', 'draft']),
    };

    return (
      <Styled
        onClick={() => onPageLink(`${PATHS.CATEGORIES}/${catItem.id}`)}
      >
        <TableWrap>
          {
            columns.map((col, i) => (
              <Column
                key={i}
                colWidth={col.width}
                multiple={
                  col.attribute
                  && col.attribute.frameworkIds
                  && col.attribute.frameworkIds.length > 1
                }
              >
                {col.type === 'title' && catItem.draft && (
                  <StatusWrap>
                    <ItemStatus draft />
                    <Clear />
                  </StatusWrap>
                )}
                {col.type === 'title' && (
                  <Title>
                    { catItem.reference
                      && <Reference>{catItem.reference}</Reference>
                    }
                    {catItem.title}
                  </Title>
                )}
                {col.type === 'count'
                  && this.renderCountColumn(col, category.toJS(), frameworks, frameworkId)
                }
              </Column>
            ))
          }
        </TableWrap>
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
