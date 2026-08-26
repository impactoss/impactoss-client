import apiRequest from 'utils/api-request';

export function updateAssociationsRequest(path, associations, currentPassword) {
  // create action-category associations
  let requests = [];
  if (associations.create) {
    requests = requests.concat(
      associations.create.map(
        (payload) => newEntityRequest(path, payload, currentPassword),
      ),
    );
  }

  // delete action-category associations
  if (associations.delete) {
    requests = requests.concat(
      associations.delete.map(
        (associationId) => deleteEntityRequest(path, associationId, currentPassword),
      ),
    );
  }

  return Promise.all(requests);
}

export function deleteEntityRequest(path, entityId, currentPassword) {
  return apiRequest(
    'delete',
    `${path}/${entityId}`,
    currentPassword ? { current_password: currentPassword } : {},
  ).then(() => ({
    id: entityId,
    type: 'delete',
  }));
}

export function updateEntityRequest(path, payload, currentPassword) {
  // update entity attributes
  return apiRequest('put', `${path}/${payload.id}`, {
    ...payload.attributes,
    ...(currentPassword ? { current_password: currentPassword } : {}),
  });
}

export function newEntityRequest(path, payload, currentPassword) {
  // create new entity with attributes
  return apiRequest('post', `${path}`, {
    ...payload,
    ...(currentPassword ? { current_password: currentPassword } : {}),
  });
}

export function registerUserRequest(payload) {
  // create new entity with attributes
  return apiRequest('post', 'auth', payload);
}

export function updatePasswordRequest(payload) {
  // create new entity with attributes
  return apiRequest('put', 'auth', payload);
}
