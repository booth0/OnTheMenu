import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Visibility } from "../src/generated/prisma/enums";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create seed users
  const passwordHash = await hash("password123", 10);

  const [alice, bob, carol] = await Promise.all([
    prisma.user.upsert({
      where: { username: "alice_cooks" },
      update: {},
      create: {
        username: "alice_cooks",
        email: "alice@example.com",
        password: passwordHash,
      },
    }),
    prisma.user.upsert({
      where: { username: "chef_bob" },
      update: {},
      create: {
        username: "chef_bob",
        email: "bob@example.com",
        password: passwordHash,
      },
    }),
    prisma.user.upsert({
      where: { username: "carol_kitchen" },
      update: {},
      create: {
        username: "carol_kitchen",
        email: "carol@example.com",
        password: passwordHash,
      },
    }),
  ]);

  console.log(`Created users: ${alice.username}, ${bob.username}, ${carol.username}`);

  // Recipe data
  const recipes = [
    {
      slug: "classic-spaghetti-carbonara",
      title: "Classic Spaghetti Carbonara",
      description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
      body: `## Ingredients
- 400g spaghetti
- 200g pancetta or guanciale, diced
- 4 large egg yolks
- 1 whole egg
- 100g Pecorino Romano, finely grated
- Freshly cracked black pepper
- Salt

## Instructions
1. Bring a large pot of salted water to a boil. Cook spaghetti until al dente.
2. While the pasta cooks, fry the pancetta in a large skillet over medium heat until crispy, about 5-7 minutes.
3. In a bowl, whisk together egg yolks, whole egg, and most of the Pecorino. Season generously with black pepper.
4. When pasta is cooked, reserve 1 cup of pasta water, then drain.
5. Add the hot pasta to the skillet with the pancetta (off the heat). Toss to combine.
6. Quickly pour in the egg mixture, tossing constantly so the eggs don't scramble. Add splashes of pasta water to reach a silky consistency.
7. Serve immediately topped with remaining Pecorino and more pepper.`,
      visibility: Visibility.PUBLIC,
      authorId: alice.id,
    },
    {
      slug: "honey-garlic-salmon",
      title: "Honey Garlic Salmon",
      description: "Flaky baked salmon glazed with a sweet and savoury honey-garlic sauce.",
      body: `## Ingredients
- 4 salmon fillets (6 oz each)
- 3 tbsp honey
- 2 tbsp soy sauce
- 4 cloves garlic, minced
- 1 tbsp olive oil
- 1 tbsp lemon juice
- Salt and pepper

## Instructions
1. Preheat oven to 400°F (200°C). Line a baking sheet with parchment.
2. Whisk together honey, soy sauce, garlic, olive oil, and lemon juice.
3. Place salmon fillets skin-side down on the baking sheet. Season with salt and pepper.
4. Spoon the honey-garlic glaze over each fillet.
5. Bake for 12-15 minutes until salmon flakes easily with a fork.
6. Broil for 1-2 minutes at the end for a caramelised finish.
7. Garnish with sesame seeds and sliced green onions.`,
      visibility: Visibility.PUBLIC,
      authorId: alice.id,
    },
    {
      slug: "thai-basil-chicken-stir-fry",
      title: "Thai Basil Chicken Stir-Fry",
      description: "A quick and punchy Thai stir-fry with ground chicken, chillies, and fresh basil.",
      body: `## Ingredients
- 500g ground chicken
- 1 cup Thai basil leaves
- 4 cloves garlic, minced
- 3 Thai chillies, sliced
- 2 tbsp oyster sauce
- 1 tbsp soy sauce
- 1 tbsp fish sauce
- 1 tsp sugar
- 2 tbsp vegetable oil
- Steamed jasmine rice, for serving

## Instructions
1. Heat oil in a wok over high heat until smoking.
2. Add garlic and chillies, stir-fry for 30 seconds.
3. Add ground chicken, breaking it apart. Cook until no longer pink, about 4-5 minutes.
4. Add oyster sauce, soy sauce, fish sauce, and sugar. Toss to coat.
5. Remove from heat and fold in the Thai basil until wilted.
6. Serve over steamed jasmine rice with a fried egg on top.`,
      visibility: Visibility.PUBLIC,
      authorId: bob.id,
    },
    {
      slug: "roasted-vegetable-soup",
      title: "Roasted Vegetable Soup",
      description: "A hearty, velvety soup made from oven-roasted vegetables and fresh herbs.",
      body: `## Ingredients
- 2 large carrots, chopped
- 2 parsnips, chopped
- 1 butternut squash, cubed
- 1 red onion, quartered
- 4 cloves garlic
- 3 tbsp olive oil
- 4 cups vegetable broth
- 1 tsp smoked paprika
- Salt and pepper
- Fresh thyme

## Instructions
1. Preheat oven to 425°F (220°C).
2. Spread carrots, parsnips, squash, onion, and garlic on a baking sheet. Drizzle with olive oil and season with salt, pepper, and paprika.
3. Roast for 35-40 minutes, stirring halfway, until caramelised and tender.
4. Transfer roasted vegetables to a large pot. Add broth and bring to a simmer.
5. Blend with an immersion blender until smooth.
6. Adjust seasoning and serve topped with a drizzle of olive oil and fresh thyme.`,
      visibility: Visibility.PUBLIC,
      authorId: bob.id,
    },
    {
      slug: "lemon-ricotta-pancakes",
      title: "Lemon Ricotta Pancakes",
      description: "Light and fluffy pancakes with a citrusy tang from lemon zest and creamy ricotta.",
      body: `## Ingredients
- 1 cup ricotta cheese
- 2 eggs, separated
- 3/4 cup milk
- 1 cup all-purpose flour
- 2 tbsp sugar
- 1 tsp baking powder
- Zest of 2 lemons
- 1 tbsp lemon juice
- Pinch of salt
- Butter for cooking

## Instructions
1. In a large bowl, whisk together ricotta, egg yolks, milk, lemon zest, and lemon juice.
2. In a separate bowl, combine flour, sugar, baking powder, and salt. Fold dry ingredients into the wet mixture.
3. Beat egg whites to stiff peaks and gently fold into the batter.
4. Heat a non-stick pan over medium-low heat. Add a small knob of butter.
5. Pour 1/4 cup of batter per pancake. Cook 2-3 minutes per side until golden.
6. Serve with fresh berries, a dusting of powdered sugar, and maple syrup.`,
      visibility: Visibility.PUBLIC,
      authorId: carol.id,
    },
    {
      slug: "braised-short-ribs",
      title: "Braised Short Ribs",
      description: "Fall-off-the-bone beef short ribs slow-braised in red wine and aromatics.",
      body: `## Ingredients
- 4 lbs bone-in beef short ribs
- 2 tbsp olive oil
- 1 onion, diced
- 2 carrots, diced
- 3 stalks celery, diced
- 4 cloves garlic, smashed
- 2 cups dry red wine
- 2 cups beef broth
- 2 tbsp tomato paste
- 2 sprigs rosemary
- 3 sprigs thyme
- 2 bay leaves
- Salt and pepper

## Instructions
1. Preheat oven to 325°F (165°C). Season short ribs generously with salt and pepper.
2. Heat olive oil in a large Dutch oven over high heat. Sear ribs on all sides until deep brown, about 3 minutes per side. Remove and set aside.
3. Reduce heat to medium. Add onion, carrots, and celery. Cook 5 minutes until softened.
4. Add garlic and tomato paste, cook 1 minute. Deglaze with red wine, scraping up browned bits.
5. Add broth, rosemary, thyme, and bay leaves. Return ribs to the pot. Liquid should come halfway up the ribs.
6. Cover and braise in the oven for 2.5-3 hours until ribs are fork-tender.
7. Remove ribs. Strain and reduce the braising liquid into a glossy sauce. Serve over creamy polenta or mashed potatoes.`,
      visibility: Visibility.PUBLIC,
      authorId: carol.id,
    },
    {
      slug: "mango-sticky-rice",
      title: "Mango Sticky Rice",
      description: "A beloved Thai dessert pairing sweet coconut sticky rice with ripe mango.",
      body: `## Ingredients
- 1.5 cups glutinous (sticky) rice
- 1 can (400ml) coconut milk
- 1/3 cup sugar
- 1/2 tsp salt
- 2 ripe mangoes, sliced
- Toasted sesame seeds

## Instructions
1. Soak sticky rice in water for at least 4 hours or overnight. Drain.
2. Steam the rice in a bamboo steamer or cheesecloth-lined colander for 20-25 minutes until tender and translucent.
3. While rice steams, warm coconut milk with sugar and salt in a saucepan until dissolved. Reserve 1/4 cup for topping.
4. Transfer steamed rice to a bowl and pour the coconut milk mixture over it. Stir gently, cover, and let sit 15 minutes to absorb.
5. Scoop rice onto plates alongside sliced mango. Drizzle with the reserved coconut sauce and sprinkle with sesame seeds.`,
      visibility: Visibility.PUBLIC,
      authorId: alice.id,
    },
    {
      slug: "shakshuka",
      title: "Shakshuka",
      description: "Eggs poached in a spiced tomato and pepper sauce — perfect for brunch.",
      body: `## Ingredients
- 6 eggs
- 1 can (28 oz) crushed tomatoes
- 1 red bell pepper, diced
- 1 onion, diced
- 4 cloves garlic, minced
- 2 tsp cumin
- 1 tsp smoked paprika
- 1/2 tsp chilli flakes
- 2 tbsp olive oil
- Salt and pepper
- Fresh cilantro and crumbled feta for serving
- Crusty bread

## Instructions
1. Heat olive oil in a large skillet over medium heat. Cook onion and bell pepper until softened, about 5 minutes.
2. Add garlic, cumin, paprika, and chilli flakes. Cook 1 minute until fragrant.
3. Pour in crushed tomatoes. Season with salt and pepper. Simmer 10 minutes until slightly thickened.
4. Make 6 small wells in the sauce. Crack an egg into each well.
5. Cover and cook 5-7 minutes until egg whites are set but yolks are still runny.
6. Top with crumbled feta and fresh cilantro. Serve straight from the skillet with crusty bread.`,
      visibility: Visibility.PUBLIC,
      authorId: bob.id,
    },
    {
      slug: "mushroom-risotto",
      title: "Mushroom Risotto",
      description: "Creamy Arborio rice cooked slowly with mixed mushrooms and Parmesan.",
      body: `## Ingredients
- 1.5 cups Arborio rice
- 300g mixed mushrooms (cremini, shiitake, oyster), sliced
- 1 shallot, finely diced
- 3 cloves garlic, minced
- 1/2 cup dry white wine
- 4 cups warm chicken or vegetable broth
- 1/2 cup Parmesan, grated
- 2 tbsp butter
- 2 tbsp olive oil
- Fresh thyme
- Salt and pepper

## Instructions
1. Heat broth in a saucepan and keep warm over low heat.
2. In a wide pan, heat olive oil over medium-high heat. Sauté mushrooms until golden, about 5 minutes. Season and set aside.
3. In the same pan, melt 1 tbsp butter. Cook shallot until translucent, then add garlic for 30 seconds.
4. Add rice and toast for 2 minutes, stirring constantly.
5. Pour in wine and stir until absorbed.
6. Add warm broth one ladle at a time, stirring frequently and waiting for each addition to absorb before adding the next. This takes about 18-20 minutes.
7. When rice is creamy and al dente, fold in mushrooms, remaining butter, and Parmesan. Season to taste.
8. Serve immediately, topped with fresh thyme and extra Parmesan.`,
      visibility: Visibility.PUBLIC,
      authorId: carol.id,
    },
    {
      slug: "black-bean-tacos",
      title: "Spicy Black Bean Tacos",
      description: "Quick vegetarian tacos loaded with seasoned black beans, pickled onions, and avocado crema.",
      body: `## Ingredients
- 2 cans black beans, drained and rinsed
- 1 tbsp olive oil
- 1 tsp cumin
- 1 tsp chilli powder
- 1/2 tsp garlic powder
- Salt and pepper

### Pickled Red Onions
- 1 red onion, thinly sliced
- 1/2 cup apple cider vinegar
- 1 tbsp sugar
- 1 tsp salt

### Avocado Crema
- 1 ripe avocado
- 1/4 cup sour cream
- Juice of 1 lime
- Salt

### For Serving
- 8 small corn tortillas
- Fresh cilantro
- Crumbled cotija cheese
- Lime wedges

## Instructions
1. **Pickled onions:** Combine vinegar, sugar, and salt. Add sliced onion and let sit at least 20 minutes.
2. **Avocado crema:** Blend avocado, sour cream, lime juice, and salt until smooth.
3. **Beans:** Heat oil in a skillet. Add beans, cumin, chilli powder, and garlic powder. Cook 5 minutes, mashing some beans for texture.
4. Warm tortillas in a dry skillet or over an open flame.
5. Load tortillas with beans, pickled onions, avocado crema, cilantro, and cotija. Serve with lime wedges.`,
      visibility: Visibility.PUBLIC,
      authorId: alice.id,
    },
  ];

  for (const recipe of recipes) {
    await prisma.recipe.upsert({
      where: { slug: recipe.slug },
      update: {},
      create: recipe,
    });
  }

  console.log(`Seeded ${recipes.length} recipes`);

  // Add some reviews
  const allRecipes = await prisma.recipe.findMany();
  const reviewers = [alice, bob, carol];

  const reviews = [
    { rating: 5, body: "Absolutely perfect carbonara. The key really is tossing off the heat!" },
    { rating: 4, body: "Great weeknight meal. I added extra garlic." },
    { rating: 5, body: "My family loved this! Will make again." },
    { rating: 3, body: "Good but I found it a bit too salty. Would reduce the soy sauce next time." },
    { rating: 4, body: "The glaze is incredible. Used it on chicken too." },
    { rating: 5, body: "Restaurant quality at home. The roasting step makes all the difference." },
    { rating: 4, body: "Fluffy and delicious. Lemon zest is a must!" },
    { rating: 5, body: "Best risotto recipe I've ever tried." },
    { rating: 4, body: "Easy to make and really flavourful." },
    { rating: 5, body: "My go-to brunch recipe now. The runny yolks in the spicy sauce are heavenly." },
  ];

  let reviewCount = 0;
  for (let i = 0; i < Math.min(reviews.length, allRecipes.length); i++) {
    // Pick a reviewer who isn't the recipe author
    const recipe = allRecipes[i];
    const reviewer = reviewers.find((r) => r.id !== recipe.authorId) ?? reviewers[0];

    const existing = await prisma.review.findFirst({
      where: { recipeId: recipe.id, authorId: reviewer.id },
    });

    if (!existing) {
      await prisma.review.create({
        data: {
          recipeId: recipe.id,
          authorId: reviewer.id,
          rating: reviews[i].rating,
          body: reviews[i].body,
        },
      });
      reviewCount++;
    }
  }

  console.log(`Seeded ${reviewCount} reviews`);
  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
