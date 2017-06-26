/*
 *
 * EntityListFooter
 *
 */
import React, { PropTypes } from 'react';
import styled from 'styled-components';
// import { palette } from 'styled-theme';

import { isEqual } from 'lodash/lang';

// import messages from './messages';

const Styled = styled.div`
  padding: 0.5em 0;
  position: relative;
`;

const ListInline = styled.ul`
  list-style: none;
  padding-left: 0;
`;
const ListInlineItem = styled.li`
  position: relative;
  display: block;
  float: left;
  padding-right: 1px;
`;
const ListInlineItemLink = styled.a`
  text-decoration: ${(props) => props.active ? 'underline' : 'none'};
  padding:0.25em 1em;
  background-color: #fff;
`;

export class EntityListFooter extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.pager, nextProps.pager);
  }
  render() {
    // console.log('EntityListOptions.render')

    const {
      pager,
      onPageSelect,
    } = this.props;
    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
    }

    return (
      <Styled>
        <ListInline>
          <ListInlineItem>
            <ListInlineItemLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageSelect(Math.max(1, pager.currentPage - 1));
              }}
            >
              Previous
            </ListInlineItemLink>
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
          { pager.pages.map((page, index) =>
            <ListInlineItem key={index}>
              <ListInlineItemLink
                href="#"
                active={pager.currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageSelect(page);
                }}
              >
                {page}
              </ListInlineItemLink>
            </ListInlineItem>
          )}
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
            <ListInlineItemLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageSelect(Math.min(pager.totalPages, parseInt(pager.currentPage, 10) + 1));
              }}
            >
              Next
            </ListInlineItemLink>
          </ListInlineItem>
        </ListInline>
      </Styled>
    );
  }
}

EntityListFooter.propTypes = {
  pager: PropTypes.object,
  onPageSelect: PropTypes.func,
};

export default EntityListFooter;
