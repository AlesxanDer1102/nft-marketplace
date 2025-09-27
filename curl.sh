curl --request POST \
  --url https://api.circle.com/v1/w3s/compliance/screening/addresses \
  --header 'Content-Type: application/json' \
  --header 'authorization: Bearer TEST_API_KEY:da55b7206c1b3f41ac1f5fad32f8cfa8:961ecedd4f3def5139068f42ebfb2a1b' \
  --data '{
    "idempotencyKey": "74f64f0f-4b87-4b15-8936-ead67b93a7b1",
    "address": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    "chain": "ETH-SEPOLIA"
}'

