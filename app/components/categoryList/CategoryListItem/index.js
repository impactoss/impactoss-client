import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled.button`
  width:100%;
  cursor: pointer;
  text-align: left;
  background-color: ${palette('primary', 4)};
  margin: 0;
  padding: 1em 0;
  display: block;
  margin-bottom: 2px;
  &:hover {
    opacity: 0.85;
  }
`;
const Column = styled.div`
  width:${(props) => props.colWidth}%;
  display: inline-block;
  vertical-align: middle;
`;
const BarWrap = styled.div`
  width:100%;
  vertical-align: middle;
  padding-left: 2.5em;
  padding-right: ${(props) => props.secondary ? 1.5 : 1}em;
`;
const Bar = styled.div`
  width:${(props) => props.length}%;
  height: 1.6em;
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  vertical-align: middle;
  display: inline-block;
  position: relative;
`;
const Count = styled.div`
  font-weight: bold;
  position: absolute;
  font-size: 1.1em;
  line-height: 1.6;
  right: 100%;
  text-align: right;
  padding-right: 5px;
  color: ${(props) => palette(props.palette, 0)};
`;
const CountSecondary = styled(Count)`
  left: 100%;
  text-align: left;
  padding-right: 0;
  padding-left: 5px;
  color: ${(props) => palette(props.palette, 1)};
`;
const Title = styled.div`
  display: inline-block;
  font-size: 1.1em;
  line-height: 1.6;
  padding: 0 1em;
`;
const Reference = styled.span`
  padding-right: 0.5em;
  opacity: 0.6;
`;

class CategoryListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderColumnContent = (col, category) => {
    const count = category.counts[col.countsIndex];
    switch (col.type) {
      case ('title'):
        return (
          <Title>
            { category.reference &&
              <Reference>{category.reference}</Reference>
            }
            {category.title}
          </Title>
        );
      case ('count'):
        return (count.accepted === null || typeof count.accepted === 'undefined')
        ? (
          <BarWrap>
            <Bar
              length={(count.public / col.maxCount) * 100}
              palette={col.entity}
            >
              <Count palette={col.entity}>
                {count.public}
              </Count>
            </Bar>
          </BarWrap>
        )
        : (
          <BarWrap secondary>
            <Bar
              length={(count.accepted / col.maxCount) * 100}
              palette={col.entity}
            >
              <Count palette={col.entity}>
                {count.accepted}
              </Count>
            </Bar>
            { count.noted > 0 &&
              <Bar
                length={(count.noted / col.maxCount) * 100}
                palette={col.entity}
                pIndex={1}
              >
                <CountSecondary palette={col.entity}>
                  {count.noted}
                </CountSecondary>
              </Bar>
            }
          </BarWrap>
        );
      default:
        return null;
    }
  };
  render() {
    const { category, columns } = this.props;

    return (
      <Styled onClick={() => category.onLink()}>
        {
          columns.map((col, i) => (
            <Column key={i} colWidth={col.width}>
              {this.renderColumnContent(col, category)}
            </Column>
          ))
        }
      </Styled>
    );
  }
}

CategoryListItem.propTypes = {
  category: PropTypes.object,
  columns: PropTypes.array,
};

export default CategoryListItem;
