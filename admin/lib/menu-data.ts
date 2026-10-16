export interface CafeMenuItem {
  name: string;
  description?: string;
  price?: number;
}

export interface CafeMenuSection {
  id: string;
  title: string;
  note?: string;
  items: CafeMenuItem[];
}

export const cafeMenu: CafeMenuSection[] = [
  {
    id: "breakfast", title: "Breakfast", note: "Served with an egg dish where indicated.", items: [
      { name: "Complete English Breakfast", description: "Toast, pancakes & waffles, sausages, bacon, baked beans, grilled tomatoes, grilled mushrooms & fruit salad.", price: 4000 },
      { name: "Woodhouse Special", description: "Toast, oat/custard, sausages, bacon, egg, grilled tomatoes, grilled mushrooms, yoghurt & fruit salad.", price: 4000 },
      { name: "Noodles", description: "Vegetable noodles with carrots, green pepper, fresh tomatoes & onions.", price: 1500 },
      { name: "Chicken Noodles", description: "Carrot, green pepper, onions, shredded chicken breast.", price: 2000 },
      { name: "Half English Breakfast", description: "Served with an egg dish.", price: 2000 },
      { name: "Pancakes, Waffles or Toast", description: "With sausages, bacon, grilled tomatoes & grilled mushrooms.", price: 1500 },
      { name: "Pancakes or Waffles with Ice Cream", description: "Add fruit topping or Nutella for ₦500.", price: 1500 },
      { name: "Pancakes with Nutella", price: 1800 },
      { name: "Scrambled Eggs", price: 1000 }, { name: "Fried Eggs", price: 1000 },
      { name: "Plain Omelette", price: 1000 }, { name: "Spanish Omelette", price: 1000 },
      { name: "Sunny Side Up", price: 1000 }, { name: "Boiled Eggs", price: 1000 },
      { name: "African Breakfast", description: "Served with a sauce: boiled/fried yam, boiled/fried potatoes or boiled/fried plantains.", price: 2000 },
      { name: "Akara & Pap / Custard / Oat", price: 1000 },
      { name: "Tomato Sauce", price: 1500 }, { name: "Egg Sauce", price: 1500 }, { name: "Vegetable Sauce", price: 1500 },
      { name: "Extra Toppings", description: "Fruits ₦200 · Whipped cream ₦300 · Nutella ₦500 · Ice cream ₦500" },
    ],
  },
  {
    id: "starters", title: "Starters", items: [
      { name: "Spring Rolls", price: 1000 }, { name: "Samosas", price: 1000 }, { name: "Chicken Kebab", price: 2000 },
      { name: "Peri Wings", price: 2000 }, { name: "Crispy Wings", price: 2000 }, { name: "Meat Balls", price: 2000 },
    ],
  },
  {
    id: "sides", title: "Sides", items: [
      { name: "Special Fried Rice", description: "Basmati rice, garlic, onions, egg, minced meat, carrot, green pepper & seasoning.", price: 1000 },
      { name: "Jollof Rice", description: "Basmati rice, carrot, green pepper, seasoning, sausage, garlic & ginger.", price: 1000 },
      { name: "French Fries", price: 500 }, { name: "Yam Fries", price: 500 }, { name: "Plantain Fries", price: 500 },
    ],
  },
  {
    id: "salads", title: "Salads", items: [
      { name: "Caesar Salad", description: "Black olives, lettuce, cucumber, crispy bread, fresh tomatoes, cabbage, shredded chicken with Caesar dressing.", price: 2000 },
      { name: "Garden Salad", description: "Cucumber, fresh tomatoes, lettuce, onions, cabbage, served with cocktail dressing.", price: 2000 },
      { name: "Coleslaw Salad", description: "Carrot and cabbage with mayonnaise/salad cream.", price: 500 },
    ],
  },
  {
    id: "mains", title: "Mains", items: [
      { name: "Grilled Chicken", price: 2000 }, { name: "Sport Chilli Fish", price: 2000 },
      { name: "Grilled Prawns", price: 3000 }, { name: "Butterfly Prawns", price: 3000 },
      { name: "Snails", price: 3000 }, { name: "Gizzard", price: 2000 },
      { name: "Crunchy Seafood Basket", description: "Crunchy fresh calamari & shrimps, served with zesty lemon aioli.", price: 3500 },
      { name: "Barbeque Wings", description: "Chicken wings served with blue cheese dip.", price: 2500 },
    ],
  },
  {
    id: "pasta", title: "Pasta", items: [
      { name: "Spaghetti Napolitana", description: "Tomato purée, fresh pepper, garlic, ginger, onions, seasoning & vegetable oil.", price: 1500 },
      { name: "Spaghetti Carbonara", description: "Garlic, bacon, onions, cooking cream, cheese, parsley & black pepper.", price: 2500 },
      { name: "Spaghetti Bolognaise", description: "Garlic, ginger, onions, minced beef, carrot, tomato purée & fresh pepper.", price: 2000 },
      { name: "Seafood Pasta", description: "Onions, garlic, ginger, shrimps, prawns, calamari, fish fillet, tomato purée, fresh pepper, basil & seasoning.", price: 3000 },
      { name: "Seafood Linguine", description: "Seafood with fresh cherry tomato, garlic, basil, lemon and fresh cream with parmesan cheese.", price: 4000 },
    ],
  },
  {
    id: "sandwiches", title: "Sandwiches", items: [
      { name: "Chicken & Cheese Sandwich", description: "Grilled chicken breast, cheddar cheese, sliced bread.", price: 1500 },
      { name: "Club Sandwich", description: "Grilled chicken breast, cucumber, fresh tomatoes, lettuce, egg, blue band, sliced bread & French fries.", price: 2000 },
      { name: "Tuna Sandwich", description: "Tuna fish, sliced bread & margarine.", price: 1500 },
      { name: "Chicken Panini", description: "Grilled chicken breast, sausage & onion sauté, fresh tomatoes, cucumber, lettuce & mayonnaise.", price: 2000 },
      { name: "Bacon & Sausage Panini", description: "Bacon, sausage, cucumber, lettuce, fresh tomatoes, onion & cabbage sauté, mayonnaise.", price: 2000 },
    ],
  },
  {
    id: "burgers", title: "Burgers", items: [
      { name: "Chicken Burger", description: "Onion & cabbage sauté, fresh tomatoes, lettuce, chicken filling, cheddar cheese, honey & yellow mustard.", price: 2000 },
      { name: "Beef Burger", description: "Onion & green pepper sauté, fresh tomatoes, cucumber, lettuce, beef filling, cheddar cheese, ketchup & mayonnaise.", price: 2000 },
      { name: "Lumber Jack", description: "Onion & cabbage sauté, double beef filling, cheddar cheese, sausage, honey & yellow mustard.", price: 3500 },
      { name: "Dasuki Burger", description: "Onion & green pepper sauté, omelette, beef filling, double cheddar juice, ketchup & mayonnaise.", price: 3000 },
      { name: "Miss Becky Burger", description: "Steamed onion, mushroom sauté, beef filling, fresh tomatoes, lettuce, honey & yellow mustard.", price: 2000 },
      { name: "Pita Burger", description: "Onion sauté, grilled prawns, fresh tomatoes, lettuce, beef filling, honey & yellow mustard.", price: 2500 },
      { name: "Chicken Suya Burger", description: "Peanut butter sauce, lettuce, tomato rondelle, onion rondelle, suya spice & cheddar cheese. Served with French fries.", price: 3500 },
      { name: "Chicken Mozzarella Burger", description: "Mushroom sauté, crispy fried chicken coated with bread crumbs, crispy lettuce, tomato rondelle, cheddar cheese, mozzarella sticks & onion ring. Served with French fries.", price: 3500 },
      { name: "Chicken Teriyaki Burger", description: "Slow-grilled chicken breast, crispy lettuce, julienne cucumber, carrot, beans sprout, cabbage, tomatoes rondelle, sesame seed, sesame oil & teriyaki sauce. Served with French fries.", price: 3500 },
      { name: "Chicken Guacamole Burger", description: "Slow-grilled chicken breast, crispy lettuce, tomato rondelle, cheddar cheese, guacamole paste & tomato salsa. Served with French fries.", price: 2800 },
      { name: "House Burger", description: "Slow-grilled beef, crispy lettuce, tomato & onion rondelle, cheddar cheese. Served with French fries.", price: 2500 },
      { name: "Chicken Pepperoni Burger", description: "Slow-grilled chicken, crispy lettuce, onion rondelle, cucumber rondelle, tomato rondelle, crispy egg, crispy toast, sliced pepperoni. Served with French fries.", price: 3500 },
    ],
  },
  {
    id: "coffee-tea", title: "Coffee & Tea", items: [
      { name: "Single Espresso", price: 700 }, { name: "Americano", price: 1000 },
      { name: "Café Latte", price: 1200 }, { name: "Cappuccino", price: 1200 }, { name: "Café Mocha", price: 1200 },
      { name: "Macchiato", price: 1200 }, { name: "Con Panna", price: 1200 }, { name: "Café Correcto", price: 1200 },
      { name: "Vanilla Latte", price: 1500 }, { name: "Strawberry Latte", price: 1500 }, { name: "Espresso with Liquor", price: 1500 },
      { name: "Iced Latte", price: 1500 }, { name: "Iced Mocha", price: 1500 }, { name: "Iced Caramel", price: 1500 },
      { name: "Iced Strawberry", price: 1500 }, { name: "Iced Hazelnut", price: 2000 },
      { name: "Chocolate Freak", price: 1000 }, { name: "Salted Caramel", price: 1000 }, { name: "White Chocolate", price: 1000 },
      { name: "Earl Gray Tea", price: 1000 }, { name: "Green Tea", price: 1000 }, { name: "Lemon & Lime Twist Tea", price: 1000 },
      { name: "Strawberry Sensation Tea", price: 1000 }, { name: "Vanilla Tranquillity Tea", price: 1000 },
      { name: "Caramel Frappuccino", price: 1500 }, { name: "Chocolate Frappuccino", price: 1500 }, { name: "Vanilla Frappuccino", price: 2000 },
      { name: "Baileys Caramel Frappuccino", price: 2000 }, { name: "Vodka Vanilla Frappuccino", price: 2500 },
    ],
  },
  {
    id: "drinks", title: "Drinks", items: [
      { name: "Long Island", description: "Cocktail · alcoholic", price: 2500 }, { name: "Sex on the Beach", description: "Cocktail · alcoholic", price: 2500 },
      { name: "Strawberry Mojito", description: "Cocktail · alcoholic", price: 2500 }, { name: "Long Beach Ice Tea", description: "Cocktail · alcoholic", price: 2500 },
      { name: "Bacardi", description: "Cocktail · alcoholic", price: 2500 }, { name: "Pina Colada", description: "Cocktail · alcoholic", price: 2000 },
      { name: "Cosmopolitan", description: "Cocktail · alcoholic", price: 2000 }, { name: "Margarita", description: "Cocktail · alcoholic", price: 2000 },
      { name: "Mojito", description: "Cocktail · alcoholic", price: 2000 }, { name: "Daiquiri", description: "Cocktail · alcoholic", price: 2000 },
      { name: "Frozen Daiquiri", description: "Cocktail · alcoholic", price: 2000 }, { name: "Tequila Sunrise", description: "Cocktail · alcoholic", price: 2000 },
      { name: "Chapman", description: "Mocktail · non-alcoholic", price: 1500 }, { name: "Punch Fruit", description: "Mocktail · non-alcoholic", price: 1500 },
      { name: "Virgin Colada", description: "Mocktail · non-alcoholic", price: 1500 }, { name: "Banana Pink", description: "Mocktail · non-alcoholic", price: 1500 },
      { name: "Christmas Punch", description: "Mocktail · non-alcoholic", price: 1500 }, { name: "Lady in Red", description: "Mocktail · non-alcoholic", price: 1500 },
      { name: "Honey Moon", description: "Mocktail · non-alcoholic", price: 1500 },
      { name: "Watermelon Juice", description: "Fresh juice", price: 1000 }, { name: "Pineapple Juice", description: "Fresh juice", price: 1000 },
      { name: "Mixed Fruit Juice", description: "Pineapple, watermelon & apple · Fresh juice", price: 1000 },
      { name: "Chivita", description: "Pack juice", price: 1000 }, { name: "Chi Exotic", description: "Pack juice", price: 1000 },
      { name: "Cranberry Juice", description: "Pack juice", price: 1500 },
      { name: "Banana Smoothie", description: "Smoothie", price: 1500 }, { name: "Apple Smoothie", description: "Smoothie", price: 1500 },
      { name: "Watermelon Smoothie", description: "Smoothie", price: 1500 }, { name: "Pineapple Smoothie", description: "Smoothie", price: 1500 },
      { name: "Mixed Fruit Smoothie", description: "Smoothie", price: 1500 },
      { name: "Vanilla Milkshake", price: 2000 }, { name: "Chocolate Milkshake", price: 2000 },
      { name: "Strawberry Milkshake", price: 2000 }, { name: "Caramel Milkshake", price: 2000 },
      { name: "Baileys Milkshake", price: 2500 }, { name: "Oreo Milkshake", price: 2500 },
      { name: "Coffee Milkshake", price: 2500 }, { name: "Strawberry Oreos Milkshake", price: 2500 },
      { name: "Caramel & Jack Daniels Milkshake", price: 2500 }, { name: "Tequila Dark Chocolate Milkshake", price: 2500 },
      { name: "Vanilla Jameson Milkshake", price: 2500 }, { name: "Nutella Milkshake", price: 2500 },
      { name: "Nutella (Jar)", price: 3000 }, { name: "Freak Shake", price: 3000 },
      { name: "Coke", description: "Soft drink · can", price: 500 }, { name: "Fanta", description: "Soft drink · can", price: 500 },
      { name: "Sprite", description: "Soft drink · can", price: 500 }, { name: "Malt", description: "Soft drink · can", price: 500 },
      { name: "Water (50 cl)", price: 200 },
      { name: "Heineken", description: "Beer · can", price: 500 }, { name: "Guinness Stout", description: "Beer · can", price: 500 },
      { name: "Star", description: "Beer · can", price: 500 }, { name: "Origin", description: "Beer · can", price: 500 },
      { name: "Star Radler", description: "Beer · can", price: 500 }, { name: "Hero", description: "Beer · can", price: 500 },
      { name: "Gulder", description: "Beer · can", price: 500 }, { name: "Smirnoff Ice", description: "Beer · can", price: 500 },
      { name: "Savanna", description: "Beer · can", price: 600 }, { name: "Hunters Gold", description: "Beer · can", price: 600 },
      { name: "Tequila", description: "Tots", price: 500 }, { name: "Vodka", description: "Tots", price: 500 },
      { name: "Gin", description: "Tots", price: 500 }, { name: "Jack Daniels", description: "Tots", price: 700 },
      { name: "Hennessy", description: "Tots", price: 1000 }, { name: "Black Label", description: "Tots", price: 1000 },
      { name: "Drosty Hof", description: "Wine & spirits", price: 4000 }, { name: "Castillo", description: "Wine & spirits", price: 4000 },
      { name: "Carlo Rossi", description: "Wine & spirits", price: 5000 }, { name: "Andre", description: "Wine & spirits", price: 5000 },
      { name: "Hardy's", description: "Wine & spirits", price: 8000 }, { name: "Jameson", description: "Wine & spirits", price: 8000 },
      { name: "Tequila Gold", description: "Wine & spirits", price: 8000 }, { name: "Black Label Bottle", description: "Wine & spirits", price: 10000 },
      { name: "Hennessy VS", description: "Wine & spirits", price: 15000 }, { name: "Nederburg", description: "Wine & spirits", price: 8000 },
    ],
  },
];

export const menuCategoryLinks = [
  { id: "breakfast", label: "Breakfast" }, { id: "starters", label: "Starters" },
  { id: "sides", label: "Sides" }, { id: "salads", label: "Salads" }, { id: "mains", label: "Mains" },
  { id: "pasta", label: "Pasta" }, { id: "sandwiches", label: "Sandwiches" }, { id: "burgers", label: "Burgers" },
  { id: "coffee-tea", label: "Coffee & Tea" }, { id: "drinks", label: "Drinks" },
];

export function formatNaira(price: number) {
  return `₦${price.toLocaleString("en-NG")}`;
}
