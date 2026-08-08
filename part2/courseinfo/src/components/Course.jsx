const Header = ({ courses }) => {
  return <h1>{courses.name}</h1>;
};

const Content = ({ courses }) => {
  const total = courses.parts.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exercises,
    0,
  );
  return (
    <>
      {courses.parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
      <h3>total of {total} exercises</h3>
    </>
  );
};

const Course = ({ courses }) => {
  console.log(courses[0].parts);
  return (
    <div>
      <h1>Web development curriculum</h1>
      <Header courses={courses[0]} />
      <Content courses={courses[0]} />
      <Header courses={courses[1]} />
      <Content courses={courses[1]} />
    </div>
  );
};

export default Course;
