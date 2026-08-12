import { useState } from "react";


const Filter = () => {
  
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const addName = (e) => {
    e.preventDefault();
    const newObject = {
      name: newName,
      number: newNumber,
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

  const handleNameOnchange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberOnchange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterOnchange = (e) => {
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
      <div>
        filter show with{" "}
        <input value={filter} onChange={handleFilterOnchange} />
      </div>
      <h2>Numbers</h2>
        {personToShow.map((p) => (
          <p>
            {p.name} {p.number}
          </p>
        ))}
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameOnchange} />
          <div>
            number: <input value={newNumber} onChange={handleNumberOnchange} />
          </div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((p) => (
        <p key={p.name}>
          {p.name} {p.number}
        </p>
      ))}
    </div>
  );
};

export default App;
