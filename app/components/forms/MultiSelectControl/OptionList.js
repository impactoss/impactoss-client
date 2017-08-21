import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { kebabCase } from 'lodash/string';
import { FormattedMessage } from 'react-intl';

import IndeterminateCheckbox from 'components/forms/IndeterminateCheckbox';

import Option from './Option';

import messages from './messages';

const Styled = styled.div`
  width: 100%;
`;
const ListWrapper = styled.div`
  display: table;
  width: 100%;
  border-top: 2px solid ${palette('light', 1)};
`;

const OptionWrapper = styled.div`
  display: table-row;
  width: 100%;
`;
// background-color: ${(props) => {
//   if (props.changedToChecked) {
//     return '#e8ffe8';
//   }
//   if (props.changedToUnchecked) {
//     return '#e8ffe8';
//   }
//   return 'transparent';
// }}
const CheckboxWrapper = styled.div`
  display: table-cell;
  vertical-align:middle;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 0.5em;
  width: 10px;
  border-bottom: 1px solid ${palette('light', 1)};
`;
const OptionLabel = styled.label`
  display: table-cell;
  vertical-align:middle;
  cursor: pointer;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  border-bottom: 1px solid ${palette('light', 1)};
  border-right: 0.5em solid ${(props) =>
    (props.changedToChecked || props.changedToUnchecked)
      ? palette('primary', 1)
      : 'transparent'
  };
`;

const OptionCount = styled.span`
  display: table-cell;
  vertical-align:top;
  color: ${palette('dark', 4)};
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-right: 1em;
  text-align: right;
  border-bottom: 1px solid ${palette('light', 1)};
`;

const Empty = styled.div`
  padding: 1em;
  font-style: italic;
`;

const More = styled.div`
  display: block;
  width: 100%;
  padding: 0.5em 1em;
  text-align: center;
  font-size: 0.85em;
`;
const MoreLink = styled.a`
  font-weight: bold;
`;

const SHOW_INCREMENT = 20;

class OptionList extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      show: SHOW_INCREMENT,
    };
  }

  showMore = () => {
    this.setState({
      show: this.state.show + SHOW_INCREMENT,
    });
  }

  render() {
    const options = this.props.options && this.props.options.slice(0, this.state.show);

    const hasMore = options.size < this.props.options.size;

    return (
      <Styled>
        <ListWrapper>
          { options && options.map((option, i) => {
            const checked = option.get('checked');
            const isIndeterminate = option.get('isIndeterminate');
            const id = `${i}-${kebabCase(option.get('value'))}`;
            return (
              <OptionWrapper
                key={id}
                changedToChecked={option.get('changedToChecked')}
                changedToUnchecked={option.get('changedToUnchecked')}
              >
                <CheckboxWrapper>
                  { isIndeterminate &&
                    <IndeterminateCheckbox
                      id={id}
                      checked={checked}
                      onChange={(checkedState) => {
                        this.props.onCheckboxChange(checkedState, option);
                      }}
                    />
                  }
                  { !isIndeterminate &&
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={(evt) => {
                        evt.stopPropagation();
                        this.props.onCheckboxChange(evt.target.checked, option);
                      }}
                    />
                  }
                </CheckboxWrapper>
                <OptionLabel
                  htmlFor={id}
                  changedToChecked={option.get('changedToChecked')}
                  changedToUnchecked={option.get('changedToUnchecked')}
                >
                  <Option
                    bold={option.get('labelBold') || checked}
                    reference={typeof option.get('reference') !== 'undefined' && option.get('reference') !== null ? option.get('reference').toString() : ''}
                    label={option.get('label')}
                    isNew={option.get('isNew')}
                  />
                </OptionLabel>
                { option.get('showCount') && typeof option.get('count') !== 'undefined' &&
                  <OptionCount>
                    {option.get('count')}
                  </OptionCount>
                }
              </OptionWrapper>
            );
          })}
          { (!options || options.size === 0) &&
            <Empty>
              <FormattedMessage {...messages.empty} />
            </Empty>
          }
        </ListWrapper>
        { hasMore &&
          <More>
            <FormattedMessage
              {...messages.showingOptions}
              values={{
                no: options.size,
                total: this.props.options.size,
              }}
            />
            <MoreLink
              href="/"
              onClick={(evt) => {
                if (evt && evt.preventDefault) evt.preventDefault();
                this.showMore();
              }}
            >
              <FormattedMessage {...messages.showMore} />
            </MoreLink>
          </More>
        }
      </Styled>
    );
  }
}


OptionList.propTypes = {
  options: PropTypes.object,
  onCheckboxChange: PropTypes.func,
};

export default OptionList;
