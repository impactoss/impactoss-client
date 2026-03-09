import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import ItemStatus from 'components/ItemStatus';
import Clear from 'components/styled/Clear';
import { ROUTES } from 'containers/App/constants';
import {
  IS_CURRENT_STATUSES,
  IS_ARCHIVE_STATUSES,
  PUBLISH_STATUSES,
  CURRENT_TAXONOMY_IDS,
} from 'themes/config';
import appMessage from 'utils/app-message';
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
  &:hover, &:focus-visible {
    color: ${palette('mainListItemHover', 0)};
    background-color: ${palette('mainListItemHover', 1)};
  }
  &:focus-visible {
    outline: 2px solid ${({ subtle }) => (subtle ? palette('buttonFlat', 0) : palette('buttonFlatHover', 0))};
    outline-offset: 0px;
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
  @media (min-width: ${(props) => props.theme.breakpoints.xsmall}) {
    padding-left: 20px;
  }
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
    &::before {
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
  position: absolute;
  font-size: ${({ theme }) => theme.sizes.text.smaller};
  line-height: ${({ multiple }) => multiple ? 8 : 16}px;
  left: 0;
  bottom: 100%;
  padding: 2px 0;
  color: ${(props) => palette(props.palette, 0)};
  white-space: nowrap;
  @media print, (min-width: ${(props) => props.theme.breakpoints.xsmall}) {
    font-size: ${({ theme, multiple }) => multiple ? theme.sizes.text.smaller : theme.sizes.text.small};
    font-weight: bold;
    text-align: right;
    padding: 0 5px 0 0;
    right: 100%;
    bottom: auto;
    left: auto;
  }
  @media print, (min-width: ${(props) => props.theme.breakpoints.small}) {
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

class CategoryListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderSimpleBar = ({
    maxCount, entityPalette, total, multiple,
  }) => (
    <Bar
      length={(total / maxCount) * 100}
      palette={entityPalette}
      multiple={multiple}
    >
      <Count palette={entityPalette} multiple={multiple}>
        {total}
      </Count>
    </Bar>
  );

  // renderAcceptedBar = (col, total, accepted, multiple) => {
  //   const noted = total - accepted;
  //   return (
  //     <WrapAcceptedBars multiple={multiple}>
  //       <Bar
  //         length={(accepted / col.maxCount) * 100}
  //         palette={col.attribute.entity}
  //         secondary
  //         multiple={multiple}
  //       >
  //         <Count palette={col.attribute.entity} multiple={multiple}>
  //           {accepted}
  //         </Count>
  //       </Bar>
  //       { noted > 0
  //         && (
  //           <Bar
  //             length={(noted / col.maxCount) * 100}
  //             palette={col.attribute.entity}
  //             pIndex={1}
  //             multiple={multiple}
  //           >
  //             <CountSecondary palette={col.attribute.entity} multiple={multiple}>
  //               {noted}
  //             </CountSecondary>
  //           </Bar>
  //         )
  //       }
  //     </WrapAcceptedBars>
  //   );
  // };

  renderCountColumn = ({
    col,
    total,
    totalCount,
    frameworkInfo,
    // totalByFramework,
  }) => {
    if (col.attribute.frameworkIds) {
      if (frameworkInfo) {
        return (
          <div>
            {Object.keys(frameworkInfo).map((id) => {
              const {
                connected,
                multipleFWs,
                frameworkLabel,
              } = frameworkInfo[id];
              if (frameworkInfo[id].totalCount) {
                return (
                  <div key={id}>
                    {multipleFWs && (
                      <FrameworkLabel>
                        {connected && (<span>&nbsp;</span>)}
                        {!connected && (<span>{frameworkLabel}</span>)}
                      </FrameworkLabel>
                    )}
                    <BarWrap multiple={multipleFWs}>
                      {this.renderSimpleBar({
                        maxCount: col.maxCount,
                        entityPalette: col.attribute.entity,
                        total: frameworkInfo[id].totalCount,
                        multiple: multipleFWs, // multiple,
                      })}
                    </BarWrap>
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }
      return totalCount
        ? (
          <BarWrap>
            {this.renderSimpleBar({
              maxCount: col.maxCount,
              entityPalette: col.attribute.entity,
              total: totalCount,
            })}
          </BarWrap>
        )
        : null;
    }
    return totalCount
      ? (
        <BarWrap>
          {this.renderSimpleBar({
            maxCount: col.maxCount,
            entityPalette: col.attribute.entity,
            total,
          })}
        </BarWrap>
      )
      : null;
  };

  getCountColumnInfo = (col, category, frameworks, frameworkId, intl) => {
    // const info = {};
    if (!col.attribute) {
      return null;
    }
    const countsByFramework = col.attribute.frameworkIds;
    if (countsByFramework) {
      const connected = col.attribute.entity === 'measures';
      const totalByFramework = category[col.attribute.totalByFw];
      // const accepted = category[col.attribute.acceptedByFw];
      const fwSet = frameworkId && frameworkId !== 'all';
      if (!fwSet) {
        const frameworkInfo = col.attribute.frameworkIds.reduce(
          (memo, id) => {
            const framework = frameworks.find((fw) => qe(fw.get('id'), id));
            if (!framework) {
              return memo;
            }
            const totalCount = (total && total[id]) || 0;
            const multipleFWs = col.attribute.frameworkIds.length > 1;
            return {
              ...memo,
              [id]: {
                multipleFWs,
                connected,
                totalCount,
                frameworkLabel: connected && multipleFWs
                  ? null
                  : intl.formatMessage(appMessages.entities[`recommendations_${id}`].plural),
              },
            };
          },
          {},
        );
        return {
          col,
          frameworkInfo,
          totalByFramework,
          totalCount: totalByFramework && totalByFramework.reduce(
            (memo, fwCount) => memo + fwCount,
            0,
          ),
        };
      }
      if (fwSet) {
        const id = frameworkId;
        const framework = frameworks.find((fw) => qe(fw.get('id'), id));
        if (!framework) {
          return null;
        }
        const totalCount = (totalByFramework && totalByFramework[id]) || 0;
        return {
          col,
          totalCount,
        };
      }
    }
    const total = category[col.attribute.total];
    return {
      col,
      total,
      totalCount: total,
    };
  };

  render() {
    const {
      category, columns, onPageLink, frameworks, frameworkId, intl,
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
      is_not_current: CURRENT_TAXONOMY_IDS.indexOf(parseInt(category.getIn(['attributes', 'taxonomy_id']), 10)) > -1
        && !category.getIn(['attributes', 'is_current']),
      is_archive: category.getIn(['attributes', 'is_archive']),
    };
    const columnInfos = columns.reduce((memo, col) => {
      if (col.type === 'count') {
        const info = this.getCountColumnInfo(col, category.toJS(), frameworks, frameworkId, intl);
        return info
          ? {
            ...memo,
            [col.id]: info,
          }
          : memo;
      }
      return memo;
    }, {});
    const ariaDescription = columnInfos && Object.values(columnInfos).reduce(
      (memo, info) => {
        if (
          info
          && info.col
          && info.col.attribute
          && info.col.attribute.entity
          && appMessages.entities[info.col.attribute.entity]
        ) {
          const colDescription = `${info.totalCount} ${intl.formatMessage(
            appMessages.entities[info.col.attribute.entity][info.totalCount === 1 ? 'single' : 'plural'],
          )}`;
          return memo
            ? `${memo}, ${colDescription}`
            : colDescription;
        }
        return memo;
      },
      null,
    );
    let status = [];
    if (catItem.is_not_current) {
      const option = IS_CURRENT_STATUSES.find((o) => qe(o.value, 'false'));
      status = option && option.message
        ? [...status, appMessage(intl, option.message)]
        : status;
    }
    if (catItem.is_archive) {
      const option = IS_ARCHIVE_STATUSES.find((o) => qe(o.value, 'true'));
      status = option && option.message
        ? [...status, appMessage(intl, option.message)]
        : status;
    }
    if (catItem.draft) {
      const option = PUBLISH_STATUSES.find((o) => qe(o.value, 'true'));
      status = option && option.message
        ? [...status, appMessage(intl, option.message)]
        : status;
    }
    let { title } = catItem;
    if (status.length > 0) {
      title = `${title} (${status.join(', ')})`;
    }
    const ariaLabel = ariaDescription
      ? `${title} - ${ariaDescription}`
      : title;
    return (
      <Styled
        onClick={() => onPageLink(`${ROUTES.CATEGORIES}/${catItem.id}`)}
        title={catItem.title}
        aria-label={ariaLabel}
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
                {col.type === 'title' && (
                  <StatusWrap>
                    {catItem.is_not_current && (
                      <ItemStatus options={IS_CURRENT_STATUSES} value="false" />
                    )}
                    {catItem.is_archive && (
                      <ItemStatus options={IS_ARCHIVE_STATUSES} value="true" />
                    )}
                    {catItem.draft && (
                      <ItemStatus draft />
                    )}
                    <Clear />
                  </StatusWrap>
                )}
                {col.type === 'title' && (
                  <Title>
                    {catItem.reference
                      && <Reference>{catItem.reference}</Reference>
                    }
                    {catItem.title}
                  </Title>
                )}
                {col.type === 'count'
                  && columnInfos
                  && columnInfos[col.id]
                  && this.renderCountColumn(columnInfos[col.id])}
              </Column>
            ))
          }
        </TableWrap>
      </Styled>
    );
  }
}

CategoryListItem.propTypes = {
  category: PropTypes.object,
  frameworks: PropTypes.object,
  intl: PropTypes.object,
  columns: PropTypes.array,
  onPageLink: PropTypes.func,
  frameworkId: PropTypes.string,
};

export default injectIntl(CategoryListItem);
