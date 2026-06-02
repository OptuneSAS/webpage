<?php
/**
 * OPTUNE - Portal de Clientes
 * Ubicación: public_html/send.php (raíz)
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$input = file_get_contents('php://input');
$data  = json_decode($input, true);

if (empty($data['nombre']) || empty($data['mensaje'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan campos obligatorios']);
    exit;
}

$nombre  = htmlspecialchars(strip_tags(trim($data['nombre'])));
$mensaje = htmlspecialchars(strip_tags(trim($data['mensaje'])));

$destinatario = 'optune@optune.tech';
$asunto       = 'Nuevo diagnóstico recibido — Portal Optune';

$cuerpo = "
<!DOCTYPE html>
<html lang='es'>
<head>
  <meta charset='UTF-8'>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .card { background: #ffffff; border-radius: 10px; padding: 32px; max-width: 560px; margin: auto; }
    .header { background: linear-gradient(135deg, #7c6dfa, #a78bfa); border-radius: 8px; padding: 20px 24px; margin-bottom: 28px; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; }
    .header p  { color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 4px; }
    .value { font-size: 15px; color: #111827; background: #f9fafb; border-left: 3px solid #7c6dfa; padding: 12px 14px; border-radius: 0 6px 6px 0; line-height: 1.6; white-space: pre-wrap; }
    .footer { margin-top: 28px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='header'>
      <h1>📋 Nuevo Diagnóstico Recibido</h1>
      <p>Un cliente completó el formulario en el portal de Optune</p>
    </div>
    <div class='field'>
      <div class='label'>Diagnóstico</div>
      <div class='value'>" . nl2br($mensaje) . "</div>
    </div>
    <div class='footer'>Generado automáticamente por el Portal de Clientes · Optune</div>
  </div>
</body>
</html>";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Optune Portal <noreply@optune.tech>\r\n";
$headers .= "Reply-To: optune@optune.tech\r\n";

$enviado = mail($destinatario, $asunto, $cuerpo, $headers);

if ($enviado) {
    echo json_encode(['success' => true, 'message' => '¡Diagnóstico enviado con éxito!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al enviar. Intenta de nuevo.']);
}
