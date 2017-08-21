import validateRequired from './validate-required';
export default function validatePresenceConditional(valueCondition, valueRequired) {
  return valueCondition ? validateRequired(valueRequired) : true;
}
