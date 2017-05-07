import React, { PropTypes } from 'react';
import styled from 'styled-components';

const ListItem = styled.div`
`;

const Main = styled.div`
  position: relative;
  background: #fff;
`;
const DueDate = styled.div`
  font-weight: bold;
  font-size: 0.8;
  color: #EB6E51;
`;


export default class EntityListChildDateItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    date: PropTypes.object.isRequired,
  }

  renderListItem = () => {
    const { date } = this.props;
    let dueDateType = 'scheduled';
    if (date.attributes.overdue) {
      dueDateType = 'overdue';
    } else if (date.attributes.due) {
      dueDateType = 'due';
    }
    return (
      <ListItem>
        <Main>
          <DueDate>
            {`${date.attributes.due_date} (${dueDateType})`}
          </DueDate>
        </Main>
      </ListItem>
    );
  }

  render() {
    // console.log('Item:render', this.props.entity)

    return (
      <div>
        {this.renderListItem()}
      </div>
    );
  }
}
