import axios from "axios";
const url = "/api/persons";

const getAllPersons = () => {
  const request = axios.get(url);
  return request.then((response) => response.data);
};

const setNewPerson = (newPersonObject) => {
  const request = axios.post(url, newPersonObject);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${url}/${id}`);
  return request.then((response) => {
    response.data});
};

const updatePerson = (id, newPerson) => {
  const request = axios.put(`${url}/${id}`, newPerson);
  return request.then((response) => response.data);
};

export default {
  getAllPersons,
  setNewPerson,
  deletePerson,
  updatePerson,
};
