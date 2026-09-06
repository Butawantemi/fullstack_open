const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());

morgan.token("req-body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body",
  ),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello, world!</h1>");
});

app.get("/info", (request, response) => {
  response.send(
    `<div>
    <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date().toString()}</p>
    </div>`,
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: "name and number are required!" });
  }

  const exitingName = persons.some(
    (person) => person.name.toLowerCase() === body.name.toLowerCase(),
  );

  if (exitingName) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: String(Math.floor(Date.now() * Math.random())),
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
