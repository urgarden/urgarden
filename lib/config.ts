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

export const organicPlantCare = {
  category: "Organic",
  methods: [
    {
      name: "Banana Tea",
      preparation:
        "Boil 4 well-ripened banana skins in 1 liter of water for 10-15 minutes.",
      usage:
        "Encourages flowering and fruiting of plants. Dilute with water in a ratio of 1 liter of tea to 2 liters of water before applying.",
    },
    {
      name: "Garlic Infusion",
      preparation:
        "Chop 15 grams of garlic and 10 grams of soap into 1 liter of water. Mix well and filter.",
      usage:
        "Acts as a repellent and insecticide for most pests. Apply at sunrise or sunset for about 5 days.",
    },
    {
      name: "Eggshells",
      preparation: "Dry a few eggshells and crush them into small pieces.",
      usage:
        "Works as a natural fertilizer and repels snails and some caterpillars. Spread the crushed eggshells at the base of the plants.",
    },
  ],
};

export const compostMaterials = {
  category: "Compost Materials",
  types: [
    {
      type: "Organic Material",
      items: [
        "Fruit waste",
        "Vegetable waste",
        "Fresh pruning",
        "Coffee grounds",
        "Eggshells",
        "Tea Bags",
        "Fresh manure",
      ],
    },
    {
      type: "Dry Material",
      items: [
        "Dry leaves",
        "Cardboard and paper",
        "Cardboard egg cartons",
        "Paper napkins",
        "Kitchen paper",
        "Sawdust",
        "Ashes",
        "Straw",
      ],
    },
  ],
};
