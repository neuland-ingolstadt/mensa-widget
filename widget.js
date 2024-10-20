async function getFoodPlan(locations) {
  const query = `
    query {
      food(locations: [${locations.map((x) => `"${x}"`).join(',')}]) {
        foodData {
          timestamp
          meals {
            name {
              de
            }
            category
            prices {
              student
            }
            prices {
              student
            }
            static
            restaurant
          }   
        }
      }
    }
  `;

  const req = new Request('https://api.neuland.app/graphql');
  req.method = 'POST';
  req.headers = {
    'Content-Type': 'application/json',
  };
  req.body = JSON.stringify({ query });

  const response = await req.loadJSON();
  return response;
}

async function createWidget() {
  const result = await getFoodPlan(['IngolstadtMensa'])
  console.log(result)
  const [{timestamp, meals}] = result.data.food.foodData
  const mainMeals = meals.filter(meal => meal.category === 'main' && meal.static === false)
  const widget = new ListWidget()
  widget.url = `https://neuland.app/food`
  
  const icon = widget.addText(`Mensa`)
  icon.font = Font.boldSystemFont(16)
  
  widget.addSpacer(4)
  
  const date = widget.addText(new Date(timestamp).toLocaleDateString('de', { weekday: 'long', day: 'numeric', month: 'numeric' }))
  date.font = Font.mediumSystemFont(14)

  widget.addSpacer(8)
  
  for (const meal of mainMeals) {
    const stack = widget.addStack()
    
    const typeText = stack.addText(meal.name.de)
    typeText.font = Font.systemFont(14)
    
    stack.addSpacer()
    
    const priceText = stack.addText(meal.prices.student?.toLocaleString('de', { style: 'currency', currency: 'EUR' }))
    priceText.font = Font.systemFont(14)
    priceText.textColor = Color.gray()
    
    widget.addSpacer(8)
  }
  
  widget.addSpacer()
  
  return widget
}

const widget = await createWidget()

if (!config.runsInWidget) {
  widget.presentMedium()
}

Script.setWidget(widget)
Script.complete()
