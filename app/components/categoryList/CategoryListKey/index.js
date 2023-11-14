import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  padding-top: 2px;
  padding-left: 8px;
`;

const ColumnKey = styled.div`
  padding-bottom: 0.2em;
`;

const KeyItem = styled.span`
  display: block;
  @media (min-width: ${(props) => props.theme.breakpoints.smallest}) {
    padding-right: 1em;
    display: inline-block;
  }
`;

const ItemTitle = styled.div`
  padding-left: 0.25em;
  display: inline-block;
  vertical-align: middle;
  color: ${palette('text', 1)};
  font-size: 0.7em;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 0.8em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smallest};
  }
`;

const Square = styled.div`
  display: inline-block;
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  height: 0.7em;
  width: 0.6em;
  vertical-align: middle;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    height: 0.8em;
  }
  @media print {
    position: relative;
    overflow: hidden;
    z-index: 0;
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      border-bottom: 100px solid ${(props) => palette(props.palette, props.pIndex || 0)};
    }
  }
`;


class CategoryListKey extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { keys } = this.props;
    return (
      <Styled>
        {
          keys.map((key, i) => key
            ? (
              <ColumnKey key={i}>
                {key.title && (
                  <div>
                    {key.title}
                  </div>
                )}
                {
                  key.items && key.items.map((item, j) => (
                    <KeyItem key={j}>
                      <Square palette={item.palette} pIndex={item.pIndex} />
                      <ItemTitle>{item.label}</ItemTitle>
                    </KeyItem>
                  ))
                }
              </ColumnKey>
            )
            : null)
        }
      </Styled>
    );
  }
}
CategoryListKey.propTypes = {
  keys: PropTypes.array,
};

export default CategoryListKey;
