import { useState, useEffect } from "react";
import Person from "./components/person";
import personServices from "./services/personServices";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("newName");
  const [newNumber, setNewNumber] = useState("375");
  const [shown, setShown] = useState("");
  const [notifications, setNotifications] = useState({
    message: null,
    result: null,
  });

  useEffect(() => {
    personServices.getAllPersons().then((persons) => setPersons(persons));
  }, []);

  const personsToShow =
    shown === ""
      ? persons
      : persons.filter((person) =>
        person.name.toLocaleLowerCase().startsWith(shown.toLocaleLowerCase())
      );

  const deletePerson = (person) => {
    const confirmation = window.confirm(`Delete ${person.name}?`);
    if (confirmation) {
      personServices
        .deletePerson(person.id)
        .then(result => {
          setPersons(
            persons.filter((p => p.id !== person.id)
            ));
          setNotifications({
            message: `The ${person.name} has been deleted`,
            result: true,
          });
          setTimeout(
            () => setNotifications({ message: null, result: null }),
            3000
          );
        })
        .catch((err) => {
          console.log(err);
          setNotifications({
            message: `Information of ${person.name} has already been removed from server`,
            result: false,
          });
          setPersons(persons.filter(p => p.id !== person.id));
          setTimeout(() => {
            setNotifications({ message: null, result: null });
          }, 3000);
        });
    } else {
      setNotifications({
        message: `You have denied to delete ${person.name}`,
        result: true,
      });
      setTimeout(() => setNotifications({ message: null, result: null }), 3000);
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleShownChange = (event) => {
    console.log(event.target.value);
    setShown(event.target.value);
  };

  const submitPerson = (event) => {
    event.preventDefault();

    const foundPerson = persons.find((person) => person.name === newName);

    if (foundPerson) {
      const confirmation = window.confirm(
        `${foundPerson.name} is already added to you phonebook, would you like to replace it?`
      );
      if (confirmation) {
        personServices
          .updatePerson(foundPerson.id, { name: newName, number: newNumber })
          .then((p) => {
            setPersons(
              persons.map((person) =>
                person.id !== foundPerson.id ? person : p
              )
            );
            setNotifications({
              message: `Update ${foundPerson.name}`,
              result: true,
            });
            setTimeout(() => {
              setNotifications({ message: null, result: null });
            }, 3000);
          })
          .catch(error => {
            if (error.response.data.name === "ValidationError") {
              setNotifications({
                message: error.response.data.error,
                result: false,
              });
              setTimeout(
                () => setNotifications({ message: null, result: null }),
                3000
              );
            } else {
              setNotifications({
                message: `Information of ${foundPerson.name} has already been removed from server`,
                result: false,
              });
              setPersons(
                persons.filter((person) => person.id !== foundPerson.id)
              );
              setTimeout(
                () => setNotifications({ message: null, result: null }),
                3000
              );
            }
          })
      } else {
        setNotifications({
          message: `Denied update ${foundPerson.name}`,
          result: true,
        });
        setTimeout(() => {
          setNotifications({ message: null, result: null });
        }, 3000);
      }
    } else {
      const newPersonObject = {
        name: newName,
        number: newNumber,
      };
      personServices
        .setNewPerson(newPersonObject)
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          setNotifications({ message: `Add ${newPerson.name}`, result: true });
          setTimeout(() => {
            setNotifications({ message: null, result: null });
          }, 3000);
        })
        .catch((error) => {
          setNotifications({
            message: error.response.data.error,
            result: false,
          });
          setTimeout(() => {
            setNotifications({ message: null, result: null });
          }, 3000);
        });
    }
    setNewName("newName");
    setNewNumber("375");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notifications.message}
        result={notifications.result}
      />
      Search: <input value={shown} onChange={handleShownChange} />
      <p>
        <b>Add number</b>
      </p>
      <form onSubmit={submitPerson}>
        <div>
          <p>
            number: <input value={newNumber} onChange={handleNumberChange} />
          </p>
          <p>
            name: <input value={newName} onChange={handleNameChange} />
          </p>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map((person) => (
        <Person
          key={person.id}
          person={person}
          deletePerson={() => deletePerson(person)}
        />
      ))}
    </div>
  );
};

export default App;
