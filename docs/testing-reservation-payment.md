# 예약 ↔ 결제 연동 테스트 가이드

프론트는 이미 연동 완료된 상태입니다: `PickupDetailsPage → ReviewReservationPage`가 실제
`POST /reservations`를 호출하고, `PaymentPage`가 그 응답의 Stripe `clientSecret`으로 결제를
진행한 뒤 `ReservationCompletePage`로 넘어갑니다. `MyReservationPage`/`ReservationDetailPage`/
`ExchangeHistoryPage`/`ReservationCancelledPage`도 전부 mock이 아니라 실제 API를 봅니다.

여기서는 로컬 서버(`server` 레포)에 로컬 프론트(`client` 레포)를 붙여서 이 흐름 전체를
end-to-end로 테스트하는 방법을 정리합니다.

## 0. 사전 준비

### 0-1. DB에 테스트 데이터 넣기

`server/src/main/resources/db/data/`에 있는 SQL을 **순서대로** 로컬 DB에 실행합니다
(Flyway 마이그레이션이 아니라 수동 로드 픽스처입니다 — 자세한 설명은 그 폴더의
`README.md` 참고):

```bash
cd server
mysql -u <user> -p travelx < src/main/resources/db/data/01_currencies.sql
mysql -u <user> -p travelx < src/main/resources/db/data/02_branches.sql
mysql -u <user> -p travelx < src/main/resources/db/data/03_branch_currency_setup.sql
```

이 SQL이 만들어주는 지점/통화 조합 (테스트할 때 이 표를 기준으로 지점·통화·금액을 고르면 됩니다):

| branch_id | 지점명 | 취급 통화 (`branch_supported_currencies`) | 통화별 우대율 / 재고 (`branch_currency_rates`) |
|---|---|---|---|
| 1 | TravelX Myeongdong | USD, VND, JPY | USD 0.5% / 5,000 · VND 0.3% / 5억 · JPY 0.4% / 100만 |
| 2 | TravelX Gangnam | USD, VND, EUR | USD 0.6% / 5,000 · VND 0.2% / 5억 · EUR 0.5% / 20만 |
| 3 | TravelX Incheon Airport T1 | USD, VND, JPY, EUR, CNY | (24시간 영업, 재고 넉넉) |
| 4 | TravelX Incheon Airport T2 | USD, VND, JPY, EUR | (24시간 영업, 재고 넉넉) |

기준환율(`currencies` 테이블, `01_currencies.sql`)은 USD 1360, VND 0.058, JPY 910, EUR 1460,
CNY 190 (KRW per 1 unit, sell_rate 기준) 입니다. `PickupDetailsPage`의 "Rate: 1 XXX = ... KRW"
표시가 여기서 나옵니다.

`branch_time_slots`는 시드하지 않아도 됩니다 — 첫 예약 생성 시 서버가 자동으로 만듭니다.

### 0-2. Stripe 테스트 키

`server`의 로컬 환경변수(`.env.local` 등)에 **Stripe 테스트 키**가 설정돼 있어야 합니다:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

`PaymentGatewayImpl`이 실제로 Stripe API를 호출하므로, 이 값이 없거나 잘못되면
`ReviewReservationPage`에서 "Confirm reservation"을 눌렀을 때 예약 생성 자체가
`PAYMENT_INTENT_CREATE_FAILED`로 실패합니다.

Stripe CLI로 로컬에 웹훅을 흘려보내야 결제 승인이 실제로 반영됩니다 (승인은
`StripeWebhookController`가 웹훅으로만 처리하므로, 웹훅이 안 오면 카드 결제까지는 성공해도
예약 상태가 영원히 `PENDING_PAYMENT`에 머뭅니다):

```bash
stripe listen --forward-to localhost:3005/webhooks/stripe
```

### 0-3. 서버/프론트 실행

```bash
# server
cd server
./gradlew bootRun --args='--spring.profiles.active=local'

# client
cd client
npm run dev
```

`client/src/constants/api.ts`가 `DEV`일 때 `http://localhost:3005`를 바라보므로, 로컬 서버가
그 포트로 뜨는지 확인하세요 (`SPRING_PORT` 환경변수).

## 1. 로그인 (Google OAuth 없이)

`application-local.yml`은 `travelx.dev.auth.enabled=true`가 기본값이라 `/dev/auth/token`으로
로그인 없이 바로 유저+토큰을 받을 수 있습니다:

```bash
curl -X POST http://localhost:3005/dev/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email":"tester@example.com","role":"USER"}'
```

응답의 `accessToken`, `user`를 프론트가 쓰는 형태 그대로 브라우저 콘솔에서 넣어주면 로그인
상태가 됩니다 (`client/src/constants/storage.ts` 키 이름 기준):

```js
localStorage.setItem('travelx.accessToken', '<위에서 받은 accessToken>')
localStorage.setItem('travelx.user', JSON.stringify(<위 응답의 user 객체>))
```

넣은 뒤 페이지를 새로고침하면 로그인된 상태로 시작합니다 (전화번호 인증도 `/dev/auth/token`이
자동으로 완료 처리해줘서 별도 인증 없이 예약 생성까지 바로 됩니다).

## 2. 예약 → 결제 → 완료 흐름 테스트

1. `/branch/1` (또는 2/3/4) 접속 → "Rates at this branch" 확인 → **Reserve now**
2. `/reserve/1` (PickupDetailsPage) — 날짜/시간 슬롯 선택, 금액 입력 (위 표의 통화 중 하나로,
   너무 작거나 크게 넣지 않기 — 아래 "금액 제한" 참고) → **Continue**
3. `/reserve/1/review` — 내용 확인 → **Confirm reservation**
   - 여기서 실제 `POST /reservations`가 나가고, 성공하면 Stripe `clientSecret`을 받아
     `/reserve/1/payment`로 이동합니다.
4. `/reserve/1/payment` — Stripe 테스트 카드 입력:
   - 카드번호 `4242 4242 4242 4242`, 유효기간 아무 미래 날짜, CVC 아무 3자리, 우편번호 아무 값
   - **Pay now**
5. 결제 성공 시 `/reserve/1/complete`로 자동 이동 (실제 `reservationNumber` 표시).
   - `stripe listen`이 웹훅을 서버로 잘 전달했다면 몇 초 안에 예약 상태가
     `PENDING_PAYMENT → RESERVED`로 바뀌고 QR 토큰이 발급됩니다.
6. `/mypage/reservations`에서 방금 만든 예약이 실제로 뜨는지 확인 (mock 목록이 아니라
   `GET /reservations?status=PENDING_PAYMENT,RESERVED` 결과입니다).
7. 예약 상세(`/mypage/reservations/{id}`)에서 **Cancel reservation** → 실제
   `DELETE /reservations/{id}` 호출 → `/mypage/reservations/{id}/cancelled` 표시 확인.
8. `/mypage/history`에서 취소된 건이 "Cancelled" 탭에 뜨는지 확인
   (`GET /reservations?status=CANCELLED,EXPIRED`).

## 3. 금액 제한 (테스트 시 참고)

`ReservationService.assertAmountWithinLimits`가 KRW 환산 기준으로 막습니다:

- **상한**: USD 10,000 상당액 이상이면 `AMOUNT_LIMIT_EXCEEDED` (USD sell_rate 1360 기준
  KRW 13,600,000 이상 환산되는 금액은 막힘)
- **하한**: VND 10,000 상당액 미만이면 `AMOUNT_BELOW_MINIMUM` (VND sell_rate 0.058 기준
  KRW 580 미만이면 막힘)

이 두 통화(USD/VND)의 `currencies` 행이 시드에 없으면 이 검증 자체가 조용히 스킵되니,
`01_currencies.sql`을 꼭 먼저 실행하세요.

## 4. 자주 걸리는 문제

- **"Concurrent pending payment" 에러로 예약이 안 만들어짐**: 같은 유저가 결제 안 끝낸
  `PENDING_PAYMENT` 예약을 이미 갖고 있으면 새 예약을 못 만듭니다(`CONCURRENT_PENDING_PAYMENT_LIMIT`).
  결제 TTL(5분)이 지나면 배치가 자동으로 풀어주거나, DB에서 해당 reservation row를 직접 지우면
  됩니다.
- **결제는 성공했는데 상태가 계속 PENDING_PAYMENT**: 웹훅이 안 온 것 — `stripe listen`이
  켜져 있는지, forward 경로가 맞는지 확인하세요.
- **재고 부족(STOCK_EXCEEDED)**: `branch_currency_rates.reservation_only_stock`이 부족한
  경우입니다. 시드 값은 넉넉하게 잡아뒀지만, 반복 테스트로 소진됐다면 `03_branch_currency_setup.sql`을
  다시 실행해 값을 리셋하세요 (`UPDATE`가 아니라 `INSERT`라 이미 행이 있으면 중복 키 에러가
  나니, 먼저 `DELETE FROM branch_currency_rates;`로 비우고 다시 실행).
