import { useMachine } from "@xstate/react";
import styled from "styled-components";
import noteTrainerMachine from "./note-trainer.fsm";

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

const NoteTrainer = () => {
  const [state, send] = useMachine(noteTrainerMachine);
  const {
    context: {
      notes,
      strings,
      noteIndex,
      stringIndex,
      noteLock,
      stringLock,
      timeElapsed,
    },
  } = state;

  return (
    <Card>
      <h2>Note Trainer</h2>
      <p>Random note generator to help learn note placement on each sting.</p>
      <NoteContainer>
        <div>
          <h3>String</h3>
          <button onClick={() => send("TOGGLE_STRING_LOCK")}>
            {stringLock ? "Unlock String" : "Lock String"}
          </button>
          <NoteDisplayText>{strings[stringIndex]}</NoteDisplayText>
        </div>
        <div>
          <h3>Note</h3>
          <button onClick={() => send("TOGGLE_NOTE_LOCK")}>
            {noteLock ? "Unlock Note" : "Lock Note"}
          </button>
          <NoteDisplayText>{notes[noteIndex]}</NoteDisplayText>
        </div>
      </NoteContainer>
      <ControlsContainer>
        <h2>Controls</h2>
        <button onClick={() => send("NEXT_STRING")} disabled={stringLock}>
          Next string
        </button>
        <button onClick={() => send("NEXT_NOTE")} disabled={noteLock}>
          Next note
        </button>
      </ControlsContainer>
      <div>
        <h2>{(timeElapsed / 1000).toFixed(1)}</h2>
        <button
          onClick={() => send("START_TIMER")}
          disabled={state.matches("timerActive")}
        >
          Start timer
        </button>
        <button
          onClick={() => send("STOP_TIMER")}
          disabled={state.matches("inactive")}
        >
          Stop timer
        </button>
        <button onClick={() => send("RESET_TIMER")}>Reset timer</button>
      </div>
    </Card>
  );
};

export default NoteTrainer;
