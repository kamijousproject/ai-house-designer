<?php
// public/api/config.php
declare(strict_types=1);

/**
 * ตั้งค่า OpenAI API:
 * - แนะนำตั้ง ENV: OPENAI_API_KEY
 *   บน Linux: export OPENAI_API_KEY="sk-..."
 *   บน Windows (PowerShell): setx OPENAI_API_KEY "sk-..."
 * - หรือใส่ไว้ในไฟล์ .env ที่ root ของโปรเจ็กต์
 */
const OPENAI_MODEL = 'gpt-4o-mini'; // รุ่นเบา-เร็ว รองรับ JSON/Structured Outputs ดี

// ลองอ่านจาก environment variable ก่อน
$OPENAI_API_KEY = getenv('OPENAI_API_KEY');

// ถ้ายังไม่มี ลองโหลดจากไฟล์ .env
if (!$OPENAI_API_KEY) {
  $envPath = __DIR__ . '/../.env';
  if (file_exists($envPath)) {
    $envContent = file_get_contents($envPath);
    if (preg_match("/^OPENAI_API_KEY\s*=\s*['\"]?(.+?)['\"]?\s*$/m", $envContent, $matches)) {
      $OPENAI_API_KEY = trim($matches[1]);
    }
  }
}

// ตรวจสอบว่ามี API Key หรือไม่
if (!$OPENAI_API_KEY) {
  http_response_code(500);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok' => false, 'error' => 'OPENAI_API_KEY not set. Please set environment variable or add to .env file.']);
  exit;
}