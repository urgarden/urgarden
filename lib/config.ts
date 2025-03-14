// Import local images using require
const tomato = require("@/assets/images/tomato.jpg");
const carrot = require("@/assets/images/carrot.jpg");
const cabage = require("@/assets/images/cabage.jpg");
const cucumber = require("@/assets/images/cucumber.jpg");
const pepper = require("@/assets/images/pepper.jpg");

const funnel = require("@/assets/images/bulb/fennel/f7.jpg");
const garlic = require("@/assets/images/bulb/garlic/g6.jpg");
const onion = require("@/assets/images/bulb/onion/o8.webp");
const scallion = require("@/assets/images/bulb/scallion/w7.jpg");
const shallot = require("@/assets/images/bulb/shallot/o7.png");

const artichoke = require("@/assets/images/flower/artichoke/artichoke.jpg");
const bananaBlossom = require("@/assets/images/flower/banana/b7.jpg");
const cauliflower = require("@/assets/images/flower/cauli flower/7.jpg");
const pigeonwings = require("@/assets/images/flower/pigeonwings/a6.jpg");

const cabbage = require("@/assets/images/leaf/cabbage/c5.webp");
const celery = require("@/assets/images/leaf/celery/celery.webp");
const chard = require("@/assets/images/leaf/chard/chard.webp");
const cilantro = require("@/assets/images/leaf/cilantro/cilantro.webp");
const kale = require("@/assets/images/leaf/kale/kale.webp");
const lettuce = require("@/assets/images/leaf/lettuce/lettuce.jpg");
const onionLeaf = require("@/assets/images/leaf/onion/onionLeaf.webp");
const parsley = require("@/assets/images/leaf/parsley/parsley.webp");
const spinach = require("@/assets/images/leaf/spinach/spinach.webp");

const cucumberFruit = require("@/assets/images/fruit/cucumber/cucumber.jpg");
const okra = require("@/assets/images/fruit/okra/okra.webp");
const pepperFruit = require("@/assets/images/fruit/pepper/pepper.webp");
const squash = require("@/assets/images/fruit/squash/squash.jpg");
const tomatoFruit = require("@/assets/images/fruit/tomato/tomato.webp");

const carrotRoot = require("@/assets/images/root/carrot/carrot.jpg");
const ginger = require("@/assets/images/root/ginger/ginger.jpg");
const potato = require("@/assets/images/root/potato/potato.jpg");
const radish = require("@/assets/images/root/radish/radish.jpg");
const sweetPotato = require("@/assets/images/root/sweet potato/sweetPotato.jpg");

export const vegiImage = [
  { id: "1", name: "Tomato", image: tomato },
  { id: "2", name: "Carrot", image: carrot },
  { id: "3", name: "cabage", image: cabage },
  { id: "4", name: "Pepper", image: pepper },
  { id: "5", name: "Cucumber", image: cucumber },
];

export const recommendedPlants = [
  { id: "1", name: "Tomato", image: tomato },
  { id: "2", name: "Carrot", image: carrot },
  { id: "3", name: "cabage", image: cabage },
  { id: "4", name: "Pepper", image: pepper },
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

export const Veggies = {
  leaf: [
    {
      id: 1,
      name: "Spinach",
      description: "A nutrient-rich leafy green vegetable.",
      type: "leaf",
      image: spinach,
    },
    {
      id: 2,
      name: "Parsley",
      description: "An aromatic herb used for flavoring dishes.",
      type: "leaf",
      image: parsley,
    },
    {
      id: 3,
      name: "Onion",
      description: "A versatile vegetable with pungent, edible leaves.",
      type: "leaf",
      image: onionLeaf,
    },
    {
      id: 4,
      name: "Lettuce",
      description: "A crisp and refreshing salad staple.",
      type: "leaf",
      image: lettuce,
    },
    {
      id: 5,
      name: "Kale",
      description: "A hardy, nutrient-packed leafy green.",
      type: "leaf",
      image: kale,
    },
    {
      id: 6,
      name: "Chard",
      description: "A leafy vegetable with colorful stems.",
      type: "leaf",
      image: chard,
    },
    {
      id: 7,
      name: "Celery",
      description: "A crunchy stalk with edible leaves.",
      type: "leaf",
      image: celery,
    },
    {
      id: 8,
      name: "Cabbage",
      description: "A dense leafy vegetable, often used in slaws.",
      type: "leaf",
      image: cabbage,
    },

    {
      id: 9,
      name: "Cilantro",
      description: "A fragrant herb used in diverse cuisines.",
      type: "leaf",
      image: cilantro,
    },
  ],
  fruit: [
    {
      id: 11,
      name: "Tomato",
      description: "A juicy, red fruit commonly used in salads and sauces.",
      type: "fruit",
      image: tomatoFruit,
    },
    {
      id: 12,
      name: "Squash",
      description: "A versatile vegetable with a slightly sweet taste.",
      type: "fruit",
      image: squash,
    },
    {
      id: 13,
      name: "Pepper",
      description: "A colorful fruit with mild to spicy flavors.",
      type: "fruit",
      image: pepperFruit,
    },
    {
      id: 14,
      name: "Okra",
      description: "A green pod vegetable known for its slimy texture.",
      type: "fruit",
      image: okra,
    },
    {
      id: 15,
      name: "Cucumber",
      description: "A refreshing fruit often used in salads and pickles.",
      type: "fruit",
      image: cucumberFruit,
    },
  ],
  bulb: [
    {
      id: 16,
      name: "Shallot",
      description: "A small, sweet, and mild-flavored bulb vegetable.",
      type: "bulb",
      image: shallot,
    },
    {
      id: 17,
      name: "Scallions",
      description: "Young onions with a mild flavor and edible green tops.",
      type: "bulb",
      image: scallion,
    },
    {
      id: 18,
      name: "Onion",
      description: "A staple vegetable with a pungent and versatile flavor.",
      type: "bulb",
      image: onion,
    },
    {
      id: 19,
      name: "Garlic",
      description: "A flavorful and aromatic bulb used in many cuisines.",
      type: "bulb",
      image: garlic,
    },
    {
      id: 20,
      name: "Fennel",
      description:
        "A bulb with a mild anise flavor, often used in salads and soups.",
      type: "bulb",
      image: funnel,
    },
  ],
  flower: [
    {
      id: 21,
      name: "Cauliflower",
      description: "A white flowering vegetable with a mild flavor.",
      type: "flower",
      image: cauliflower,
    },
    {
      id: 22,
      name: "Artichoke",
      description: "A thistle-like flower vegetable with tender hearts.",
      type: "flower",
      image: artichoke,
    },
    {
      id: 23,
      name: "Banana Blossom",
      description: "A purple flower used in various Asian cuisines.",
      type: "flower",
      image: bananaBlossom,
    },
    {
      id: 24,
      name: "Asian Pigeonwings",
      description: "A vibrant blue flower often used as a natural dye.",
      type: "flower",
      image: pigeonwings,
    },
  ],
  root: [
    {
      id: 25,
      name: "Carrot",
      description: "A crunchy root vegetable, typically orange in color.",
      type: "root",
      image: carrotRoot,
    },
    {
      id: 26,
      name: "Sweet Potato",
      description: "A sweet and starchy root vegetable, rich in nutrients.",
      type: "root",
      image: sweetPotato,
    },
    {
      id: 27,
      name: "Potato",
      description: "A versatile root vegetable used in a variety of dishes.",
      type: "root",
      image: potato,
    },
    {
      id: 28,
      name: "Radish",
      description: "A peppery-flavored root, often used in salads.",
      type: "root",
      image: radish,
    },
    {
      id: 29,
      name: "Ginger",
      description: "A spicy and aromatic root used in cooking and tea.",
      type: "root",
      image: ginger,
    },
  ],
};
