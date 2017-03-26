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

export function createAssociationRequest(path, payload) {
  return apiRequest('post', `${path}/`, payload);
}

export function deleteAssociationRequest(path, associationId) {
  return apiRequest('delete', `${path}/${associationId}`).then(() => ({
    id: associationId,
    type: 'delete',
  }));
}

export function updateEntityRequest(path, payload) {
  // update entity attributes
  return apiRequest('put', `${path}/${payload.id}`, payload.attributes);
}

export function newEntityRequest(path, payload) {
  // create new entity with attributes
  return apiRequest('post', `${path}`, payload);
}
