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

const chooseNextNote = assign({
  noteIndex: (context) => generateNonRepeatedIndex(context.noteIndex, notes),
});

const chooseNextString = assign({
  stringIndex: (context) =>
    generateNonRepeatedIndex(context.stringIndex, strings),
});

const noteTrainerMachine = Machine(
  {
    id: "noteTrainer",
    initial: "inactive",
    states: {
      inactive: {
        on: {
          NEXT_NOTE: { target: "inactive", actions: "chooseNextNote" },
          NEXT_STRING: { target: "inactive", actions: "chooseNextString" },
        },
      },
    },
    context: {
      notes,
      strings,
      noteIndex: 0,
      stringIndex: 0,
    },
  },
  {
    actions: {
      chooseNextNote,
      chooseNextString,
    },
  }
);

export default noteTrainerMachine;
