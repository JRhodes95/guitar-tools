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

const NoteDisplayText = styled.div`
  font-weight: bold;
  font-size: 6rem;
`;

const TimerDisplay = styled.div`
  font-family: monospace;
  font-weight: bold;
  font-size: 4rem;
`;

const NoteTrainer = () => {
  const [state, send] = useMachine(noteTrainerMachine, { devTools: true });
  const {
    context: {
      notes,
      strings,
      noteIndex,
      stringIndex,
      noteLock,
      stringLock,
      timeElapsed,
      duration,
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
          <button onClick={() => send("NEXT_STRING")} disabled={stringLock}>
            Next string
          </button>
        </div>
        <div>
          <h3>Note</h3>
          <button onClick={() => send("TOGGLE_NOTE_LOCK")}>
            {noteLock ? "Unlock Note" : "Lock Note"}
          </button>
          <NoteDisplayText>{notes[noteIndex]}</NoteDisplayText>
          <button onClick={() => send("NEXT_NOTE")} disabled={noteLock}>
            Next note
          </button>
        </div>
      </NoteContainer>
      <div>
        <h2>Controls</h2>
        <label htmlFor="duration-select">Timer duration:</label>
        <select
          name="duration"
          id="duration-select"
          value={duration}
          onChange={(event) =>
            send({ type: "SET_DURATION", value: parseInt(event.target.value) })
          }
        >
          <option value={1000}>1.0</option>
          <option value={2000}>2.0</option>
          <option value={3000}>3.0</option>
          <option value={4000}>4.0</option>
          <option value={5000}>5.0</option>
          <option value={6000}>6.0</option>
          <option value={7000}>7.0</option>
          <option value={8000}>8.0</option>
          <option value={9000}>9.0</option>
          <option value={10000}>10.0</option>
        </select>
        <TimerDisplay>{`${((duration - timeElapsed) / 1000).toFixed(
          1
        )} s`}</TimerDisplay>
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
        <button
          onClick={() => send("RESET_TIMER")}
          disabled={state.matches("inactive") && timeElapsed === 0}
        >
          Reset timer
        </button>
      </div>
    </Card>
  );
};

export default NoteTrainer;
