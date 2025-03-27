// Import local images using require
const tomato = require("@/assets/images/tomato.jpg");
const carrot = require("@/assets/images/carrot.jpg");
const cabage = require("@/assets/images/cabage.jpg");
const cucumber = require("@/assets/images/cucumber.jpg");
const pepper = require("@/assets/images/pepper.jpg");

export const vegiImage = [
  { id: "1", name: "Tomato", image: tomato },
  { id: "2", name: "Carrot", image: carrot },
  { id: "3", name: "cabage", image: cabage },
  { id: "5", name: "Cucumber", image: cucumber },
];

export const categories = [
  { id: 1, title: "Leaf", value: "leaf" },
  { id: 2, title: "Fruit", value: "fruit" },
  { id: 3, title: "Bulb", value: "bulb" },
  { id: 4, title: "Flower", value: "flower" },
  { id: 5, title: "Root", value: "root" },
  { id: 6, title: "Stem", value: "stem" },
];
