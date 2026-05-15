# 3BC – Subscription & Payments

This branch implements the first frontend version of the Subscription & Payments bounded context.

## Implemented scope

- Responsive subscription dashboard view.
- Current active plan summary.
- Available plans cards.
- Payment method list.
- Current plan usage indicators.
- Billing history table.
- EN/ES localization keys.
- JSON Server mock resources.

## DDD structure

- `application/services`: facade for presentation consumption.
- `application/state`: selected plan state.
- `domain/entities`: subscription plan entity.
- `domain/models`: current subscription, payment method, billing record and dashboard models.
- `infrastructure/http`: HTTP data source with fallback data.
- `presentation/components`: reusable plan card.
- `presentation/views`: subscription page.

## Route

`/app/subscriptions`
