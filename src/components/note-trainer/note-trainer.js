import { useState } from "react";
import styled from "styled-components";

const Card = styled.div`
  border-radius: var(--spacing-s);
  background-color: white;
  padding: var(--spacing-m);
  margin: var(--spacing-m);
`;

const NoteContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  text-align: center;
`;

const ControlsContainer = styled.div``;

const NoteDisplayText = styled.div`
  font-weight: bold;
  font-size: 6rem;
`;

const notes = ["A", "B", "C", "D", "E", "F", "G"];
const strings = ["E", "A", "D", "G", "B", "E"];

const generateRandomIndex = (arrayLength) => {
  return Math.floor(Math.random() * arrayLength);
};

const generateNonRepeatedIndex = (previousIndex, array) => {
  let newIndex = generateRandomIndex(array.length);
  while (newIndex === previousIndex) {
    newIndex = generateRandomIndex(array.length);
  }
  return newIndex;
};

const NoteTrainer = () => {
  const [currentString, setString] = useState(5);
  const [currentNote, setNote] = useState(1);

  const chooseNextString = () => {
    setString((previousIndex) =>
      generateNonRepeatedIndex(previousIndex, strings)
    );
  };

  const chooseNextNote = () => {
    setNote((previousIndex) => generateNonRepeatedIndex(previousIndex, notes));
  };

  return (
    <Card>
      <h2>Note Trainer</h2>
      <p>Random note generator to help learn note placement on each sting.</p>
      <NoteContainer>
        <div>
          <h3>String</h3>
          <NoteDisplayText>{strings[currentString]}</NoteDisplayText>
        </div>
        <div>
          <h3>Note</h3>
          <NoteDisplayText>{notes[currentNote]}</NoteDisplayText>
        </div>
      </NoteContainer>
      <ControlsContainer>
        <h2>Controls</h2>
        <button onClick={chooseNextString}>Next string</button>
        <button onClick={chooseNextNote}>Next note</button>
      </ControlsContainer>
    </Card>
  );
};

export default NoteTrainer;
