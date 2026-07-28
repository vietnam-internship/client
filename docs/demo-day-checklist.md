# 시연 당일 체크리스트

시연 직전에 이 순서대로만 확인하면 됩니다. 예약→결제→QR 전체 흐름을 처음부터 테스트하려면
[testing-reservation-payment.md](./testing-reservation-payment.md)를 같이 참고하세요.

## 1. Stripe 웹훅 포워딩 (필수 — 시연 내내 켜두기)

결제 승인은 Stripe 웹훅으로만 반영됩니다(`PaymentService.handlePaymentSucceeded`). 이게 안
오면 **카드 결제 자체는 Stripe에서 성공해도 예약 상태(`PENDING_PAYMENT → RESERVED`)와 QR
발급이 절대 일어나지 않습니다.**

```bash
# 최초 1회 — 배포 서버의 STRIPE_SECRET_KEY와 같은 Stripe 계정/테스트 모드로 로그인
stripe login

# 시연 시작 전에 실행하고, 시연 끝날 때까지 이 터미널을 종료하지 말 것
stripe listen --forward-to https://api.knu80th.shop/webhooks/stripe
```

실행하면 다음처럼 나옵니다 (**매번 새로 발급되는 값**):

```
Ready! Your webhook signing secret is whsec_xxxxxxxx (^C to quit)
```

이 `whsec_...`를 배포 서버 Secret에 반영하고 재시작합니다 (`StripeWebhookController`가 이
값으로 서명을 검증하므로, 안 맞으면 400으로 조용히 튕겨져서 증상이 똑같이 재현됩니다):

```bash
sudo kubectl patch secret travelx-server-secret --type merge -p '{"stringData":{"STRIPE_WEBHOOK_SECRET":"whsec_xxxxxxxx"}}'
sudo kubectl rollout restart deploy travelx-server
sudo kubectl rollout status deploy travelx-server
```

### 안 되면 확인할 것

- `stripe listen` 터미널에 이벤트가 실제로 찍히는지 — 안 찍히면 Stripe 계정이 배포 서버의
  `STRIPE_SECRET_KEY`와 다른 계정으로 로그인된 것.
- 서버 로그에 서명 검증 실패가 있는지:
  ```bash
  sudo kubectl logs -l app=travelx-server --tail=50 | grep -i "서명 검증 실패"
  ```
  나오면 `whsec_...` 값이 다시 발급된(터미널을 재시작한) 이전 값 그대로 남아있는 것 —
  현재 `stripe listen` 창에 찍힌 값으로 다시 patch.

### 참고 — 이건 임시방편입니다

`stripe listen`은 로컬 CLI 프로세스에 의존하므로 노트북 절전/네트워크 끊김/터미널 종료에
전부 취약합니다. 시연이 아니라 상시 운영이라면, Stripe 대시보드에 배포 서버 URL
(`https://api.knu80th.shop/webhooks/stripe`)을 웹훅 엔드포인트로 직접 등록하고 그때 발급되는
고정 서명 시크릿을 `STRIPE_WEBHOOK_SECRET`에 넣는 게 맞습니다 — 그러면 이 단계 자체가
필요 없어집니다.

## 2. QR 생성 ↔ 스캔 정합성 (코드로 이미 수정 완료 — 재확인용 요약)

| 단계 | 위치 | 값 |
|---|---|---|
| 토큰 생성 | `PaymentService.generateQrToken()` | base64url 24바이트 (`:` 문자 없음) |
| DB 저장 | `Reservation.issueQrToken()` | 웹훅으로 결제 승인될 때만 발급 |
| 고객 QR 페이로드 | `ReservationDetailResponse.qrPayload` | `"{branchId}:{reservationId}:{token}"` (RESERVED 상태에서만 값 있음) |
| 고객 화면 렌더링 | `client/src/components/QrCode.tsx` | 위 문자열을 `qrcode` 라이브러리로 그대로 인코딩 |
| 관리자 스캔 파싱 | `client/src/utils/qr.ts`의 `extractQrToken()` | `:` 기준 3파트로 나눠 순수 토큰만 추출 (형식 안 맞으면 입력값 그대로 토큰 취급) |
| 관리자 조회/리딤 | `ReservationRepository.findByBranchIdAndQrToken`, `redeem()`의 `constantTimeEquals` | 추출된 순수 토큰과 DB 저장값을 그대로 비교 |

토큰 문자셋에 `:`가 없어서 3파트 split이 항상 안전하고, 생성부터 스캔까지 같은 원본 토큰
값이 그대로 오갑니다 — 별도 조치 불필요, 이미 반영되어 있습니다.

## 3. 예약 → 결제 → QR 전체 흐름 (시연 리허설용)

1. `/branch/{id}` → Reserve now
2. 날짜/시간/금액 입력 → Continue → Confirm reservation (`POST /reservations` 실제 호출)
3. Stripe 테스트 카드(`4242 4242 4242 4242`, 임의 미래 만료일/CVC) → Pay now
4. **1번 항목의 웹훅 포워딩이 켜져 있으면** 몇 초 안에 예약이 `RESERVED`로 바뀌고
   `/mypage/reservations/{id}`에서 QR이 뜸
5. 관리자 QR Scan 화면에서 해당 QR(또는 토큰)을 입력 → 예약 정보 확인 → Complete/Reject

전체 시드 데이터(지점/통화/재고)와 로그인 방법은
[testing-reservation-payment.md](./testing-reservation-payment.md)에 정리돼 있습니다.
