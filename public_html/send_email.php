<?php
/**
 * OPTUNE - Contact Form Handler
 * Sube este archivo a la raíz de tu sitio en Hostinger (misma carpeta que index.html)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Leer y decodificar JSON del body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validaciones básicas
if (empty($data['nombre']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nombre y email son obligatorios']);
    exit;
}

// Sanitizar datos
$nombre  = htmlspecialchars(strip_tags(trim($data['nombre'])));
$email   = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$empresa = htmlspecialchars(strip_tags(trim($data['empresa'] ?? '')));
$mensaje = htmlspecialchars(strip_tags(trim($data['mensaje'] ?? '')));

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

// ── Configuración ──────────────────────────────────────────────
$destinatario = 'optune@optune.tech';
$asunto       = "Nueva solicitud de demo - $nombre";
// ───────────────────────────────────────────────────────────────

// Cuerpo del correo en HTML
$cuerpo = "
<!DOCTYPE html>
<html lang='es'>
<head>
  <meta charset='UTF-8'>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .card { background: #ffffff; border-radius: 10px; padding: 32px; max-width: 560px; margin: auto; }
    .header { background: linear-gradient(135deg, #0D9488, #0891b2); border-radius: 8px; padding: 20px 24px; margin-bottom: 28px; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; }
    .header p  { color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 4px; }
    .value { font-size: 16px; color: #111827; background: #f9fafb; border-left: 3px solid #0D9488; padding: 10px 14px; border-radius: 0 6px 6px 0; }
    .footer { margin-top: 28px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='header'>
      <h1>🚀 Nueva Solicitud de Demo</h1>
      <p>Alguien completó el formulario en optune.co</p>
    </div>

    <div class='field'>
      <div class='label'>Nombre</div>
      <div class='value'>$nombre</div>
    </div>

    <div class='field'>
      <div class='label'>Email</div>
      <div class='value'>$email</div>
    </div>

    <div class='field'>
      <div class='label'>Empresa</div>
      <div class='value'>" . ($empresa ?: '—') . "</div>
    </div>

    <div class='field'>
      <div class='label'>Mensaje</div>
      <div class='value'>" . nl2br($mensaje ?: '—') . "</div>
    </div>

    <div class='footer'>Este mensaje fue generado automáticamente por el formulario de Optune.</div>
  </div>
</body>
</html>
";

// Headers del correo
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Optune Web <noreply@optune.co>\r\n";
$headers .= "Reply-To: $email\r\n";

// Enviar correo
$enviado = mail($destinatario, $asunto, $cuerpo, $headers);

if ($enviado) {
    echo json_encode(['success' => true, 'message' => '¡Mensaje enviado con éxito!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al enviar el correo. Intenta de nuevo.']);
}