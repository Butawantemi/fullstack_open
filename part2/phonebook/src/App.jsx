import { useState } from "react";

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
    const newObject = {
      name: newName,
      number: newNumber,
      id: persons.length > 0 ? Math.max(...persons.map((p) => p.id)) + 1 : 1,
    };

    const exitsName = persons.some((p) => p.name === newName);
    if (exitsName) {
      window.alert(`${newName} is already added to phonebook`);
      return;
    }
    setPersons(persons.concat(newObject));
    setNewName("");
    setNewNumber("");
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

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((p) => (
        <p key={p.name}>
          {p.name} {p.number}
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

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
      <Persons persons={personToShow} />
    </div>
  );
};

export default App;
