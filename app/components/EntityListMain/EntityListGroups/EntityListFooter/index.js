/*
 *
 * EntityListFooter
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { isEqual } from 'lodash/lang';

import appMessage from 'utils/app-message';

import A from 'components/styled/A';

import Icon from 'components/Icon';
import SelectReset from 'components/SelectReset';
import appMessages from 'containers/App/messages';
import PrintHide from 'components/styled/PrintHide';

import { PAGE_ITEM_OPTIONS } from 'themes/config';

const Styled = styled(PrintHide)`
  padding-top: 0.5em;
  position: relative;
  text-align: center;
`;
const SelectWrapper = styled.div`
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    position: absolute;
    right:0;
    bottom:0;
    text-align:right;
    display: block;
    height: 2em;
  }
`;
const ListInline = styled.ul`
  list-style: none;
  padding-left: 0;
`;
const ListInlineItem = styled.li`
  position: relative;
  display: inline-block;
  padding: 0;
  font-size: 1em;
  color: ${palette('linkHover', 0)};
  vertical-align: middle;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    font-size: 1.25em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;
const ListInlineItemLink = styled(A)`
  width: 1.5em;
  height: 1.5em;
  line-height: 1.6;
  font-weight: bold;
  display: block;
  text-align: center;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    width: 2em;
    height: 2em;
    line-height: 2;
  }
`;
const ListInlineItemActive = styled.div`
  width: 1.5em;
  height: 1.5em;
  line-height: 1.6;
  border-radius: 9999px;
  font-weight: bold;
  background-color: ${palette('buttonDefault', 1)};
  color: ${palette('buttonDefault', 0)};
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    width: 2em;
    height: 2em;
    line-height: 2;
  }
`;
const ListInlineItemNav = styled(A)`
  padding: 0;
  display: block;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding: 0 0.5em;
  }
`;

const ListInlineItemNavDisabled = styled.div`
  color: ${palette('buttonDefaultDisabled', 1)};
  padding: 0;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding: 0 0.5em;
  }`;

export class EntityListFooter extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.pager, nextProps.pager)
      || this.props.pageSize !== nextProps.pageSize;
  }

  render() {
    // console.log('EntityListOptions.render')
    const { intl } = this.context;
    const {
      pager,
      onPageSelect,
      onPageItemsSelect,
      pageSize,
    } = this.props;

    const perPageOptions = PAGE_ITEM_OPTIONS.map((option) => ({
      value: option.value.toString(),
      label: option.message
        ? appMessage(intl, option.message)
        : option.value.toString(),
    }));

    return (
      <Styled>
        {pager && pager.pages && pager.pages.length > 1
          && (
            <ListInline>
              <ListInlineItem>
                { pager.currentPage > 1
                && (
                  <ListInlineItemNav
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageSelect(Math.max(1, pager.currentPage - 1));
                    }}
                    title={intl && intl.formatMessage(appMessages.buttons.previous)}
                  >
                    <Icon name="arrowLeft" />
                  </ListInlineItemNav>
                )
                }
                {pager.currentPage === 1
                && (
                  <ListInlineItemNavDisabled>
                    <Icon name="arrowLeft" />
                  </ListInlineItemNavDisabled>
                )
                }
              </ListInlineItem>
              { pager.pages.indexOf(1) < 0
              && (
                <ListInlineItem>
                  <ListInlineItemLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageSelect(1);
                    }}
                  >
                  1
                  </ListInlineItemLink>
                </ListInlineItem>
              )
              }
              { pager.pages.indexOf(2) < 0
              && (
                <ListInlineItem>
                ...
                </ListInlineItem>
              )
              }
              { pager.pages.map((page, index) => (
                <ListInlineItem key={index}>
                  {pager.currentPage !== page
                  && (
                    <ListInlineItemLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageSelect(page);
                      }}
                    >
                      {page}
                    </ListInlineItemLink>
                  )
                  }
                  {pager.currentPage === page
                  && (
                    <ListInlineItemActive>
                      {page}
                    </ListInlineItemActive>
                  )
                  }
                </ListInlineItem>
              ))}
              { pager.pages.indexOf(pager.totalPages - 1) < 0
              && (
                <ListInlineItem>
                ...
                </ListInlineItem>
              )
              }
              { pager.pages.indexOf(pager.totalPages) < 0
              && (
                <ListInlineItem>
                  <ListInlineItemLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageSelect(pager.totalPages);
                    }}
                  >
                    {pager.totalPages}
                  </ListInlineItemLink>
                </ListInlineItem>
              )
              }
              <ListInlineItem>
                { pager.currentPage < pager.totalPages
                && (
                  <ListInlineItemNav
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageSelect(Math.min(pager.totalPages, parseInt(pager.currentPage, 10) + 1));
                    }}
                    title={intl && intl.formatMessage(appMessages.buttons.next)}
                  >
                    <Icon name="arrowRight" />
                  </ListInlineItemNav>
                )
                }
                {pager.currentPage === pager.totalPages
                && (
                  <ListInlineItemNavDisabled>
                    <Icon name="arrowRight" />
                  </ListInlineItemNavDisabled>
                )
                }
              </ListInlineItem>
            </ListInline>
          )
        }
        <SelectWrapper>
          <SelectReset
            value={pageSize.toString()}
            label={intl && intl.formatMessage(appMessages.labels.perPage)}
            index="page-select"
            options={perPageOptions}
            isReset={false}
            onChange={onPageItemsSelect}
          />
        </SelectWrapper>
      </Styled>
    );
  }
}

EntityListFooter.propTypes = {
  pageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pager: PropTypes.object,
  onPageSelect: PropTypes.func,
  onPageItemsSelect: PropTypes.func,
};

EntityListFooter.contextTypes = {
  intl: PropTypes.object.isRequired,
};


export default EntityListFooter;
