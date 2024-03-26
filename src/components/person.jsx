const Person = ({ person, deletePerson }) => {
  return (
    <div>
      <li>
        {person.name} {person.number}
      </li>
      <button onClick={deletePerson}>delete</button>
    </div>
  );
};

export default Person;
