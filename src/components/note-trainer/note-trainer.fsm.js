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
      timeElapsed: 0,
      interval: 100,
      duration: 3000,
    },
    initial: "inactive",
    on: {
      RESET_TIMER: { actions: "resetTimer" },
      NEXT_NOTE: { actions: "chooseNextNote" },
      NEXT_STRING: { actions: "chooseNextString" },
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
        on: {
          "": {
            cond: "timerHasFinished",
            actions: ["resetTimer", "chooseNextNote", "chooseNextString"],
          },
          TICK: { actions: "incrementTimer" },
          STOP_TIMER: { target: "inactive" },
        },
      },
    },
  },
  {
    guards: {
      timerHasFinished: (context) => context.timeElapsed >= context.duration,
    },
    actions: {
      chooseNextNote: assign({
        noteIndex: (context) =>
          generateNonRepeatedIndex(context.noteIndex, notes),
      }),
      chooseNextString: assign({
        stringIndex: (context) =>
          generateNonRepeatedIndex(context.stringIndex, strings),
      }),
      incrementTimer: assign({
        timeElapsed: (context) => context.timeElapsed + context.interval,
      }),
      resetTimer: assign({
        timeElapsed: 0,
      }),
    },
  }
);

export default noteTrainerMachine;
