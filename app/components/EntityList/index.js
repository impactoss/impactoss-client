import React, { PropTypes } from 'react';
// import { updateQueryStringParam } from 'utils/history'
import Item from './Item';

export default class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entities: PropTypes.arrayOf(React.PropTypes.shape({
      title: PropTypes.string.isRequired,
      linkTo: PropTypes.string,
      reference: PropTypes.string,
      status: PropTypes.string,
      children: PropTypes.object,
      side: PropTypes.object,
      className: PropTypes.string,
    })),
    currentSort: PropTypes.string,
    perPage: PropTypes.number,
    currentPage: PropTypes.number,
    onSort: PropTypes.func,
    onSetPage: PropTypes.func,
  }

  static defaultProps = {
    perPage: 5,
    currentPage: 1,
  }

  // constructor(props) {
  //   super(props);
  //   this.setState({
  //     currentPage: props.initialPage,
  //   });
  // }
  //
  // state = {
  //   currentPage: 1,
  // }

  onSort = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.onSort(evt.target.value);
  }

  nextPage = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.onSetPage(this.props.currentPage + 1);
    // this.setState({
    //   currentPage: this.state.currentPage + 1,
    // }, () => {
    //   updateQueryStringParam('page', this.state.currentPage);
    // });
  }

  prevPage = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.onSetPage(this.props.currentPage - 1);
    // this.setState({
    //   currentPage: this.state.currentPage - 1,
    // }, () => {
    //   updateQueryStringParam('page', this.state.currentPage);
    // });
  }

  render() {
    // const { currentPage } = this.state;
    const { entities, currentPage, havePrevPage, haveNextPage } = this.props;
    // const length = data.length;

    // Paging logic
    // const totalPages = Math.ceil(Math.max(length, 0) / perPage);
    // const pageNum = Math.min(currentPage, totalPages);
    // const offset = (pageNum - 1) * perPage;
    // const end = offset + this.props.perPage;
    // const haveNextPage = end < data.length;
    // const havePrevPage = pageNum > 1;
    //
    // const page = slice(data, offset, end);

    return (
      <div>
        <div>
          {this.props.onSort &&
          <select onChange={this.onSort} value={this.props.currentSort}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          }
        </div>
        <div>
          {entities.map((entity, i) =>
            <Item key={i} {...entity} />
          )}
          {this.props.onSetPage && havePrevPage &&
            <button onClick={this.prevPage}>Previous</button>
          }
          {this.props.onSetPage && haveNextPage &&
            <button onClick={this.nextPage}>Next</button>
          }
        </div>
      </div>
    );
  }


}
