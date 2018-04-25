import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled.div`
  text-align: right;
  position: absolute;
  right: 0;
  bottom: 100%;
  padding-bottom: 2px;
  font-size: 0.7em;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 0.8em;
  }
`;

const ColumnKey = styled.span`
  padding-left: 1em;
`;

const KeyItem = styled.span`
  padding-left: 0.75em;
`;

const Title = styled.div`
  padding-left: 0.25em;
  display: inline-block;
  vertical-align: middle;
  color: ${palette('text', 1)};
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
`;


class CategoryListKey extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { columns } = this.props;

    return (
      <Styled>
        {
          columns.map((col, i) => col.key
            ? (
              <ColumnKey key={i}>
                {
                  col.key.map((item, j) => (
                    <KeyItem key={j}>
                      <Square palette={item.palette} pIndex={item.pIndex} />
                      <Title>{item.label}</Title>
                    </KeyItem>
                  ))
                }
              </ColumnKey>
            )
            : null
          )
        }
      </Styled>
    );
  }
}
CategoryListKey.propTypes = {
  columns: PropTypes.array,
};

export default CategoryListKey;
