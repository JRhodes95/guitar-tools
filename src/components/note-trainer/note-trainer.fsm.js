import { Machine, assign } from "xstate";

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

const noteTrainerMachine = Machine(
  {
    id: "noteTrainer",
    context: {
      notes,
      strings,
      noteIndex: 0,
      stringIndex: 0,
      noteLock: false,
      stringLock: false,
      timeElapsed: 0,
      interval: 100,
      duration: 3000,
    },
    initial: "inactive",
    on: {
      RESET_TIMER: { actions: "resetTimer" },
      NEXT_NOTE: { actions: "chooseNextNote" },
      NEXT_STRING: { actions: "chooseNextString" },
      TOGGLE_NOTE_LOCK: { actions: "toggleNoteLock" },
      TOGGLE_STRING_LOCK: { actions: "toggleStringLock" },
      SET_DURATION: { actions: "setDuration" },
    },
    states: {
      inactive: {
        on: {
          START_TIMER: {
            target: "timerActive",
            actions: ["chooseNextNote", "chooseNextString"],
          },
        },
      },

      timerActive: {
        invoke: {
          src: (context) => (sendEvent) => {
            const interval = setInterval(() => {
              sendEvent("TICK");
            }, context.interval);

            return () => {
              clearInterval(interval);
            };
          },
        },
        always: {
          cond: "timerHasFinished",
          actions: ["resetTimer", "chooseNextNote", "chooseNextString"],
        },
        on: {
          TICK: { actions: "incrementTimer" },
          STOP_TIMER: { target: "inactive" },
        },
      },
    },
  },
  {
    guards: {
      timerHasFinished: (context) => context.timeElapsed >= context.duration,
      stringIsLocked: (context) => context.stringLock === true,
      noteIsLocked: (context) => context.noteLock === true,
    },
    actions: {
      chooseNextNote: assign({
        noteIndex: (context) =>
          context.noteLock
            ? context.noteIndex
            : generateNonRepeatedIndex(context.noteIndex, notes),
      }),
      chooseNextString: assign({
        stringIndex: (context) =>
          context.stringLock
            ? context.stringIndex
            : generateNonRepeatedIndex(context.stringIndex, strings),
      }),
      toggleStringLock: assign({
        stringLock: (context) => !context.stringLock,
      }),
      toggleNoteLock: assign({
        noteLock: (context) => !context.noteLock,
      }),
      incrementTimer: assign({
        timeElapsed: (context) => context.timeElapsed + context.interval,
      }),
      resetTimer: assign({
        timeElapsed: 0,
      }),
      setDuration: assign({
        duration: (_context, event) => event.value,
      }),
    },
  }
);

export default noteTrainerMachine;
