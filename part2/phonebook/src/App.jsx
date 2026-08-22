import { useEffect, useState } from "react";
import personService from "./service/persons";

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter show with <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const addName = (e) => {
    e.preventDefault();

    const exitingPerson = persons.find((p) => p.name === newName);

    if (exitingPerson) {
      const userConfirm = window.confirm(
        `${newName} is already added to phonebook, replace the older number with a new one?`,
      );

      const updatedObject = { ...exitingPerson, number: newNumber };

      if (userConfirm) {
        personService
          .update(exitingPerson.id, updatedObject)
          .then((returnedObject) => {
            setPersons(
              persons.map((p) =>
                p.id === exitingPerson.id ? returnedObject : p,
              ),
            );
            setNewName("");
            setNewNumber("");
          });
        return;
      }
    }

    const newObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(newObject).then((returnObject) => {
      setPersons(persons.concat(returnObject));
      setNewName("");
      setNewNumber("");
    });
  };

  return (
    <form onSubmit={addName}>
      <div>
        name:{" "}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, setPersons }) => {
  const handleDelete = (id, name) => {
    window.alert(`Delete ${name}`);

    personService.deletePerson(id).then(() => {
      setPersons(persons.filter((p) => p.id !== id));
    });
  };

  return (
    <div>
      {persons.map((p) => (
        <p key={p.id}>
          {p.name} {p.number}
          <button onClick={() => handleDelete(p.id, p.name)}>Delete</button>
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personService.getAll().then((initial) => {
      setPersons(initial);
    });
  }, []);

  const [filter, setFilter] = useState("");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const personToShow =
    filter === ""
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(filter.toLowerCase()),
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>
      <Persons persons={personToShow} setPersons={setPersons} />
    </div>
  );
};

export default App;
