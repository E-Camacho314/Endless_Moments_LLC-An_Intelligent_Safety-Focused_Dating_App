import os, stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
if not stripe.api_key:
    raise SystemExit("Set STRIPE_SECRET_KEY")

premium = stripe.Product.create(name="Lyra Premium")
event_ticket = stripe.Product.create(name="Lyra Event Ticket")

p_month = stripe.Price.create(product=premium.id, unit_amount=999, currency="usd", recurring={"interval":"month"})
p_year  = stripe.Price.create(product=premium.id, unit_amount=9999, currency="usd", recurring={"interval":"year"})
t_ticket = stripe.Price.create(product=event_ticket.id, unit_amount=1000, currency="usd")

print("Premium (monthly):", p_month.id)
print("Premium (yearly): ", p_year.id)
print("Event ticket:      ", t_ticket.id)
