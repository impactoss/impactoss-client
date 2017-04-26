/*
 *
 * EntityListSidebar
 *
 */
import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Component = styled.div`
  position: absolute;
  top:0;
  width:300px;
  bottom:0;
  background:#fff;
  z-index:100;
`;
const Header = styled.div`
  background: #ccc;
`;
const Main = styled.div``;

export default class EntityListSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    options: PropTypes.array,
  };

  static defaultProps = {
    children: null,
  };
  renderOptions = () => this.props.options.map((option, key) =>
    (<button key={key} onClick={option.onClick}>{option.label}</button>)
  );

  render() {
    return (
      <Component>
        <Header>
          {this.renderOptions()}
        </Header>
        <Main>
          {React.Children.toArray(this.props.children)}
        </Main>
      </Component>
    );
  }
}
