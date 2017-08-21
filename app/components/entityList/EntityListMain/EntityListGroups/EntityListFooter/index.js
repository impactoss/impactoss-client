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

import Icon from 'components/Icon';
import SelectReset from 'components/SelectReset';
import { PAGE_ITEM_OPTIONS } from 'containers/App/constants';

const Styled = styled.div`
  padding-top: 0.5em;
  position: relative;
  text-align: center;
`;
const SelectWrapper = styled.div`
  position: absolute;
  right:0;
  bottom:0;
  text-align:right;
  display: block;
  height: 2em;
`;
const ListInline = styled.ul`
  list-style: none;
  padding-left: 0;
`;
const ListInlineItem = styled.li`
  position: relative;
  display: inline-block;
  padding: 0;
  font-size: 1.25em;
`;
const ListInlineItemLink = styled.a`
  width:2em;
  height:2em;
  line-height: 2em;
  font-weight: bold;
  color: ${palette('primary', 1)};
  display: block;
`;
const ListInlineItemActive = styled.div`
  width:2em;
  height:2em;
  line-height: 2em;
  border-radius: 9999px;
  font-weight: bold;
  background-color: ${palette('primary', 1)};
  color: ${palette('primary', 4)};
`;
const ListInlineItemNav = styled.a`
  padding: 0 0.5em;
  display: block;
`;

const ListInlineItemNavDisabled = styled.div`
  color: ${palette('dark', 4)};
  padding: 0 0.5em;
`;

export class EntityListFooter extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.pager, nextProps.pager)
      || this.props.pageSize !== nextProps.pageSize;
  }
  render() {
    // console.log('EntityListOptions.render')

    const {
      pager,
      onPageSelect,
      onPageItemsSelect,
      pageSize,
    } = this.props;

    const perPageOptions = PAGE_ITEM_OPTIONS.map((option) => ({
      value: option.toString(),
      label: option.toString(),
    }));

    return (
      <Styled>
        {pager && pager.pages && pager.pages.length > 1 &&
          <ListInline>
            <ListInlineItem>
              { pager.currentPage > 1 &&
                <ListInlineItemNav
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageSelect(Math.max(1, pager.currentPage - 1));
                  }}
                  title="Previous"
                >
                  <Icon name="arrowLeft" />
                </ListInlineItemNav>
              }
              {pager.currentPage === 1 &&
                <ListInlineItemNavDisabled>
                  <Icon name="arrowLeft" />
                </ListInlineItemNavDisabled>
              }
            </ListInlineItem>
            { pager.pages.indexOf(1) < 0 &&
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
            }
            { pager.pages.indexOf(2) < 0 &&
              <ListInlineItem>
                ...
              </ListInlineItem>
            }
            { pager.pages.map((page, index) =>
              <ListInlineItem key={index}>
                {pager.currentPage !== page &&
                  <ListInlineItemLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageSelect(page);
                    }}
                  >
                    {page}
                  </ListInlineItemLink>
                }
                {pager.currentPage === page &&
                  <ListInlineItemActive>
                    {page}
                  </ListInlineItemActive>
                }
              </ListInlineItem>
            )}
            { pager.pages.indexOf(pager.totalPages - 1) < 0 &&
              <ListInlineItem>
                ...
              </ListInlineItem>
            }
            { pager.pages.indexOf(pager.totalPages) < 0 &&
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
            }
            <ListInlineItem>
              { pager.currentPage < pager.totalPages &&
                <ListInlineItemNav
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageSelect(Math.min(pager.totalPages, parseInt(pager.currentPage, 10) + 1));
                  }}
                  title="Next"
                >
                  <Icon name="arrowRight" />
                </ListInlineItemNav>
              }
              {pager.currentPage === pager.totalPages &&
                <ListInlineItemNavDisabled>
                  <Icon name="arrowRight" />
                </ListInlineItemNavDisabled>
              }
            </ListInlineItem>
          </ListInline>
        }
        <SelectWrapper>
          <SelectReset
            value={pageSize.toString()}
            label="Per page"
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
  pageSize: PropTypes.number,
  pager: PropTypes.object,
  onPageSelect: PropTypes.func,
  onPageItemsSelect: PropTypes.func,
};

export default EntityListFooter;
