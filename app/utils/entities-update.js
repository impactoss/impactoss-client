import apiRequest from 'utils/api-request';

export function updateAssociationsRequest(path, associations) {
  // create action-category associations
  let requests = [];
  requests = requests.concat(associations.create.map((payload) =>
    createAssociationRequest(path, payload)));

  // delete action-category associations
  requests = requests.concat(associations.delete.map((associationId) =>
    deleteAssociationRequest(path, associationId)));

  return Promise.all(requests);
}
export function updateAssociationsBatchRequest(path, associations) {
  let ops = [];
  if (associations.create) {
    ops = ops.concat(associations.create.map((payload) => ({
      method: 'post',
      url: `${path}`,
      params: payload,
    })));
  }
  if (associations.delete) {
    ops = ops.concat(associations.delete.map((associationId) => ({
      method: 'delete',
      url: `${path}/${associationId}`,
    })));
  }
  const payload = {
    ops,
    sequential: true,
  };
  return apiRequest('post', 'batchapi', payload);
}

export function createAssociationRequest(path, payload) {
  return apiRequest('post', `${path}/`, payload);
}

export function deleteAssociationRequest(path, associationId) {
  return apiRequest('delete', `${path}/${associationId}`).then(() => ({
    id: associationId,
    type: 'delete',
  }));
}

export function updateEntitiesRequest(path, entities) {
  let requests = [];
  requests = requests.concat(entities.map((payload) =>
    updateEntityRequest(path, payload)));
  // update entity attributes
  return Promise.all(requests);
}

export function updateEntityRequest(path, payload) {
  // update entity attributes
  return apiRequest('put', `${path}/${payload.id}`, payload.attributes);
}

export function newEntityRequest(path, payload) {
  // create new entity with attributes
  return apiRequest('post', `${path}`, payload);
}

export function registerUserRequest(payload) {
  // create new entity with attributes
  return apiRequest('post', 'auth', payload);
}

export function updatePasswordRequest(payload) {
  // create new entity with attributes
  return apiRequest('put', 'auth', payload);
}
