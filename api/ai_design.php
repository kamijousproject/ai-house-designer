<?php
// public/api/ai_design.php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/config.php'; // กำหนด OPENAI_MODEL + อ่าน ENV OPENAI_API_KEY

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
$prompt = trim($body['prompt'] ?? '');
if ($prompt === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Empty prompt']);
  exit;
}

// ----- JSON schema (เหมือนเดิม) -----
$schema = [
  'type' => 'object',
  'additionalProperties' => false,
  'properties' => [
    'plotW'     => ['type' => 'number'],
    'plotL'     => ['type' => 'number'],
    'floors'    => ['type' => 'integer'],
    'floorH'    => ['type' => 'number'],
    'roofType'  => ['type' => 'string', 'enum' => ['gable', 'hip', 'shed', 'flat']],
    'color'     => ['type' => 'string'],
    'floodRisk' => ['type' => 'boolean'],
    'softSoil'  => ['type' => 'boolean'],
    'style'     => ['type' => 'string', 'enum' => [
      'modern',
      'contemporary',
      'classic',
      'loft',
      'nordic',
      'minimal',
      'thai_oriental',
      'colonial',
      'natural',
      'tropical',
      'vintage',
      'luxury',
      'retro',
      'thai'
    ]],
    'rationale' => ['type' => 'string'],
  ],
  'required' => ['plotW', 'plotL', 'floors', 'floorH', 'roofType', 'color', 'floodRisk', 'softSoil', 'style']
];

$system = <<<SYS
คุณคือผู้ช่วยออกแบบบ้านที่ตอบกลับเป็น JSON เท่านั้น
- อ่านความต้องการผู้ใช้
- แปลงเป็นคอนฟิกสำหรับหน้า Designer
- ห้ามตอบข้อความอื่นนอกจาก JSON
SYS;

$payload = [
  'model' => OPENAI_MODEL,
  'response_format' => [
    'type' => 'json_schema',
    'json_schema' => [
      'name' => 'HouseDesign',
      'strict' => true,
      'schema' => $schema
    ]
  ],
  'temperature' => 0.2,
  'messages' => [
    ['role' => 'system', 'content' => $system],
    ['role' => 'user',   'content' => $prompt]
  ],
];

// ---------- cURL helper (retry + timeout + IPv4) ----------
function openai_post_with_retry(string $url, array $payload, string $apiKey, int $maxAttempts = 3): array {
  $attempt = 0;
  $lastErr = null;

  while ($attempt < $maxAttempts) {
    $attempt++;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST           => true,
      CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
        'Connection: keep-alive',
        // ป้องกันบาง proxy ชอบรอ Expect: 100-continue
        'Expect:'
      ],
      CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
      // ตั้ง timeout สั้นลง + แยก connect/transfer
      CURLOPT_CONNECTTIMEOUT => 10,   // วินาที รอเชื่อมต่อ
      CURLOPT_TIMEOUT        => 30,   // วินาที รวมการรับส่ง
      // บังคับ IPv4 กันเคส IPv6 routing พัง
      CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
      // ใช้ HTTP/1.1 ที่เสถียรกว่าในบางโฮสต์
      CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
      // เปิด keepalive (ใน libcurl สมัยใหม่ค่า default เป็น true อยู่แล้ว)
      CURLOPT_TCP_KEEPALIVE  => 1,
    ]);

    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($res === false) {
      $lastErr = 'cURL error: ' . curl_error($ch);
      curl_close($ch);
    } else {
      curl_close($ch);
      $json = json_decode($res, true);
      if ($http >= 200 && $http < 300 && is_array($json)) {
        return ['ok' => true, 'json' => $json, 'http' => $http, 'attempt' => $attempt];
      }
      $msg = $json['error']['message'] ?? ('HTTP ' . $http);
      $lastErr = 'HTTP error: ' . $msg;
      // รหัส 429/5xx → เหมาะกับ retry
      if (in_array($http, [408, 409, 425, 429, 500, 502, 503, 504], true)) {
        // fall through ไป backoff
      } else {
        // error ประเภทอื่นไม่ค่อยช่วยให้ retry
        break;
      }
    }

    // Exponential backoff: 0.6s, 1.2s, 2.4s…
    $sleepMs = (int)(600 * pow(2, $attempt - 1));
    usleep($sleepMs * 1000);
  }

  return ['ok' => false, 'error' => $lastErr ?? 'Unknown error after retries'];
}

// ---------- call API ----------
try {
  $resp = openai_post_with_retry(
    'https://api.openai.com/v1/chat/completions',
    $payload,
    $OPENAI_API_KEY,
    3 // จำนวน retry
  );

  if (!$resp['ok']) {
    throw new RuntimeException($resp['error'] ?? 'OpenAI request failed');
  }

  $json = $resp['json'];
  $content = $json['choices'][0]['message']['content'] ?? '{}';
  $data = json_decode($content, true);
  if (!is_array($data)) {
    throw new RuntimeException('Invalid JSON returned from model.');
  }

  echo json_encode(['ok' => true, 'data' => $data, 'attempt' => $resp['attempt']], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}