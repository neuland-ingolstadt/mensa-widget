async function createWidget() {
  const req = new Request('https://neuland.app/api/mensa')
  const [{ timestamp, meals }] = await req.loadJSON()
  
  const widget = new ListWidget()
  widget.url = `https://neuland.app/food`
  
  const icon = widget.addText(`Mensa`)
  icon.font = Font.boldSystemFont(16)
  
  widget.addSpacer(4)
  
  const date = widget.addText(new Date(timestamp).toLocaleDateString('de', { weekday: 'long', day: 'numeric', month: 'numeric' }))
  date.font = Font.mediumSystemFont(14)

  widget.addSpacer(8)
  
  for (const meal of meals) {
    const stack = widget.addStack()
    
    const typeText = stack.addText(meal.name)
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
