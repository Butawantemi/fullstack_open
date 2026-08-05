import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;
const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad, all, feedbacks }) => {
  if (feedbacks.length === 0) {
    return <p>No feedback given.</p>;
  }
  const average = (good - bad) / all;
  const positive = (good / all) * 100;
  return (
    <table>
      <tbody>
        <StatisticLine text="Good" value={good} />
        <StatisticLine text="Neutral" value={neutral} />
        <StatisticLine text="Bad" value={bad} />
        <StatisticLine text="All" value={all} />
        <StatisticLine text="Average" value={average.toFixed(1)} />
        <StatisticLine text="Positive" value={`${positive.toFixed(1)} %`} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  const handleGoodClick = () => {
    setFeedbacks(feedbacks.concat("G"));
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setFeedbacks(feedbacks.concat("N"));
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setFeedbacks(feedbacks.concat("B"));
    setBad(bad + 1);
  };

  const all = good + neutral + bad;

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />

      <h1>Statistics: </h1>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        feedbacks={feedbacks}
      />
    </div>
  );
};

export default App;
