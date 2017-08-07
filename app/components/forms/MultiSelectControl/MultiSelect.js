import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonFactory from 'components/buttons/ButtonFactory';

import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import {
  sortOptions,
  filterOptionsByTags,
  filterOptionsByKeywords,
} from './utils';

import Close from './Close';
import Search from './Search';
import TagFilters from './TagFilters';
import OptionList from './OptionList';

const ButtonGroup = styled.div`
  float: ${(props) => props.left ? 'left' : 'right'}
`;
const ControlWrapper = styled.div``;
const ControlHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${palette('dark', 2)};
  color: ${palette('primary', 4)};
  height: ${(props) => props.search ? '115px' : '60px'};
  padding: 1em 0 1em 1em;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
`;
const ControlMain = styled.div`
  position: absolute;
  top: ${(props) => props.search ? '115px' : '60px'};
  bottom: ${(props) => props.hasFooter ? '50px' : '0px'};
  left: 0;
  right: 0;
  overflow-y: auto;
  padding:0;
`;
const ControlFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${palette('light', 0)};
  height: 50px;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
`;

export default class MultiSelect extends React.Component {

  static propTypes = {
    options: PropTypes.instanceOf(List),
    values: PropTypes.instanceOf(List),
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    title: PropTypes.string,
    buttons: PropTypes.array,
    search: PropTypes.bool,
    advanced: PropTypes.bool,
    panelId: PropTypes.string,
    tagFilterGroups: PropTypes.array,
  }

  static defaultProps = {
    values: new List(),
    threeState: false,
    multiple: true,
    required: false,
    search: true,
    advanced: false,
  }

  constructor() {
    super();
    this.state = {
      query: null,
      optionsInitial: null,
      panelId: null,
      queryTags: null,
      tagFilterGroupActive: null,
    };
  }

  componentWillMount() {
    // remember initial options
    this.setState({
      optionsInitial: this.props.options,
      panelId: this.props.panelId,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.panelId && (nextProps.panelId !== this.state.panelId)) {
      this.setState({
        optionsInitial: nextProps.options,
        panelId: nextProps.panelId,
        query: null,
        queryTags: null,
        tagFilterGroupActive: null,
      });
    }
  }

  onSearch = (evt) => {
    if (evt && evt !== undefined) evt.stopPropagation();
    this.setState({
      query: evt.target.value,
    });
  }

  getNextValues = (checked, option) => {
    const { multiple, required, values } = this.props;
    // do not update if required and change would result in empty list
    if (!checked && required) {
      const otherCheckedValues = values.find((v) =>
        v.get('checked') && !(v.get('value') === option.get('value') && v.get('query') === option.get('query'))
      );
      if (!otherCheckedValues) {
        return values;
      }
    }

    // uncheck all others if single mode (!multiple)
    let nextValues = values;
    const existingValueIndex = values.findIndex((v) =>
      v.get('value') === option.get('value') && v.get('query') === option.get('query')
    );
    if (!multiple && checked) {
      // uncheck all other options
      nextValues = nextValues.map((value, index) =>
        existingValueIndex !== index ? value.set('checked', false).set('hasChanged', true) : value
      );
    }
    // set new value
    const newValue = option.set('checked', checked).set('hasChanged', true);
    // set current value, add if not present
    return existingValueIndex > -1 ? nextValues.set(existingValueIndex, newValue) : nextValues.push(newValue);
  }

  // props, state
  prepareOptions = ({ options, values, threeState, search, advanced }, { query, queryTags, optionsInitial }) => {
    // map options
    let checkboxOptions = options.map((option) => {
      const value = values.find((v) => option.get('value') === v.get('value') && option.get('query') === v.get('query'));
      const isNew = !optionsInitial.includes(option);
      return option.withMutations((o) =>
        o.set('checked', value && value.get('checked'))
        .set('isNew', isNew)
        .set('initialChecked', option.get('checked'))
        .set('isIndeterminate', threeState && option.get('checked') === CHECKBOX_STATES.INDETERMINATE)
      );
    });
    // filter options
    if (search && query) {
      checkboxOptions = filterOptionsByKeywords(checkboxOptions, query);
    }
    if (advanced && queryTags) {
      checkboxOptions = filterOptionsByTags(checkboxOptions, queryTags);
    }
    // sort options
    return sortOptions(checkboxOptions);
  }

  renderButton = (action, i) => (
    <ButtonFactory
      key={i}
      button={{
        type: action.type === 'primary' ? 'textPrimary' : (action.type || 'text'),
        title: action.title,
        onClick: action.onClick && (() => action.onClick()),
        submit: action.submit,
      }}
    />
  );

  render() {
    return (
      <ControlWrapper>
        <ControlHeader search={this.props.search}>
          { this.props.title }
          { this.props.onCancel &&
            <Close onCancel={this.props.onCancel} />
          }
          { this.props.search &&
            <Search onSearch={this.onSearch} queryTags={this.state.queryTags} />
          }
          { this.props.advanced && this.props.tagFilterGroups &&
            <TagFilters
              queryTags={this.state.queryTags}
              tagFilterGroups={this.props.tagFilterGroups}
              tagFilterGroupActive={this.state.tagFilterGroupActive}
            />
          }
        </ControlHeader>
        <ControlMain search={this.props.search} hasFooter={this.props.buttons}>
          <OptionList
            options={this.prepareOptions(this.props, this.state)}
            onCheckboxChange={(checkedState, option) => {
              this.props.onChange(this.getNextValues(checkedState, option));
            }}
          />
        </ControlMain>
        { this.props.buttons &&
          <ControlFooter>
            <ButtonGroup>
              {
                this.props.buttons.map((action, i) =>
                  action && action.position !== 'left' && this.renderButton(action, i))
              }
            </ButtonGroup>
            <ButtonGroup left>
              {
                this.props.buttons.map((action, i) => (
                  action && action.position === 'left' && this.renderButton(action, i)
                ))
              }
            </ButtonGroup>
          </ControlFooter>
        }
      </ControlWrapper>
    );
  }
}
